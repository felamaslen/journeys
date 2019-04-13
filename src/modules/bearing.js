const PI2 = 2 * Math.PI;

const RADIUS = 6371000;

export const toDegrees = radians => (360 + ((radians * 180 / Math.PI) % 360)) % 360;

export const toRadians = degrees => Math.PI * degrees / 180;

export const getBearing = (lon1, lat1, lon2, lat2) => toDegrees(Math.atan2(
  Math.sin(lon2 - lon1) * Math.cos(lat2),
  Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1),
) % PI2);

export function getDistance(lon1, lat1, lon2, lat2) {
  const a = (Math.sin(lat2 - lat1) ** 2)
    + Math.cos(lat1) * Math.cos(lat2) * (Math.sin(lon2 - lon1) ** 2);

  return RADIUS * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const mapBetween = (radians, mapper) => new Array(radians.length / 2 - 1).fill(0)
  .map((item, index) => mapper(
    radians[index * 2],
    radians[index * 2 + 1],
    radians[index * 2 + 2],
    radians[index * 2 + 3]
  ));

const sumArray = array => array.reduce((sum, last) => sum + last, 0);

export function getLength(coordinates) {
  const radians = coordinates.map(toRadians);

  return sumArray(mapBetween(radians, getDistance));
}

export function getAverageBearing(coordinates) {
  if (coordinates.length < 4) {
    return null;
  }

  if (coordinates.length % 2 !== 0) {
    throw new Error('Must provide even number of coordinates (flattened)');
  }

  const [lon1Deg, lat1Deg] = coordinates;
  const lon2Deg = coordinates[coordinates.length - 2];
  const lat2Deg = coordinates[coordinates.length - 1];

  const args = [lon1Deg, lat1Deg, lon2Deg, lat2Deg].map(toRadians);

  return getBearing(...args);
}

export function getMidPoint(coordinates) {
  if (coordinates.length % 2 !== 0) {
    throw new Error('Coordinates length must be even');
  }

  const sumLon = coordinates.reduce((last, point, index) => last + ((index + 1) % 2) * point, 0);
  const sumLat = coordinates.reduce((last, point, index) => last + (index % 2) * point, 0);

  const numCoordinates = coordinates.length / 2;

  return [sumLon / numCoordinates, sumLat / numCoordinates];
}
