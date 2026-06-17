// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxthub/core',
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
    // Node 22+ built-in SQLite (évite les soucis better-sqlite3 en dev local)
    experimental: {
      sqliteConnector: 'native'
    },
    build: {
      markdown: {
        toc: {
          searchDepth: 1
        }
      }
    }
  },

  runtimeConfig: {
    // Alternative to STUDIO_GOOGLE_MODERATORS — set NUXT_STUDIO_GOOGLE_MODERATORS on Cloudflare
    studioGoogleModerators: '',
    public: {
      siteUrl: ''
    }
  },

  compatibilityDate: '2025-12-12',

  routeRules: {
    '/': { prerender: true },
    '/actualites/**': { prerender: true },
    '/evenements/**': { prerender: true },
    '/activites/**': { prerender: true },
    '/informations/**': { prerender: true },
    '/admin/**': { prerender: false }
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      failOnError: false
    },
    preset: 'cloudflare_module',
    cloudflare: {
      deployConfig: true,
      wrangler: {
        d1_databases: [
          {
            binding: 'DB',
            database_name: 'cercel-amical-content',
            database_id: '73d1d050-a9ac-4660-b74f-bfd29a834325'
          }
        ]
      }
    }
  },

  hub: {
    db: {
      dialect: 'sqlite',
      driver: 'd1',
      connection: {
        databaseId: '73d1d050-a9ac-4660-b74f-bfd29a834325'
      }
    },
    blob: {
      driver: 'cloudflare-r2',
      binding: 'BLOB',
      bucketName: process.env.NUXT_HUB_BLOB_BUCKET_NAME || 'cercle-amical-media'
    }
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
    domain: process.env.NUXT_PUBLIC_SITE_URL || 'https://cercle-amical.pages.dev',
    title: 'Cercle Amical',
    description: 'Site du Cercle Amical de Saint Gildas de Rhuys.',
    full: {
      title: 'Cercle Amical - Contenu complet',
      description: 'Actualités, événements, activités et informations du Cercle Amical.'
    },
    sections: [
      {
        title: 'Actualités',
        contentCollection: 'actualites',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/actualites/%' }
        ]
      },
      {
        title: 'Événements',
        contentCollection: 'evenements',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/evenements/%' }
        ]
      },
      {
        title: 'Activités',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/activites/%' }
        ]
      },
      {
        title: 'Informations',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/informations%' }
        ]
      }
    ]
  },

  // Optimize OG image generation for memory usage
  ogImage: {
    runtimeCacheStorage: false
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
    route: '/admin', // default: '/_studio',
    media: {
      external: true,
      prefix: 'studio'
    }
  }
})
