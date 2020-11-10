export const IMPORT = {
  DRAG_ACTIVE: {
    en: 'Drop the files here...',
    nb: 'Slipp filer her...'
  },
  DRAG_INACTIVE: {
    en: 'Drag \'n\' drop some files here, or click to select files (max 50 files)',
    nb: 'Dra og slipp filer her, eller klikk for å velge filer (maks 50 filer)'
  },
  FILE_FORMAT: {
    en: 'File name format has to be \'Domain_whatever.json\' (for example \'Agent_MyExample.json\')',
    nb: 'Filnavn må være på formatet \'Domene_hvaSomHelst.json\' (for eksempel \'Agent_MittEksempel.json\')'
  },
  FILES: {
    en: 'Files:',
    nb: 'Filer:'
  },
  HEADER: {
    en: 'Here you can import .json-files to LDS directly',
    nb: 'Her kan du importere .json-filer til LDS direkte'
  },
  MAX_FILES: (files) => ({
    en: `Max 50 files, you tried to import: ${files}`,
    nb: `Maks 50 filer, du prøvde å importere: ${files}`
  }),
  NO_DOMAIN: {
    en: 'Could not identify domain from filename',
    nb: 'Kunne ikke identifisere domene fra filnavn'
  },
  SUBHEADER: {
    en: 'Use the box below to pick which files to import',
    nb: 'Benytt boksen under til å velge filer du vil importere'
  }
}
