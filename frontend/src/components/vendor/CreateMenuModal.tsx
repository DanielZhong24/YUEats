import { useState, useEffect } from 'react'
import { X, Upload, Loader2 } from 'lucide-react'
import { useCreateMenuItem, useUpdateMenuItem } from '@/hooks/useVendorApi' 
import { CreateMenuItemData } from '@/services/vendor'
import { uploadToCloudinary, deleteByToken } from '@/utils/upload'
import { toast } from 'sonner'
type Props = {
  isOpen: boolean
  onClose: () => void
  restaurantId: number | string 
  editItem?: any | null
}

export default function CreateMenuModal({ isOpen, onClose, restaurantId, editItem }: Props) {
  const { mutate: createItem, isPending: isCreating } = useCreateMenuItem()
  const { mutate: updateItem, isPending: isUpdating } = useUpdateMenuItem()

  const isEditMode = !!editItem
  const isPending = isCreating || isUpdating

  const [formData, setFormData] = useState<any>({
    itemName: '', 
    description: '', 
    price: '', 
    imgUrl: '', 
    category: 'Mains',
    isAvailable: true
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  // 🔄 Log when the modal opens and what data it's loading
  useEffect(() => {
    if (isOpen) {
      if (editItem) {
        setFormData({
          itemName: editItem.itemName || '',
          description: editItem.description || '',
          price: editItem.price?.toString() || '',
          imgUrl: editItem.imgUrl || '',
          category: editItem.category || 'Mains',
          isAvailable: editItem.available ?? editItem.isAvailable ?? true
        })
        setImagePreview(editItem.imgUrl || '')
      } else {
        setFormData({ itemName: '', description: '', price: '', imgUrl: '', category: 'Mains', isAvailable: true })
        setImagePreview('')
      }
      setImageFile(null)
    }
  }, [isOpen, editItem, isEditMode])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setImageFile(file)
    if (file) {
      const url = URL.createObjectURL(file)
      setImagePreview(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let finalImageUrl = formData.imgUrl
    let uploadedDeleteToken: string | null = null

    if (imageFile) {
      setIsUploading(true)
      try {
        const uploaded = await uploadToCloudinary(imageFile)
        finalImageUrl = uploaded.secure_url
        uploadedDeleteToken = uploaded.delete_token ?? null
      } catch (err: any) {
        alert('Image upload failed')
        setIsUploading(false)
        return
      }
      setIsUploading(false)
    }

    // 🚀 Prepare the Payload
    const cleanPayload = {
      itemName: formData.itemName,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      imgUrl: finalImageUrl,
      category: formData.category,      
      categoryName: formData.category, // Shotgun fix for Java Record mapping
      isAvailable: formData.isAvailable,
      available: formData.isAvailable 
    }

    // 🔍 THE CONSOLE LOG: Check this in F12 when you click save!

    const mutationOptions = {
      onSuccess: () => {
        toast.success('Item created successfully!', {
        description: 'The new dish is now visible on your menu.',
      })
        onClose()
      },
      onError: (error: any) => {
        if (uploadedDeleteToken) deleteByToken(uploadedDeleteToken).catch(console.error)
        console.error("❌ Submission Failed:", error);
        toast.error('Could not save item', {
          description: error.message || 'Please check your connection.',
        })
      }
    }

    if (isEditMode) {
      updateItem({ 
        restaurantId, 
        itemId: editItem.id || editItem._id, 
        data: cleanPayload 
      }, mutationOptions)
    } else {
      createItem({ 
        restaurantId, 
        payload: cleanPayload as any 
      }, mutationOptions)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        
        <div className="flex justify-between items-center p-4 border-b dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {isEditMode ? 'Edit Menu Item' : 'Add New Item'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <form id="menu-item-form" onSubmit={handleSubmit} className="space-y-4">
            
            {/* Image Preview Area */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg border border-slate-300 bg-slate-50 dark:bg-slate-700 flex-shrink-0 overflow-hidden flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="text-slate-400" size={24} />
                )}
              </div>
              <div className="flex-1">
                 <label className="block text-sm font-medium mb-1 dark:text-slate-300">Food Image</label>
                 <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-xs text-slate-500 mb-2"/>
                 <input 
                   type="text" 
                   placeholder="Or paste image URL..."
                   className="w-full p-2 text-sm border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                   value={formData.imgUrl}
                   onChange={e => setFormData({...formData, imgUrl: e.target.value})}
                 />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-slate-300">Item Name</label>
              <input required type="text" className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                value={formData.itemName}
                onChange={e => setFormData({...formData, itemName: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-slate-300">Description</label>
              <textarea required rows={2} className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Price ($)</label>
                <input required type="number" step="any" placeholder="0.00" min="0"className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Category</label>
                <select 
                  className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white bg-white dark:bg-slate-900"
                  value={formData.category}
                  onChange={e => {
                    console.log("🔄 UI Category Changed to:", e.target.value);
                    setFormData({...formData, category: e.target.value})
                  }}
                >
                  <option value="Mains">Mains</option>
                  <option value="Starters">Starters</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        <div className="p-4 border-t dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <button 
            type="submit" 
            form="menu-item-form"
            disabled={isPending || isUploading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-all disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {(isPending || isUploading) && <Loader2 className="animate-spin" size={18} />}
            {isUploading ? 'Uploading...' : isEditMode ? 'Update Item' : 'Create Item'}
          </button>
        </div>
      </div>
    </div>
  )
}