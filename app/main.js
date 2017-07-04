/**
 * Created by orel- on 24/May/17.
 */
import React from 'react';
import { render } from 'react-dom';

import '../bower_components/fabric.js/dist/fabric.min';

import App from './components/App';

const AppFactory = React.createFactory(App);

render(AppFactory(window.APP_PROPS), document.getElementById('app'));
