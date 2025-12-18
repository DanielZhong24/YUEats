import React, { useState, useEffect, useRef } from 'react'
import {
  X,
  Upload,
  Loader2,
  MapPin,
  Link as LinkIcon,
  Image as ImageIcon,
} from 'lucide-react'
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

  // --- Form State ---
  const [restaurantName, setRestaurantName] = useState('')
  const [address, setAddress] = useState('')
  const [bannerUrl, setBannerUrl] = useState('') // Used for the direct Link
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState('')

  // --- Address State ---
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchTimeout = useRef<NodeJS.Timeout | null>(null)

  const [isUploading, setIsUploading] = useState(false)

  // Reset form on close
  useEffect(() => {
    if (!isOpen) {
      setRestaurantName('')
      setAddress('')
      setBannerUrl('')
      setBannerFile(null)
      setBannerPreview('')
      setSuggestions([])
    }
  }, [isOpen])

  // --- Address Logic (Nominatim) ---
  useEffect(() => {
    if (address.length > 3 && !isLocating) {
      if (searchTimeout.current) clearTimeout(searchTimeout.current)
      searchTimeout.current = setTimeout(async () => {
        setIsSearching(true)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5`,
          )
          const data = await res.json()
          setSuggestions(data)
          setShowDropdown(true)
        } catch (err) {
          console.error(err)
        } finally {
          setIsSearching(false)
        }
      }, 500)
    }
  }, [address])

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return toast.error('Geolocation not supported')
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`,
        )
        const data = await res.json()
        setAddress(data.display_name)
      } finally {
        setIsLocating(false)
      }
    })
  }

  // --- Image Logic ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setBannerFile(file)
    setBannerUrl('') // Clear link if file is chosen
    if (file) {
      const url = URL.createObjectURL(file)
      setBannerPreview(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) {
      toast.error('User not authenticated')
      return
    }
    const ownerId = user.id
    let finalImageUrl = bannerUrl // Default to the link provided
    let uploadedDeleteToken: string | null = null

    // If a file was picked, upload it and override the finalImageUrl
    if (bannerFile) {
      setIsUploading(true)
      try {
        const uploaded = await uploadToCloudinary(bannerFile)
        finalImageUrl = uploaded.secure_url
        uploadedDeleteToken = uploaded.delete_token ?? null
      } catch (err) {
        toast.error('Upload Failed')
        setIsUploading(false)
        return
      }
    }

    if (!finalImageUrl)
      return toast.error('Please provide a banner image or link')

    create.mutate(
      { restaurantName, ownerId, address, bannerImgUrl: finalImageUrl },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ['vendor', 'my-restaurants'],
          })
          toast.success('Restaurant Created!')
          if (data?.id) setActiveRestaurantId(data.id)
          onClose()
        },
        onError: async () => {
          if (uploadedDeleteToken) await deleteByToken(uploadedDeleteToken)
          toast.error('Creation Failed')
        },
      },
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden flex flex-col border dark:border-slate-700">
        {/* Header */}
        <div className="p-8 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">
              New Location
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Setup your restaurant profile
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[70vh] space-y-8">
          <form id="res-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">
                Restaurant Name
              </label>
              <input
                required
                placeholder="e.g. Burger King"
                className="w-full p-4 rounded-2xl border dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-red-600 font-bold"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
              />
            </div>

            {/* Real Address Input */}
            <div className="relative">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">
                Business Address
              </label>
              <div className="relative">
                <input
                  required
                  placeholder="Street, City, Postcode"
                  className="w-full p-4 pr-12 rounded-2xl border dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-red-600 font-bold text-sm"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value)
                    setShowDropdown(true)
                  }}
                />
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-red-600"
                >
                  {isLocating || isSearching ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <MapPin size={20} />
                  )}
                </button>
              </div>
              {showDropdown && suggestions.length > 0 && (
                <div className="absolute z-20 w-full mt-2 bg-white dark:bg-slate-900 border rounded-2xl shadow-xl max-h-48 overflow-y-auto p-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setAddress(s.display_name)
                        setShowDropdown(false)
                      }}
                      className="w-full text-left p-3 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    >
                      {s.display_name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Banner Toggle: File or Link */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">
                Restaurant Banner
              </label>

              <div className="h-40 w-full rounded-3xl bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden relative group">
                {bannerPreview || bannerUrl ? (
                  <img
                    src={bannerPreview || bannerUrl}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <ImageIcon
                      className="mx-auto text-slate-300 mb-2"
                      size={32}
                    />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Preview Area
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Option 1: File Upload */}
                <div className="relative">
                  <input
                    type="file"
                    id="banner-file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="banner-file"
                    className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 border rounded-2xl cursor-pointer hover:border-red-600 transition-all"
                  >
                    <Upload size={18} className="text-red-600" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-600">
                      {bannerFile ? bannerFile.name : 'Upload Local Image'}
                    </span>
                  </label>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 px-2">
                  <div className="h-px flex-1 bg-slate-100" />
                  <span className="text-[10px] font-black text-slate-300 uppercase">
                    OR
                  </span>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>

                {/* Option 2: External Link */}
                <div className="relative">
                  <LinkIcon
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    placeholder="PASTE IMAGE URL HERE..."
                    className="w-full p-4 pl-12 rounded-2xl border dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-red-600 text-[10px] font-black tracking-widest"
                    value={bannerUrl}
                    onChange={(e) => {
                      setBannerUrl(e.target.value)
                      setBannerFile(null)
                      setBannerPreview('')
                    }}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="text-xs font-black uppercase text-slate-400 hover:text-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="res-form"
            disabled={isUploading || create.isPending}
            className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-2xl font-black italic uppercase tracking-tighter shadow-xl shadow-red-600/20 disabled:opacity-50 transition-all active:scale-95"
          >
            {isUploading
              ? 'Uploading Image...'
              : create.isPending
                ? 'Saving...'
                : 'Create Restaurant'}
          </button>
        </div>
      </div>
    </div>
  )
}
