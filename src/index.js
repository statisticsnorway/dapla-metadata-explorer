import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import 'react-table-6/react-table.css'

import './App.css'
import { AppContextProvider } from './utilities'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <AppContextProvider>
      <Router>
        <App />
      </Router>
    </AppContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
