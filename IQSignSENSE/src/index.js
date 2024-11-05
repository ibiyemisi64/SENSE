import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Assuming you have an App component in src/App.js

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
