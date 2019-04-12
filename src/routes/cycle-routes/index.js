import { Router } from 'express';
import { applyPatch } from 'fast-json-patch';
import clone from 'clone-deep';
import joi from 'joi';

import { catchAsyncErrors, clientError } from '~/modules/error-handling';
import { validate } from '~/modules/validate';
import { add, patch } from '~/schemas/route';

async function getById(db, id) {
  const [item] = await db.select()
    .from('routes')
    .where({ id });

  return item;
}

function processRouteResponse(item) {
  const {
    points,
    mid_lon: midLon,
    mid_lat: midLat,
    ...route
  } = item;

  return {
    ...route,
    points: JSON.parse(points),
    midPoint: [midLon, midLat],
  };
}

function makeRouteDocument(input) {
  const {
    origin,
    destination,
    points,
    midPoint: [midLon, midLat],
    length,
    bearing,
  } = input;

  return {
    origin,
    destination,
    points: JSON.stringify(points),
    mid_lon: midLon,
    mid_lat: midLat,
    length: Math.round(length),
    bearing,
  };
}

function routeCreate(config, logger, db) {
  return catchAsyncErrors(async (req, res) => {
    const route = makeRouteDocument(req.validBody);

    const { origin, destination } = route;

    const uniqueExists = await db.select()
      .from('routes')
      .where({ origin, destination });

    if (uniqueExists.length) {
      throw clientError('A duplicate route exists with the same origin and destination');
    }

    const [id] = await db.insert(route)
      .returning('id')
      .into('routes');

    const addedRoute = await getById(db, id);

    res.status(201).json(processRouteResponse(addedRoute));
  });
}

function routeRead(config, logger, db) {
  return catchAsyncErrors(async (req, res) => {
    if (!req.params.id) {
      const cycleRoutes = await db.select(
        'id',
        'origin',
        'destination',
        'length',
        'bearing',
      )
        .from('routes');

      return res.json(cycleRoutes);
    }

    const cycleRoute = await getById(db, req.params.id);
    if (!cycleRoute) {
      throw clientError('Route not found', 404);
    }

    return res.json(processRouteResponse(cycleRoute));
  });
}

function routeUpdate(config, logger, db) {
  return catchAsyncErrors(async (req, res) => {
    if (!(req.body && Array.isArray(req.body))) {
      throw clientError('Invalid patch');
    }

    const oldRouteRow = await getById(db, req.params.id);
    if (!oldRouteRow) {
      throw clientError('Route not found', 404);
    }

    const oldRoute = processRouteResponse(oldRouteRow);

    let newDocument = null;
    try {
      ({ newDocument } = applyPatch(clone(oldRoute), req.body));
    } catch (err) {
      throw clientError('Invalid patch');
    }

    const { error } = joi.validate(newDocument, patch(oldRoute));
    if (error) {
      throw clientError(`Invalid data: ${error.message}`);
    }

    const { id, ...newRoute } = newDocument;

    await db('routes')
      .update(makeRouteDocument(newRoute))
      .where({ id: req.params.id });

    res.status(204).end();
  });
}

function routeDelete(config, logger, db) {
  return catchAsyncErrors(async (req, res) => {
    const [{ count }] = await db.select(db.raw('count(*) as count'))
      .from('routes')
      .where({ id: req.params.id });

    if (Number(count) === 0) {
      throw clientError('Route not found', 404);
    }

    await db('routes')
      .where({ id: req.params.id })
      .delete();

    res.status(204).end();
  });
}

export function routeCycleRoutes(config, logger, db) {
  const router = new Router();

  router.get('/:id?', routeRead(config, logger, db));

  router.post('/', validate(add), routeCreate(config, logger, db));

  router.patch('/:id', routeUpdate(config, logger, db));

  router.delete('/:id', routeDelete(config, logger, db));

  return router;
}
