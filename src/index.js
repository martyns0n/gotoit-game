import React from 'react';
import ReactDOM from 'react-dom';
import {IntlProvider} from 'react-intl';

//import $ from "jquery";
//window.jQuery = jQuery = window.$ = $;
//console.log($);

// theAdmin theme =============================
import './assets/styles/core.min.css';
import './assets/styles/app.min.css';
import './assets/styles/main.min.css';
// import './assets/js/core.min.js';
// import './assets/js/app.min.js';
// import './assets/js/script.min.js';
// ============================================

import '../node_modules/toastr/build/toastr.min.css';
import '../node_modules/animate.css';
// import '';

import App from './App';


ReactDOM.render(
  <IntlProvider locale="en">
    <App />
  </IntlProvider>,
  document.getElementById('root')
);
