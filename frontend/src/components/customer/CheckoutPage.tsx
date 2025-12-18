import { useCartStore } from '@/store/useCartStore'
import { ShoppingBag, ChevronLeft, Trash2, Clock } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore()
  const navigate = useNavigate()

  const handlePlaceOrder = async () => {
    // This is where you would call your API: axios.post('/orders', { items, total: getTotal() })
    alert("Order placed successfully for pickup!")
    clearCart()
    navigate({ to: '/customer/dashboard' })
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="bg-slate-100 p-6 rounded-full">
          <ShoppingBag size={48} className="text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <Link to="/customer/dashboard" className="text-green-600 font-bold hover:underline">
          Go back to browse restaurants
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[800px] mx-auto p-8">
      <Link to="/customer" className="flex items-center gap-1 text-sm font-bold mb-8 hover:text-slate-600">
        <ChevronLeft size={16} /> Back to browsing
      </Link>

      <h1 className="text-4xl font-black mb-8">Your Order</h1>

      <div className="space-y-6">
        {/* Pickup Info Header */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-3">
            <Clock className="text-green-600" size={20} />
            <div>
              <p className="font-bold text-sm">Pickup estimate</p>
              <p className="text-xs text-slate-500 font-medium">Ready in 15–25 min</p>
            </div>
          </div>
          <button className="text-xs font-bold bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
            Change
          </button>
        </div>

        {/* Item List */}
        <div className="divide-y divide-slate-100">
          {items.map((item) => (
            <div key={item.id} className="py-6 flex justify-between items-center">
              <div className="flex gap-4">
                <div className="bg-slate-100 px-3 py-1 rounded-md h-fit font-bold text-sm">
                  {item.quantity}
                </div>
                <div>
                  <h4 className="font-bold">{item.itemName}</h4>
                  <p className="text-xs text-slate-500 font-medium">Standard preparation</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                <button className="text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="pt-8 space-y-3 border-t-2 border-slate-100">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 font-medium">Subtotal</span>
            <span className="font-medium">${getTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 font-medium">Taxes & Fees</span>
            <span className="font-medium">$0.00</span>
          </div>
          <div className="flex justify-between text-xl font-black pt-2">
            <span>Total</span>
            <span>${getTotal().toFixed(2)}</span>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handlePlaceOrder}
          className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg mt-8 hover:bg-slate-800 transition-all shadow-xl"
        >
          Place Pickup Order
        </button>
      </div>
    </div>
  )
}