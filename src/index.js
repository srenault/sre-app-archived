import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import Config from './Config';

document.addEventListener('deviceready', () => {

  ReactDOM.render(<App />, document.getElementById('root'));

}, false);
