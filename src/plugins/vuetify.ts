
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import '../assets/main.scss'

const theme = {
  dark: false,
  colors: {
    primary: '#3288bd',
    secondary: '#66c2a6',
    accent: '#f46e43',
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
  // theme: {
  //   defaultTheme: 'dark'
  // }
  theme: {
    defaultTheme: 'theme',
    themes: {
      theme,
    }
  }
})
