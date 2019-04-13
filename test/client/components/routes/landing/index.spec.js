import test from 'ava';
import { render } from 'react-testing-library';
import '~test/helpers/browser';
import React from 'react';

import Landing from '~/client/components/routes/landing';

test('<Landing /> renders a container', t => {
  const { container } = render(<Landing />);

  t.is(container.childNodes.length, 1);

  const [div] = container.childNodes;

  t.is(div.tagName, 'DIV');
  t.is(div.className, 'landing-page');
});
