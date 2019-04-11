import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import debounce from 'debounce';
import OLMap from 'ol/Map';
import View from 'ol/View';
import { transform, toLonLat } from 'ol/proj';
import { Draw, Modify, Snap } from 'ol/interaction';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import {
  Circle as CircleStyle,
  Fill,
  Stroke,
  Style,
} from 'ol/style';

import 'ol/ol.css';

import { HOME, PROJECTION } from '~/constants/map';
import { EMPTY_LINE } from '~/client/constants/route';
import { useInteraction } from '~/client/hooks/interaction';
import { getLength, getAverageBearing } from '~/client/modules/bearing';

import './style.scss';

const fillColor = 'rgba(255, 255, 255, 0.2)';
const strokeColor = 'rgb(4, 11, 86)';
const pointColor = strokeColor;

function getProcessedLine(line) {
  const geometry = line.getGeometry();
  const points = geometry.getCoordinates()
    .map(point => toLonLat(point, PROJECTION))
    .reduce((last, coords) => last.concat(coords), []);

  const length = getLength(points);
  const bearing = getAverageBearing(points);
  const midPoint = toLonLat(geometry.getFlatMidpoint(), PROJECTION);

  return {
    points,
    midPoint,
    length,
    bearing,
  };
}

export default function RouteEditor({ initialLine, onChange }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [drawing, setDrawing] = useState(initialLine.points.length === 0);

  const raster = useMemo(() => new TileLayer({
    source: new OSM(),
  }), []);

  const source = useMemo(() => new VectorSource(), []);

  const handleChange = useCallback(debounce(() => {
    const features = source.getFeatures();
    if (features.length !== 1) {
      return onChange(EMPTY_LINE);
    }

    const processedLine = getProcessedLine(features[0]);

    return onChange(processedLine);
  }, 10, true), [source, onChange]);

  useEffect(() => {
    if (!source) {
      return;
    }

    ['changefeature', 'addfeature'].forEach(event => {
      source.un(event);
      source.on(event, handleChange);
    });
  }, [source, handleChange]);

  const vector = useMemo(() => new VectorLayer({
    source,
    style: new Style({
      fill: new Fill({
        color: fillColor,
      }),
      stroke: new Stroke({
        color: strokeColor,
        width: 2,
      }),
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: pointColor,
        }),
      }),
    }),
  }), [source]);

  useEffect(() => {
    setMap(new OLMap({
      layers: [raster, vector],
      target: mapRef.current,
      view: new View({
        center: transform(HOME, 'EPSG:4326', PROJECTION),
        zoom: 10,
      }),
    }));
  }, [raster, vector]);

  useInteraction(() => new Modify({ source }), map, [source]);

  const draw = useMemo(() => {
    const interaction = new Draw({ source, type: 'LineString' });

    interaction.on('drawend', () => {
      setDrawing(false);
    });

    return interaction;
  }, [source]);

  useEffect(() => {
    if (!(map && draw)) {
      return;
    }

    if (drawing) {
      map.addInteraction(draw);
    } else {
      map.removeInteraction(draw);
    }
  }, [map, draw, drawing]);

  useInteraction(() => new Snap({ source }), map, [source]);

  const onClear = useCallback(() => {
    setDrawing(true);
    onChange(EMPTY_LINE);
    if (source) {
      source.clear();
    }
  }, [source]);

  return (
    <div className="route-editor">
      <div className="buttons">
        <button className="buttons-clear" onClick={onClear}>{'Clear'}</button>
      </div>
      <div className="map" ref={mapRef} />
    </div>
  );
}

RouteEditor.propTypes = {
  initialLine: PropTypes.shape({
    points: PropTypes.arrayOf(PropTypes.shape({
      lon: PropTypes.number.isRequired,
      lat: PropTypes.number.isRequired,
    }).isRequired).isRequired,
    length: PropTypes.number.isRequired,
  }).isRequired,
  onChange: PropTypes.func,
};

RouteEditor.defaultProps = {
  initialLine: EMPTY_LINE,
};
