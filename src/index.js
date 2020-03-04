import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import Config from './Config';
import ApiClient from './ApiClient';

document.addEventListener('deviceready', () => {
  const el = document.getElementById('app');

  const apiClient = new ApiClient({ endpoint: Config.endpoint, basicAuth: Config.basicAuth });

  ReactDOM.render(<App apiClient={apiClient} />, el);
}, false);
