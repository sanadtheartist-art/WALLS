export function isYouTubeUrl(url) {
  if (!url) return false
  return /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))/.test(url)
}

export function getYouTubeId(url) {
  if (!url) return null
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([^&?/]+)/)
  return match ? match[1] : null
}

export function getYouTubeEmbedUrl(url, { autoplay = false, loop = false, muted = false, controls = true } = {}) {
  const id = getYouTubeId(url)
  if (!id) return null

  const params = new URLSearchParams()
  if (autoplay) params.set('autoplay', '1')
  if (muted) params.set('mute', '1')
  if (!controls) params.set('controls', '0')
  params.set('rel', '0')
  if (loop) {
    params.set('loop', '1')
    params.set('playlist', id)
  }

  const query = params.toString()
  return `https://www.youtube.com/embed/${id}${query ? `?${query}` : ''}`
}

export function isVimeoUrl(url) {
  if (!url) return false
  return /vimeo\.com\/\d+/.test(url)
}

export function getVimeoEmbedUrl(url) {
  const match = url?.match(/vimeo\.com\/(\d+)/)
  return match ? `https://player.vimeo.com/video/${match[1]}` : null
}

export function isDirectVideoUrl(url) {
  if (!url || isYouTubeUrl(url) || isVimeoUrl(url)) return false
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url) || /cloudinary\.com.*\/video\//i.test(url) || /res\.cloudinary\.com/i.test(url)
}

export function getVideoMode(url) {
  if (isYouTubeUrl(url)) return 'youtube'
  if (isVimeoUrl(url)) return 'vimeo'
  if (isDirectVideoUrl(url)) return 'upload'
  return null
}

export function getEmbedUrl(url) {
  if (isYouTubeUrl(url)) return getYouTubeEmbedUrl(url, { controls: true })
  if (isVimeoUrl(url)) return getVimeoEmbedUrl(url)
  return null
}
