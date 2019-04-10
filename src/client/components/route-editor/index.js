import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import OLMap from 'ol/Map';
import View from 'ol/View';
import { transform } from 'ol/proj';
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

import { HOME } from '~/constants/map';
import { useInteraction } from '~/client/hooks/interaction';

import './style.scss';

const fillColor = 'rgba(255, 255, 255, 0.2)';
const strokeColor = '#ffcc33';
const pointColor = fillColor;

export default function RouteEditor() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  const raster = useMemo(() => new TileLayer({
    source: new OSM(),
  }), []);

  const source = useMemo(() => new VectorSource(), []);

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
        center: transform(HOME, 'EPSG:4326', 'EPSG:3857'),
        zoom: 10,
      }),
    }));
  }, [raster, vector]);

  useInteraction(() => new Modify({ source }), map, [source]);

  useInteraction(() => new Draw({ source, type: 'LineString' }), map, [source]);

  useInteraction(() => new Snap({ source }), map, [source]);

  return (
    <div className="route-editor">
      <div className="map" ref={mapRef} />
    </div>
  );
}
