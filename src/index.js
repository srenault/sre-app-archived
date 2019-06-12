import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import Config from './Config';
import ApiClient from './ApiClient';
import apiClientMock from './ApiClient/mock';

document.addEventListener('deviceready', () => {
  const el = document.getElementById('app');

  const apiClient = Config.mock ? apiClientMock : new ApiClient({ endpoint: Config.endpoint });

  ReactDOM.render(<App apiClient={apiClient} />, el);
}, false);
