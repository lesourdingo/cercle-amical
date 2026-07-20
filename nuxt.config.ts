// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxthub/core',
    '@nuxt/image',
    '@nuxt/ui',
    // Sitemap must load before @nuxt/content for Content v3 integration
    '@nuxtjs/seo',
    '@nuxt/content',
    'nuxt-llms',
    'nuxt-studio'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://cercle-amical.pages.dev',
    name: 'Cercle Amical',
    description: 'Association conviviale de Saint Gildas de Rhuys depuis 1983.',
    defaultLocale: 'fr'
  },

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

  ui: {
    colorMode: false
  },

  runtimeConfig: {
    // Alternative to STUDIO_GOOGLE_MODERATORS — set NUXT_STUDIO_GOOGLE_MODERATORS on Cloudflare
    studioGoogleModerators: '',
    public: {
      mediaUrl: process.env.S3_PUBLIC_URL || 'https://images.cercle-amical.fr'
    }
  },

  routeRules: {
    '/': { prerender: true },
    '/actualites/**': { prerender: true },
    '/activites/**': { prerender: true },
    '/bulletin-d-information/**': { prerender: true },
    '/presentation-du-club/**': { prerender: true },
    '/admin/**': {
      prerender: false,
      robots: false
    }
  },

  compatibilityDate: '2025-12-12',

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      failOnError: false
    },
    preset: 'cloudflare_module',
    cloudflare: {
      deployConfig: true
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
      bucketName: process.env.S3_BUCKET || 'cercle-amical-media'
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
      description: 'Actualités, activités et informations du Cercle Amical.'
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
        title: 'Activités',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/activites/%' }
        ]
      },
      {
        title: 'Bulletin d\'information',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/bulletin-d-information%' }
        ]
      },
      {
        title: 'Présentation du club',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/presentation-du-club%' }
        ]
      }
    ]
  },

  // Optimize OG image generation for memory usage
  ogImage: {
    runtimeCacheStorage: false
  },

  robots: {
    disallow: ['/admin']
  },

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'Cercle Amical',
      url: process.env.NUXT_PUBLIC_SITE_URL || 'https://cercle-amical.pages.dev',
      logo: '/logo.png'
    }
  },

  sitemap: {
    exclude: ['/admin/**']
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
      // R2 en prod ; /public en dev local (évite les bindings BLOB manquants)
      external: process.env.NODE_ENV === 'production',
      prefix: 'studio'
    }
  }
})
