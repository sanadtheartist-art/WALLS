const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export const uploadToCloudinary = async (file, folder = 'walls') => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', folder)

  const isVideo = file.type?.startsWith('video/') || /\.(mp4|webm|mov|ogg)$/i.test(file.name)
  const resourceType = isVideo ? 'video' : 'image'

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
      method: 'POST',
      body: formData
    })
    const data = await response.json()
    if (!data.secure_url) throw new Error(data.error?.message || 'Upload failed')
    return data.secure_url
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw error
  }
}
