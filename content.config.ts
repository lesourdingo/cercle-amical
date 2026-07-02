import { defineContentConfig, defineCollection, property } from '@nuxt/content'
import { z } from 'zod'

import { ACTIVITE_SLUGS } from './app/utils/activites'

type StudioEditorOptions = {
  label?: string
  description?: string
  tooltip?: string
  input?: 'media' | 'icon' | 'textarea'
  iconLibraries?: string[]
  hidden?: boolean
}

/** Studio field metadata â€” richer than @nuxt/content EditorOptions types. */
function studioEditor<T extends z.ZodTypeAny>(options: StudioEditorOptions) {
  return options as Parameters<ReturnType<typeof property<T>>['editor']>[0]
}

const pageLinksSchema = z.array(z.object({
  label: property(z.string()).editor(studioEditor({ label: 'LibellÃ©' })),
  icon: property(z.string()).editor(studioEditor({
    input: 'icon',
    iconLibraries: ['lucide', 'simple-icons'],
    label: 'IcÃ´ne'
  })),
  to: property(z.string()).editor(studioEditor({ label: 'Lien', description: 'Chemin interne ou URL' })),
  target: z.string().optional()
})).optional()

/** SchÃ©ma partagÃ© pour les articles et pages dâ€™index (formulaire Studio). */
const editorialPageSchema = z.object({
  title: property(z.string()).editor(studioEditor({
    label: 'Titre',
    description: 'Titre affichÃ© sur la page et dans les listes'
  })),
  description: property(z.string()).editor(studioEditor({
    input: 'textarea',
    label: 'RÃ©sumÃ©',
    description: 'Court texte affichÃ© sous le titre et dans les cartes'
  })),
  date: property(z.date()).editor(studioEditor({
    label: 'Date',
    description: 'Date de publication (actualitÃ©s) ou de lâ€™Ã©vÃ©nement'
  })).optional(),
  activite: property(z.enum(ACTIVITE_SLUGS)).editor(studioEditor({
    label: 'ActivitÃ©',
    description: 'DÃ©termine lâ€™icÃ´ne affichÃ©e (identique Ã  celle de la page ActivitÃ© correspondante)'
  })).optional(),
  navigation: property(z.union([
    z.literal(false),
    z.object({
      icon: z.string().optional()
    })
  ]).optional()).editor(studioEditor({ hidden: true })),
  seo: property(z.object({
    title: z.string().optional(),
    description: z.string().optional()
  }).optional()).editor(studioEditor({ hidden: true }))
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
    docs: defineCollection({
      type: 'page',
      source: {
        include: '**',
        exclude: ['index.md', '1.actualites/**']
      },
      schema: z.object({
        title: property(z.string()).editor(studioEditor({
          label: 'Titre',
          description: 'Titre affichÃ© sur la page et dans les listes'
        })).optional(),
        description: property(z.string()).editor(studioEditor({
          input: 'textarea',
          label: 'RÃ©sumÃ©',
          description: 'Court texte affichÃ© sous le titre et dans les cartes'
        })).optional(),
        image: property(z.string()).editor(studioEditor({
          input: 'media',
          label: 'Image',
          description: 'Image affichÃ©e sur la carte de lâ€™activitÃ©'
        })).optional(),
        date: z.string().optional(),
        links: pageLinksSchema
      })
    })
  }
})
