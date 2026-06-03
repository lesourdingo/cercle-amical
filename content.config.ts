import { defineContentConfig, defineCollection, property, z } from '@nuxt/content'
import { ACTIVITE_SLUGS } from './app/utils/activites'

const pageLinksSchema = z.array(z.object({
  label: property(z.string()).editor({ label: 'Libellé' }),
  icon: property(z.string()).editor({
    input: 'icon',
    iconLibraries: ['lucide', 'simple-icons'],
    label: 'Icône'
  }),
  to: property(z.string()).editor({ label: 'Lien', description: 'Chemin interne ou URL' }),
  target: z.string().optional()
})).optional()

/** Schéma partagé pour les articles et pages d’index (formulaire Studio). */
const editorialPageSchema = z.object({
  title: property(z.string()).editor({
    label: 'Titre',
    description: 'Titre affiché sur la page et dans les listes'
  }),
  description: property(z.string()).editor({
    input: 'textarea',
    label: 'Résumé',
    description: 'Court texte affiché sous le titre et dans les cartes'
  }),
  date: property(z.string().date()).editor({
    label: 'Date',
    description: 'Date de publication (actualités) ou de l’événement',
    tooltip: 'Format AAAA-MM-JJ'
  }).optional(),
  activite: property(z.enum(ACTIVITE_SLUGS)).editor({
    label: 'Activité',
    description: 'Détermine l’icône affichée (identique à celle de la page Activité correspondante)'
  }).optional(),
  navigation: z.union([
    z.literal(false),
    z.object({
      icon: property(z.string()).editor({
        input: 'icon',
        iconLibraries: ['lucide'],
        label: 'Icône du menu'
      })
    })
  ]).optional(),
  links: pageLinksSchema
})

export default defineContentConfig({
  collections: {
    landing: defineCollection({
      type: 'page',
      source: 'index.md'
    }),
    actualites: defineCollection({
      type: 'page',
      source: '1.actualites/**/*',
      schema: editorialPageSchema
    }),
    evenements: defineCollection({
      type: 'page',
      source: '3.evenements/**/*',
      schema: editorialPageSchema
    }),
    docs: defineCollection({
      type: 'page',
      source: {
        include: '**',
        exclude: ['/index.md', '1.actualites/**', '3.evenements/**']
      },
      schema: z.object({
        date: z.string().optional(),
        links: pageLinksSchema
      })
    })
  }
})
