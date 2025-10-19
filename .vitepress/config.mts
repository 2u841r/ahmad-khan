import { defineConfig } from 'vitepress'
import { generateSidebar } from './sidebar.mts'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "articles",
  cleanUrls: true,
  
  title: "Ahmad Khan",
  // description: "Ahmad Khan Articles",
  themeConfig: {
    search: {
      provider: 'local'
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      // { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: generateSidebar(),

    socialLinks: [
      { icon: 'telegram', link: 'https://t.me/akwritings' },
    
    ],
    footer: {
      copyright: 'Copyright © 2019-present <a href="https://t.me/akwritings">Ahmad Khan</a>'
    }
  }
})
