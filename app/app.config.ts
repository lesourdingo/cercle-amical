export default defineAppConfig({
  features: {
    actualites: true
  },
  ui: {
    colors: {
      primary: 'cyan',
      secondary: 'yellow',
      neutral: 'neutral'
    },
    footer: {
      slots: {
        root: 'border-t border-default',
        left: 'text-sm text-muted'
      }
    },
    pageHero: {
      slots: {
        container: 'flex flex-col lg:grid py-12 sm:py-16 lg:py-20 gap-10 sm:gap-y-16',
        body: 'mt-6',
        footer: 'mt-6'
      }
    },
    pageSection: {
      slots: {
        container: 'flex flex-col lg:grid py-6 sm:py-10 lg:py-14 gap-6 sm:gap-10'
      }
    },
    prose: {
      img: {
        slots: {
          base: 'rounded-md max-w-md mx-auto w-auto h-auto'
        }
      }
    }
  },
  seo: {
    siteName: 'Cercle Amical'
  },
  header: {
    title: 'Cercle Amical',
    to: '/',
    logo: {
      alt: 'Cercle Amical',
      light: '/logo.png',
      hero: '/logo-big.png'
    },
    colorMode: false
  },
  footer: {
    tagline: 'Association conviviale de Saint Gildas de Rhuys depuis 1983.',
    credits: `© ${new Date().getFullYear()} Cercle Amical de Saint Gildas de Rhuys`,
    madeBy: {
      name: 'Kevin Rumeur',
      to: 'https://x.com/lesourdingo'
    },
    colorMode: false,
    columns: [{
      label: 'Navigation',
      children: [{
        label: 'Actualités',
        to: '/actualites'
      }, {
        label: 'Activités',
        to: '/activites'
      }, {
        label: 'Bulletin d\'information',
        to: '/bulletin-d-information'
      }, {
        label: 'Présentation du club',
        to: '/presentation-du-club'
      }]
    }, {
      label: 'Contact',
      children: [{
        label: 'cercle.amical.saint.gildas@gmail.com',
        to: 'mailto:cercle.amical.saint.gildas@gmail.com',
        icon: 'i-lucide-mail'
      }, {
        label: 'Adhérer au club',
        to: '/presentation-du-club',
        icon: 'i-lucide-user-plus'
      }, {
        label: 'Saint Gildas de Rhuys (56730)',
        icon: 'i-lucide-map-pin'
      }]
    }]
  },
  toc: {
    title: 'Table of Contents',
    bottom: {
      title: 'Community',
      edit: 'https://github.com/nuxt-ui-templates/docs/edit/main/content',
      links: [{
        icon: 'i-lucide-star',
        label: 'Star on GitHub',
        to: 'https://github.com/nuxt/ui',
        target: '_blank'
      }, {
        icon: 'i-lucide-book-open',
        label: 'Nuxt UI docs',
        to: 'https://ui.nuxt.com/docs/getting-started/installation/nuxt',
        target: '_blank'
      }]
    }
  }
})
