import test from 'ava';
import { render } from 'react-testing-library';
import '~test/helpers/browser';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from '~/client/components/app';

test('<App /> renders a header', t => {
  const { container } = render((
    <MemoryRouter>
      <App />
    </MemoryRouter>
  ));

  t.is(container.childNodes.length, 1);

  const [div] = container.childNodes;

  t.is(div.tagName, 'DIV');
  t.is(div.className, 'journeys-app');
  t.is(div.childNodes.length, 2);

  const [title] = div.childNodes;
  t.is(title.tagName, 'H1');
  t.is(title.innerHTML, 'Journeys');
});
