import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { AppRouter } from './router/router';

const rootElement = document.getElementById('root') as any;
const root = ReactDOM.createRoot(rootElement);

root.render(<AppRouter />);
reportWebVitals();
