import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Dropdown, Header, Image, Menu } from 'semantic-ui-react'
import { LANGUAGE, SSB_COLORS, ssb_logo_rgb } from '@statisticsnorway/dapla-js-utilities'

import { AppSearch } from './'
import { LanguageContext } from '../context/AppContext'
import { ROUTING } from '../configurations'
import { TEST_IDS, UI } from '../enums'

function AppMenu ({ setSettingsOpen, ready }) {
  const { language, setLanguage } = useContext(LanguageContext)

  const dropdownItems = Object.keys(LANGUAGE.LANGUAGES).map(languageName =>
    <Dropdown.Item
      key={languageName}
      content={LANGUAGE[languageName][language]}
      onClick={() => setLanguage(LANGUAGE.LANGUAGES[languageName].languageCode)}
    />
  )

  return (
    <Menu secondary size='huge' style={{ padding: '1rem', paddingTop: '2rem' }}>
      <Menu.Item as={Link} to={ROUTING.BASE}><Image size='medium' src={ssb_logo_rgb} /></Menu.Item>
      <Menu.Item><Header size='huge' content={UI.HEADER[language]} /></Menu.Item>
      <Menu.Menu position='right'>
        <Menu.Item>
          <AppSearch ready={ready} />
        </Menu.Item>
        <Menu.Item><Divider vertical /></Menu.Item>
        <Menu.Item
          style={{ color: SSB_COLORS.GREEN }}
          onClick={() => setSettingsOpen(true)}
          icon={{ name: 'setting', size: 'big', 'data-testid': TEST_IDS.ACCESS_SETTINGS_BUTTON }}
        />
        <Dropdown item text={`${LANGUAGE.LANGUAGE[language]} (${LANGUAGE.LANGUAGE_CHOICE[language]})`}>
          <Dropdown.Menu>{dropdownItems}</Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>
    </Menu>
  )
}

export default AppMenu
