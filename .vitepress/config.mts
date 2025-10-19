import { defineConfig } from 'vitepress'
import { generateSidebar } from './sidebar.mts'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "articles",
  cleanUrls: true,

  title: "Ahmad Khan",
  // description: "Ahmad Khan Articles",
  themeConfig: {
    sidebarMenuLabel: 'সূচীপত্র',
    docFooter: {
      prev: 'পূর্ববর্তী পাতা',
      next: 'পরবর্তী পাতা'
    },
    search: {
      provider: 'local'
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Homepage', link: '/' },
      { text: 'About', link: '/about' },
      // { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: generateSidebar(),

    socialLinks: [
      { icon: 'telegram', link: 'https://dub.sh/akwritings' },

    ],
    footer: {
      message: 'Copyright © 2019-present <strong> Ahmad Khan</strong>',
      copyright: 'Developed by Zubair'
    }
  },
  transformHead() {
    return [
      [
        'link',
        {
          rel: 'preload',
          href: '/articles/files/SolaimanLipiNormal.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: ''
        }
      ]
    ]
  }

})
