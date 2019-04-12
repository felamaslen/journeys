import test from 'ava';

import {
  generatePatch,
} from '~/client/modules/patch';

const patchSpec = [
  'origin',
  'destination',
  {
    key: 'points',
    type: 'array',
  },
  {
    key: 'midPoint',
    type: 'array',
    length: 2,
  },
  'length',
  'bearing',
];

const oldObject = {
  origin: 'Foo',
  destination: 'Bar',
  points: [1.07, 4.52, 10.92, -0.03],
  midPoint: [4, 3.2],
  length: 100.35,
  bearing: 163.22,
};

test('generatePatch handles simple string modifications', t => {
  const newObject = {
    ...oldObject,
    destination: 'Baz',
  };

  const patch = generatePatch(patchSpec, oldObject, newObject);

  t.deepEqual(patch, [
    { op: 'replace', path: '/destination', value: 'Baz' },
  ]);
});

test('generatePatch handles indefinite sized arrays', t => {
  const newObject = {
    ...oldObject,
    points: [6.77, 3.09],
  };

  const patch = generatePatch(patchSpec, oldObject, newObject);

  t.deepEqual(patch, [
    { op: 'replace', path: '/points', value: [6.77, 3.09] },
  ]);
});

test('generatePatch handles definite sized arrays', t => {
  const newObject = {
    ...oldObject,
    midPoint: [4, 3.15],
  };

  const patch = generatePatch(patchSpec, oldObject, newObject);

  t.deepEqual(patch, [
    { op: 'replace', path: '/midPoint/1', value: 3.15 },
  ]);
});
