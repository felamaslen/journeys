import test from 'ava';

import {
  toRadians,
  getBearing,
  getDistance,
  getLength,
  getAverageBearing,
  getMidPoint,
} from '~/modules/bearing';

test('getBearing returns a known bearing (in degrees)', t => {
  const testCases = [
    { points: [[0.006274, 51.496061], [-0.011579, 51.506108]], bearing: 312.1217180216572 },
    { points: [[-0.011579, 51.506108], [-0.083548, 51.514741]], bearing: 280.93743357923506 },
    { points: [[-0.083548, 51.514741], [0.090065, 51.500697]], bearing: 97.33709568223253 },
  ];

  const results = testCases.map(({ points }) => getBearing(...(
    points.reduce((last, coords) => [...last, ...coords.map(toRadians)], [])
  )));

  const bearings = testCases.map(({ bearing }) => bearing);

  t.deepEqual(results, bearings);
});

test('getDistance returns a known distance', t => {
  const testCases = [
    { points: [0.006274, 51.496061, -0.011579, 51.506108], distance: 1665.8909516694769 },
    { points: [-0.011579, 51.506108, -0.083548, 51.514741], distance: 5072.252824898975 },
    { points: [-0.083548, 51.514741, 0.090065, 51.500697], distance: 12116.581236346818 },
  ];

  const results = testCases.map(({ points }) => getDistance(...points.map(toRadians)));
  const distances = testCases.map(({ distance }) => distance);

  t.deepEqual(results, distances);
});

test('getLength returns a known length', t => {
  const coordinates = [
    0.006274,
    51.496061,
    -0.011579,
    51.506108,
    -0.083548,
    51.514741,
    0.090065,
    51.500697,
  ];

  const length = getLength(coordinates);

  const expectedLength = 1665.8909516694769 + 5072.252824898975 + 12116.581236346818;

  t.is(length, expectedLength);
});

test('getAverageBearing returns the average bearing', t => {
  const coordinates = [
    0.006274,
    51.496061,
    -0.011579,
    51.506108,
    -0.083548,
    51.514741,
    0.090065,
    51.500697,
  ];

  const averageBearing = getBearing(
    toRadians(0.006274),
    toRadians(51.496061),
    toRadians(0.090065),
    toRadians(51.500697)
  );

  t.is(getAverageBearing(coordinates), averageBearing);
});

test('getMidPoint gets the average latitude and longitude of the line', t => {
  const coordinates = [
    0.006274,
    51.496061,
    -0.011579,
    51.506108,
    -0.083548,
    51.514741,
    0.090065,
    51.500697,
  ];

  const averageLon = (0.006274 - 0.011579 - 0.083548 + 0.090065) / 4;
  const averageLat = (51.496061 + 51.506108 + 51.514741 + 51.500697) / 4;

  t.deepEqual(getMidPoint(coordinates), [averageLon, averageLat]);
});
