import React from 'react';
import { createRoot } from 'react-dom/client';
import logger from 'redux-logger';
import App from './AppEntry';

createRoot(<App logger={logger} />, document.getElementById('root'));
