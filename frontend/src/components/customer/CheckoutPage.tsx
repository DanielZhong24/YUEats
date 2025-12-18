import { useAuth } from '@/auth/provider' // 👈 Use your AuthContext
import { useCartStore } from '@/store/useCartStore'
import { Trash2, Clock, MapPin, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import * as customerService from '@/services/customer'
import { useState } from 'react'

const CAMPUSES = [
  { id: 'Keele', name: 'Keele Campus', address: '4700 Keele St, Toronto, ON' },
  { id: 'Glendon', name: 'Glendon Campus', address: '2275 Bayview Ave, Toronto, ON' },
  { id: 'Markham', name: 'Markham Campus', address: '1 University Blvd, Markham, ON' }
]

export default function CheckoutPage() {
  // 1. Properly pull the user from your context
  const { user, isAuthenticated } = useAuth() 
  const { items, getTotal, clearCart, removeItem } = useCartStore()
  const navigate = useNavigate()
  
  const [selectedCampus, setSelectedCampus] = useState(CAMPUSES[0])
  const [isSubmitting, setIsSubmitting] = useState(false)
const handlePlaceOrder = async () => {
  // 1. Group items by their restaurantId
  const groups = items.reduce((acc, item) => {
    if (!acc[item.restaurantId]) acc[item.restaurantId] = [];
    acc[item.restaurantId].push(item);
    return acc;
  }, {} as Record<number, typeof items>);

  setIsSubmitting(true);

  try {
    // 2. Create an array of promises (one for each restaurant)
    const orderPromises = Object.entries(groups).map(([rId, groupItems]) => {
      const payload = {
        customerId: Number(user?.id),
        restaurantId: Number(rId),
        deliveryAddress: selectedCampus.name,
        items: groupItems.map(i => ({
          menuItemId: Number(i.id),
          quantity: Number(i.quantity)
        }))
      };
      return customerService.createOrder(payload); // API Call
    });

    // 3. Fire all orders at once
    await Promise.all(orderPromises);

    alert(`Successfully placed ${Object.keys(groups).length} separate orders!`);
    clearCart();
    navigate({ to: '/customer/dashboard' });
  } catch (error) {
    console.error("One or more orders failed", error);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="max-w-[1000px] mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-8">
        <h1 className="text-4xl font-black italic tracking-tighter">Checkout</h1>

        {/* User Info Section */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm">
          <p className="text-slate-500 font-bold uppercase text-[10px]">Ordering as</p>
          <p className="font-bold text-slate-900">{user?.firstName} {user?.lastName} ({user?.email})</p>
        </div>

        {/* Campus Selector */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MapPin size={22} className="text-red-600" /> Pickup Campus
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {CAMPUSES.map((campus) => (
              <button
                key={campus.id}
                onClick={() => setSelectedCampus(campus)}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  selectedCampus.id === campus.id ? 'border-black bg-slate-50' : 'border-slate-100'
                }`}
              >
                <div className="text-left">
                  <p className="font-bold text-slate-900">{campus.name}</p>
                </div>
                {selectedCampus.id === campus.id && <CheckCircle2 size={20} className="text-black" />}
              </button>
            ))}
          </div>
        </section>

        {/* Review Items */}
        <section className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock size={22} className="text-green-600" /> Order Summary
          </h2>
          <div className="bg-white rounded-2xl border border-slate-100">
            {items.map((item) => (
              <div key={item.id} className="p-4 flex justify-between items-center border-b last:border-none">
                <div className="flex items-center gap-4">
                  <span className="font-black text-xs">{item.quantity}×</span>
                  <p className="font-bold">{item.itemName}</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500">
                    <Trash2 size={18}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sidebar Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-2xl sticky top-24 space-y-6">
          <div className="flex justify-between text-2xl font-black">
            <span>Total</span>
            <span>${getTotal().toFixed(2)}</span>
          </div>

          <button 
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <>Place Order <ChevronRight /></>}
          </button>
        </div>
      </div>
    </div>
  )
}