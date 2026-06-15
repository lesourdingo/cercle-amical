function maskEmail(email: string) {
  const [local, domain] = email.split('@')
  if (!local || !domain) {
    return '(invalid)'
  }

  const visible = local.slice(0, Math.min(2, local.length))
  return `${visible}***@${domain}`
}

export default defineEventHandler(() => {
  if (process.env.STUDIO_AUTH_DEBUG !== 'true') {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  const moderators = (process.env.STUDIO_GOOGLE_MODERATORS || '')
    .split(',')
    .map(email => email.trim())
    .filter(Boolean)

  return {
    googleClientIdSet: Boolean(process.env.STUDIO_GOOGLE_CLIENT_ID),
    googleClientSecretSet: Boolean(process.env.STUDIO_GOOGLE_CLIENT_SECRET),
    githubTokenSet: Boolean(process.env.STUDIO_GITHUB_TOKEN),
    moderatorsCount: moderators.length,
    moderatorsPreview: moderators.map(maskEmail),
    runtimeConfigModeratorsSet: Boolean(useRuntimeConfig().studioGoogleModerators)
  }
})
