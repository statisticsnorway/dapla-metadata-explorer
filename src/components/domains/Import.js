import React, { useCallback, useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { useDropzone } from 'react-dropzone'
import { Container, Divider, Header, Icon, List, Loader, Segment } from 'semantic-ui-react'
import { ErrorMessage, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import Upload from './Upload'
import { ApiContext, LanguageContext } from '../../context/AppContext'
import { API } from '../../configurations'
import { IMPORT, UI } from '../../enums'

function Import () {
  const { ldsApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

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

  const { acceptedFiles, fileRejections, getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 50,
    accept: 'application/json'
  })

  const files = acceptedFiles.map((file, index) => {
    if (fullFiles.length !== 0) {
      const errors = []
      const domain = file.name.substr(0, file.name.indexOf('_'))

      if (!domains.includes(domain)) {
        errors.push(IMPORT.NO_DOMAIN[language])
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
          <Upload key={file.name} name={file.name} file={fullFiles[index]} />
        )
      }
    } else {
      return null
    }
  })

  return (
    <Container>
      <Header size='huge'>
        <Icon name='upload' style={{ color: SSB_COLORS.BLUE }} />
        <Header.Content>
          {IMPORT.HEADER[language]}
          <Header.Subheader>
            {IMPORT.SUBHEADER[language]}
          </Header.Subheader>
        </Header.Content>
      </Header>
      <Divider hidden />
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
            {fileRejections.length > 50 &&
            <ErrorMessage language={language} error={IMPORT.MAX_FILES(fileRejections.length)[language]} />
            }
          </>
      }
    </Container>
  )
}

export default Import
