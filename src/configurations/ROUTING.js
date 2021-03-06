const BASES = {
  DOMAIN: 'domain',
  ID: 'id'
}

export const ROUTING = {
  BASE: '/',
  IMPORT: '/import',
  DOMAIN: `/${BASES.DOMAIN}/:${BASES.DOMAIN}`,
  DOMAIN_BASE: `/${BASES.DOMAIN}/`,
  DOMAIN_INSTANCE: `/${BASES.DOMAIN}/:${BASES.DOMAIN}/:${BASES.ID}`,
  DOMAIN_INSTANCE_NEW: `/${BASES.DOMAIN}/:${BASES.DOMAIN}/new`,
  DOMAIN_INSTANCES: '/multi-domain'
}
