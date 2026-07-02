export default eventHandler(async (event) => {
  const { public: { mediaUrl } } = useRuntimeConfig(event)

  return listBulletinPdfs(mediaUrl)
})
