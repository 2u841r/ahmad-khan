import { defineConfig } from 'vitepress'
import { generateSidebar } from './sidebar.mts'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "articles",
  cleanUrls: true,

  title: "Ahmad Khan",
  // description: "Ahmad Khan Articles",
  head: [
    [
      'script',
      { async: '', src: 'https://plausible.io/js/pa-xiMwpch86OpI12GIhodlI.js' }
    ],
    [
      'script',
      {},
      `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
      plausible.init()`
    ]
  ],
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
          href: '/fonts/SolaimanLipiNormal.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: ''
        }
      ]
    ]
  }

})
