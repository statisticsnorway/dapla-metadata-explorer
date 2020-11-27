import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Dropdown, Header, Icon, Image, Menu, Sticky } from 'semantic-ui-react'
import { LANGUAGE, SSB_COLORS, ssb_logo_rgb } from '@statisticsnorway/dapla-js-utilities'

import { ApiContext, LanguageContext, UserContext } from '../context/AppContext'
import { camelToTitle } from '../utilities'
import { API, ROUTING, STORAGE } from '../configurations'
import { TEST_IDS, UI } from '../enums'

const isReadOnlyAPI = api => api ? API.LDS[0] : API.LDS[1]
const iconSize = menuIsStuck => menuIsStuck ? 'large' : 'big'
const menuSize = menuIsStuck => menuIsStuck ? 'large' : 'huge'
const headerSize = menuIsStuck => menuIsStuck ? 'medium' : 'huge'
const imageSize = menuIsStuck => menuIsStuck ? 'small' : 'medium'
const headerContent = (menuIsStuck, whereAmI) => menuIsStuck && whereAmI !== '' ? ` (${whereAmI})` : ''
const menuStyle = menuIsStuck => ({
  padding: menuIsStuck ? 0 : '1rem',
  border: !menuIsStuck ? 'none' : '1px solid rgba(34,36,38,.15)',
  backgroundColor: menuIsStuck ? '#FFFFFF' : SSB_COLORS.BACKGROUND,
  boxShadow: !menuIsStuck ? 'none' : '0 1px 2px 0 rgba(34,36,38,.15)'
})

function AppMenu ({ setSettingsOpen, context }) {
  const { user } = useContext(UserContext)
  const { ldsApi, apiReadOnly } = useContext(ApiContext)
  const { language, setLanguage } = useContext(LanguageContext)

  const { pathname } = useLocation()

  const [whereAmI, setWhereAmI] = useState('')
  const [menuIsStuck, setMenuIsStuck] = useState(false)

  useEffect(() => {
    if (pathname.startsWith(ROUTING.DOMAIN_BASE)) {
      setWhereAmI(camelToTitle(pathname.split('/')[2]))
    } else {
      setWhereAmI('')
    }
  }, [pathname])

  return (
    <Sticky onUnstick={() => setMenuIsStuck(false)} onStick={() => setMenuIsStuck(true)} context={context}>
      <Menu secondary size={menuSize(menuIsStuck)} style={menuStyle(menuIsStuck)}>
        <Menu.Item>
          <Image size={imageSize(menuIsStuck)} src={ssb_logo_rgb} />
        </Menu.Item>
        <Menu.Item>
          <Header
            size={headerSize(menuIsStuck)}
            content={`${UI.HEADER[language]}${headerContent(menuIsStuck, whereAmI)}`}
          />
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item>
            <Icon style={{ color: SSB_COLORS.GREY }} name='user' />
            {user}
          </Menu.Item>
          <Menu.Item>
            <Icon style={{ color: SSB_COLORS.GREY }} name='plug' />
            {isReadOnlyAPI(window._env.REACT_APP_EXPLORATION_LDS === ldsApi)}
          </Menu.Item>
          {!apiReadOnly &&
          <Menu.Item
            as={Link}
            to={ROUTING.IMPORT}
            style={{ color: SSB_COLORS.BLUE }}
            icon={{ name: 'upload', size: iconSize(menuIsStuck) }}
          />
          }
          <Menu.Item
            style={{ color: SSB_COLORS.GREEN }}
            onClick={() => setSettingsOpen(true)}
            data-testid={TEST_IDS.ACCESS_SETTINGS_BUTTON}
            icon={{ name: 'setting', size: iconSize(menuIsStuck) }}
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
