import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, Header, Icon, Image, Menu, Sticky } from 'semantic-ui-react'
import { LANGUAGE, SSB_COLORS, ssb_logo_rgb } from '@statisticsnorway/dapla-js-utilities'

import { ApiContext, LanguageContext, UserContext } from '../context/AppContext'
import { API, ROUTING, STORAGE } from '../configurations'
import { TEST_IDS, UI } from '../enums'

function AppMenu ({ setSettingsOpen, context }) {
  const { user } = useContext(UserContext)
  const { ldsApi, apiReadOnly } = useContext(ApiContext)
  const { language, setLanguage } = useContext(LanguageContext)

  const [menuIsStuck, setMenuIsStuck] = useState(false)

  return (
    <Sticky onUnstick={() => setMenuIsStuck(false)} onStick={() => setMenuIsStuck(true)} context={context}>
      <Menu
        secondary
        size={menuIsStuck ? 'large' : 'huge'}
        style={{
          padding: menuIsStuck ? 0 : '1rem',
          backgroundColor: SSB_COLORS.BACKGROUND,
          border: '1px solid rgba(34,36,38,.15)',
          boxShadow: '0 1px 2px 0 rgba(34,36,38,.15)'
        }}
      >
        <Menu.Item>
          <Image size={menuIsStuck ? 'small' : 'medium'} src={ssb_logo_rgb} />
        </Menu.Item>
        <Menu.Item>
          <Header size={menuIsStuck ? 'medium' : 'huge'} content={UI.HEADER[language]} />
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item>
            <Icon style={{ color: SSB_COLORS.GREY }} name='user' />
            {user}
          </Menu.Item>
          <Menu.Item>
            <Icon style={{ color: SSB_COLORS.GREY }} name='plug' />
            {API.LDS[window._env.REACT_APP_EXPLORATION_LDS === ldsApi ? 0 : 1]}
          </Menu.Item>
          {!apiReadOnly &&
          <Menu.Item
            as={Link}
            to={ROUTING.IMPORT}
            style={{ color: SSB_COLORS.BLUE }}
            icon={{ name: 'upload', size: menuIsStuck ? 'large' : 'big' }}
          />
          }
          <Menu.Item
            style={{ color: SSB_COLORS.GREEN }}
            onClick={() => setSettingsOpen(true)}
            data-testid={TEST_IDS.ACCESS_SETTINGS_BUTTON}
            icon={{ name: 'setting', size: menuIsStuck ? 'large' : 'big' }}
          />
          <Dropdown item text={`${LANGUAGE.LANGUAGE[language]} (${LANGUAGE.LANGUAGE_CHOICE[language]})`}>
            <Dropdown.Menu>
              {Object.keys(LANGUAGE.LANGUAGES).map(languageName =>
                <Dropdown.Item
                  key={languageName}
                  content={LANGUAGE[languageName][language]}
                  onClick={() => {
                    setLanguage(LANGUAGE.LANGUAGES[languageName].languageCode)
                    localStorage.setItem(STORAGE.LANGUAGE, LANGUAGE.LANGUAGES[languageName].languageCode)
                  }}
                />
              )}
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
    </Sticky>
  )
}

export default AppMenu
