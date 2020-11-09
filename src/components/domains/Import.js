import React, { useCallback, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { useDropzone } from 'react-dropzone'
import { Container, Header, List, Loader, Segment } from 'semantic-ui-react'
import { ErrorMessage, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import Upload from './Upload'
import { API } from '../../configurations'
import { IMPORT, UI } from '../../enums'

function Import ({ language, ldsApi }) {
  const [ready, setReady] = useState(false)
  const [domains, setDomains] = useState([])
  const [fullFiles, setFullFiles] = useState([])

  const [{ data, loading, error }] = useAxios(`${ldsApi}${API.GET_SCHEMAS}`, { useCache: false })

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      try {
        setDomains(data.map(domain => domain.replace('/ns/', '').replace('?schema', '')))
        setReady(true)
      } catch (e) {
        setReady(false)
        console.log(`Could not set domains: ${e}`)
      }
    } else {
      setReady(false)
    }
  }, [data, error, loading, setDomains])

  const onDrop = useCallback(acceptedFiles => {
    const filesAsJson = []

    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        filesAsJson.push([file.name.substr(0, file.name.indexOf('_')), JSON.parse(reader.result)])
      }

      reader.readAsText(file)
    })

    setFullFiles(filesAsJson)
  }, [])

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'application/json'
  })

  const files = acceptedFiles.map((file, index) => {
    if (fullFiles.length !== 0) {
      const errors = []
      const domain = file.name.substr(0, file.name.indexOf('_'))

      if (!domains.includes(domain)) {
        errors.push('Could not identify domain')
      }

      if (errors.length !== 0) {
        return (
          <List.Item key={file.name}>
            <List.Icon name='warning circle' style={{ color: SSB_COLORS.RED }} verticalAlign='middle' />
            <List.Content>
              {file.name}
              <List.Description>
                {errors.toString()}
              </List.Description>
            </List.Content>
          </List.Item>
        )
      } else {
        return (
          <Upload key={file.name} name={file.name} file={fullFiles[index]} ldsApi={ldsApi} />
        )
      }
    } else {
      return null
    }
  })

  return (
    <Container>
      {loading ? <Loader active inline='centered' /> :
        error ? <ErrorMessage error={UI.API_ERROR_MESSAGE[language]} language={language} /> : ready &&
          <>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <Segment placeholder textAlign='center'>
                <Header
                  disabled
                  size='large'
                  subheader={IMPORT.FILE_FORMAT[language]}
                  content={isDragActive ? IMPORT.DRAG_ACTIVE[language] : IMPORT.DRAG_INACTIVE[language]}
                />
              </Segment>
            </div>
            {fullFiles.length !== 0 &&
            <>
              <Header size='medium' content={IMPORT.FILES[language]} />
              <Segment secondary>
                <List relaxed='very'>
                  {files}
                </List>
              </Segment>
            </>
            }
          </>
      }
    </Container>
  )
}

export default Import
