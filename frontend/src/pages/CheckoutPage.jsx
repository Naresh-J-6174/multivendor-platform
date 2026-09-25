import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ address: '', city: '', postalCode: '', country: '' });
  const [placing, setPlacing] = useState(false);
  const [paying, setPaying] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setPlacing(true);
    try {
      const orderItems = cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item._id,
        seller: item.seller?._id || item.seller
      }));

      const { data } = await api.post('/orders', {
        orderItems,
        shippingAddress: address,
        totalPrice
      });
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order');
    }
    setPlacing(false);
  };

  const handleMockPay = async () => {
    setPaying(true);
    try {
      await api.put(`/orders/${order._id}/pay`);
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    }
    setPaying(false);
  };

  if (order) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Order Placed!</h2>
          <p className="text-gray-500 mb-6">Total: ₹{order.totalPrice}</p>
          <p className="text-xs text-gray-400 mb-6">
            No real payment gateway is connected — click below to simulate a successful payment.
          </p>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            onClick={handleMockPay}
            disabled={paying}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
          >
            {paying ? 'Processing...' : 'Pay Now (Mock Payment)'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Shipping Details</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handlePlaceOrder} className="space-y-4">
          <input
            placeholder="Address"
            value={address.address}
            onChange={(e) => setAddress({ ...address, address: e.target.value })}
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <input
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <input
            placeholder="Postal Code"
            value={address.postalCode}
            onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <input
            placeholder="Country"
            value={address.country}
            onChange={(e) => setAddress({ ...address, country: e.target.value })}
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <div className="flex justify-between font-semibold text-gray-800 pt-2">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
          <button
            type="submit"
            disabled={placing}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
          >
            {placing ? 'Placing order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
