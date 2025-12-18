// src/utils/upload.ts

export async function uploadToCloudinary(file: File): Promise<{ secure_url: string; delete_token?: string }> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary not configured — set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET')
  }

  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', uploadPreset)
  // form.append('return_delete_token', 'true')

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
    method: 'POST',
    body: form,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Upload failed')
  }

  const data = await res.json()
  return { secure_url: data.secure_url || data.url, delete_token: data.delete_token }
}

export async function deleteByToken(token: string) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  if (!cloudName) throw new Error('Cloudinary not configured')

  const body = new URLSearchParams()
  body.set('token', token)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/delete_by_token`, {
    method: 'POST',
    body,
  })

  if (!res.ok) throw new Error('Delete failed')
  return res.json()
}