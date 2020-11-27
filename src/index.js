import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'

import './index.css'
import ErrorWrapper from './ErrorWrapper'
import { AppContextProvider } from './context/AppContext'

ReactDOM.render(
  <React.StrictMode>
    <AppContextProvider>
      <Router>
        <ErrorWrapper />
      </Router>
    </AppContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
