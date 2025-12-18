import React, { useState, useEffect } from 'react'
import { X, Upload, Loader2 } from 'lucide-react'
import { useAuth } from '@/auth/provider'
import { useCreateRestaurant } from '@/hooks/useVendorApi'
import { uploadToCloudinary, deleteByToken } from '@/utils/upload'
import { toast } from 'sonner'
import { useVendorContext } from '@/context/VendorContext'
import { useQueryClient } from '@tanstack/react-query'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function CreateRestaurantModal({ isOpen, onClose }: Props) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const create = useCreateRestaurant()
  const { setActiveRestaurantId } = useVendorContext()

  const [restaurantName, setRestaurantName] = useState('')
  const [address, setAddress] = useState('')
  const [bannerUrl, setBannerUrl] = useState('')
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setRestaurantName('')
      setAddress('')
      setBannerUrl('')
      setBannerFile(null)
      setBannerPreview('')
    }
  }, [isOpen])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setBannerFile(file)
    if (file) {
      const url = URL.createObjectURL(file)
      setBannerPreview(url)
    } else {
      setBannerPreview('')
    }
  }

  // Cleanup preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (bannerPreview) URL.revokeObjectURL(bannerPreview)
    }
  }, [bannerPreview])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const ownerId = user?.id ? parseInt(user.id, 10) : 1
    let finalImageUrl = bannerUrl
    let uploadedDeleteToken: string | null = null

    // 1. Image Upload Logic
    if (bannerFile) {
      setIsUploading(true)
      try {
        const uploaded = await uploadToCloudinary(bannerFile)
        finalImageUrl = uploaded.secure_url
        uploadedDeleteToken = uploaded.delete_token ?? null
      } catch (err: any) {
        toast.error('Upload Failed', {
          description: 'Could not upload banner image.',
        })
        setIsUploading(false)
        return
      }
      setIsUploading(false)
    }

    // 2. Submit Data to Backend
    create.mutate(
      { restaurantName, ownerId, address, bannerImgUrl: finalImageUrl },
      {
        onSuccess: (data) => {
          // --- THE FIX: Refresh the Topbar list ---
          // This tells TanStack Query to re-fetch the list from the server
          queryClient.invalidateQueries({
            queryKey: ['vendor', 'my-restaurants'],
          })

          toast.success('Restaurant Created!', {
            description: `${restaurantName} is now in your list.`,
          })

          // Automatically switch the context to this new restaurant
          if (data?.id) {
            setActiveRestaurantId(data.id)
          }

          onClose()
        },
        onError: async (err: any) => {
          // Cleanup Cloudinary image if DB save fails
          if (uploadedDeleteToken) {
            await deleteByToken(uploadedDeleteToken).catch(console.error)
          }
          toast.error('Creation Failed', {
            description: err?.message || 'A server error occurred.',
          })
        },
      },
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border dark:border-slate-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold dark:text-white">
              Create Restaurant
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Setup your new business location
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <form id="res-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Image Preview Area */}
            <div className="group relative h-40 w-full rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden transition-all hover:border-emerald-500/50">
              {bannerPreview || bannerUrl ? (
                <img
                  src={bannerPreview || bannerUrl}
                  className="w-full h-full object-cover"
                  alt="Banner preview"
                />
              ) : (
                <div className="text-slate-400 flex flex-col items-center gap-2">
                  <Upload size={28} strokeWidth={1.5} />
                  <span className="text-xs font-medium">
                    Click below to upload a banner
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">
                  Restaurant Name
                </label>
                <input
                  required
                  placeholder="e.g. Blue Ocean Sushi"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">
                  Business Address
                </label>
                <input
                  required
                  placeholder="123 Gourmet Way, Food City"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">
                  Banner Image
                </label>
                <div className="flex flex-col gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 dark:file:bg-emerald-500/10 dark:file:text-emerald-400 cursor-pointer"
                  />
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-slate-100 dark:bg-slate-700" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      or URL
                    </span>
                    <div className="h-px flex-1 bg-slate-100 dark:bg-slate-700" />
                  </div>
                  <input
                    placeholder="https://..."
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 flex justify-end items-center gap-3">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="res-form"
            disabled={isUploading || create.isPending}
            className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {(isUploading || create.isPending) && (
              <Loader2 className="animate-spin" size={18} />
            )}
            {isUploading
              ? 'Uploading...'
              : create.isPending
                ? 'Saving...'
                : 'Create Restaurant'}
          </button>
        </div>
      </div>
    </div>
  )
}
