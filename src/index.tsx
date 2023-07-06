import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Router from './Router';
import {BrowserRouter} from "react-router-dom";
import './main.css'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <BrowserRouter basename="/MarlinsWebsite">
          <Router />
      </BrowserRouter>
  </React.StrictMode>
);
