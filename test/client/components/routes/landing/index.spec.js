import test from 'ava';
import { render } from 'react-testing-library';
import '~test/helpers/browser';
import React from 'react';

import Landing from '~/client/components/routes/landing';

test('<Landing /> renders a title', t => {
  const { container } = render(<Landing />);

  t.is(container.childNodes.length, 1);

  const [title] = container.childNodes;

  t.is(title.tagName, 'H2');
  t.is(title.innerHTML, 'Welcome!');
});
