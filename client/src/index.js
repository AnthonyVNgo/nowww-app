import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import store from './app/store';
import { Provider } from 'react-redux';

// const container = document.querySelector('#root');
// const root = ReactDOM.createRoot(container);

// root.render(<App />);


// ReactDOM.render(
  //   <Provider store={store}>
  //   </Provider>,
  //     <App />
  //   document.getElementById('root')
  // )
const root = ReactDOM.createRoot(document.querySelector('#root'));
  
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);