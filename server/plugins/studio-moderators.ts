function normalizeModerators(value: string | undefined) {
  if (!value) {
    return undefined
  }

  return value
    .split(',')
    .map(email => email.trim())
    .filter(Boolean)
    .join(',')
}

function applyModeratorsEnv(name: string, value: string | undefined) {
  const normalized = normalizeModerators(value)
  if (normalized) {
    process.env[name] = normalized
  }
}

export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()

  // nuxt-studio reads STUDIO_* from process.env only; bridge Nuxt runtime config too.
  applyModeratorsEnv(
    'STUDIO_GOOGLE_MODERATORS',
    process.env.STUDIO_GOOGLE_MODERATORS || config.studioGoogleModerators
  )
  applyModeratorsEnv('STUDIO_GITHUB_MODERATORS', process.env.STUDIO_GITHUB_MODERATORS)
  applyModeratorsEnv('STUDIO_GITLAB_MODERATORS', process.env.STUDIO_GITLAB_MODERATORS)
})
