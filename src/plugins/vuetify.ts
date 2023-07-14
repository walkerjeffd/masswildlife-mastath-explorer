
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import '../assets/main.scss'

const theme = {
  dark: false,
  colors: {
    primary: '#2C7BB6',
    secondary: '#abdaea',
    accent: '#feae61',
  }
}

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      info: 'mdi-information-outline',
      download: 'mdi-download'
    },
    sets: {
      mdi,
    }
  },
  theme: {
    defaultTheme: 'theme',
    themes: {
      theme,
    }
  }
})
