import { configure, mount, render, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';

configure({ adapter: new Adapter() });

global.shallow = shallow;
global.render = render;
global.mount = mount;
global.React = React;
global.insights = {
  chrome: {
    visibilityFunctions: {
      something: (...args) => Boolean(args && args.length > 0 && args[0]),
    },
    auth: {
      getUser: () => Promise.resolve({ identity: {} }),
    },
  },
};
