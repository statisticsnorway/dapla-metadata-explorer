import React from 'react'
import { useHistory } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { Button, Divider, Grid, Header, Icon, Segment } from 'semantic-ui-react'

import App from './App'
import { ERROR_BOUNDARY } from './enums'

function ErrorFallback ({ error }) {
  let history = useHistory()

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 1000 }}>
        <Header size='huge' icon>
          <Icon name='frown outline' color='red' />
          <Header.Content>{ERROR_BOUNDARY.HEADER}</Header.Content>
        </Header>
        <Segment placeholder>
          <pre>{error.message}</pre>
        </Segment>
        <p>{ERROR_BOUNDARY.MESSAGE}</p>
        <Divider hidden />
        <Button
          positive
          size='large'
          content={ERROR_BOUNDARY.BUTTON}
          onClick={() => {
            history.push('/')
            window.location.reload()
          }}
        />
      </Grid.Column>
    </Grid>
  )
}

function ErrorWrapper () {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <App />
    </ErrorBoundary>
  )
}

export default ErrorWrapper
