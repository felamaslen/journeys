import { JSDOM } from 'jsdom';

const exposedProperties = ['window', 'navigator', 'document'];

const blacklistProperties = ['localStorage', 'sessionStorage'];

global.window = (new JSDOM('http://localhost:3000/')).window;
global.document = window.document;

Object.keys(window).forEach((property) => {
  if (!blacklistProperties.includes(property) && typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = window[property];
  }
});

global.navigator = {
  userAgent: 'node.js',
};

global.HTMLElement = global.window.HTMLElement;
