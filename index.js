import React from 'react';
import ReactDOM from 'react-dom';

import App from './src/components/App';

const rootElement = document.getElementById('root');
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement,
);
