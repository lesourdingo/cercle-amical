// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    'nuxt-og-image',
    'nuxt-llms',
    'nuxt-studio'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  content: {
    build: {
      markdown: {
        toc: {
          searchDepth: 1
        }
      }
    }
  },

  compatibilityDate: '2025-12-12',

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true,
      autoSubfolderIndex: false
    },
    // Force static preset for Cloudflare Pages to avoid native module issues
    // OG images are prerendered, so we don't need server-side rendering
    preset: 'static'
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  icon: {
    provider: 'iconify'
  },

  llms: {
    domain: 'https://docs-template.nuxt.dev/',
    title: 'Cercle Amical',
    description: 'Site du Cercle Amical de Saint Gildas de Rhuys.',
    full: {
      title: 'Cercle Amical - Documentation complète',
      description: 'Documentation et contenu du site du Cercle Amical.'
    },
    sections: [
      {
        title: 'Getting Started',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/getting-started%' }
        ]
      },
      {
        title: 'Essentials',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/essentials%' }
        ]
      }
    ]
  },
  studio: {
    // Git repository configuration (owner and repo are required)
    repository: {
      provider: 'github', // 'github' or 'gitlab'
      owner: 'lesourdingo', // your GitHub/GitLab username or organization
      repo: 'cercle-amical', // your repository name
      branch: 'master' // the branch to commit to (default: 'main')
    },
    i18n: {
      defaultLocale: 'fr' // 'en' or 'fr'
    },
    route: '/admin' // default: '/_studio'
  }
})
