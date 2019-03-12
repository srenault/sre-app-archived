import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import Config from './Config';
//import ApiClient from './ApiClient';
import apiClientMock from './ApiClient/mock';

document.addEventListener('deviceready', () => {

  const el = document.getElementById('root');

  //const apiClient = new ApiClient({ endpoint: Config.endpoint });

  ReactDOM.render(<App apiClient={apiClientMock} />, el);

}, false);
