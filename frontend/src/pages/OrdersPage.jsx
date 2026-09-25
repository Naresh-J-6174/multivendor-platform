import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/orders/myorders')
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center py-20 text-gray-400">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-400">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-400">
                  Order #{order._id.slice(-6).toUpperCase()} ·{' '}
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    order.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {order.isPaid ? 'Paid' : 'Payment Pending'}
                </span>
              </div>
              <div className="divide-y">
                {order.orderItems.map((item, i) => (
                  <div key={i} className="flex justify-between py-2 text-sm">
                    <span>
                      {item.name} × {item.qty}
                    </span>
                    <span>₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
              <div className="text-right font-semibold mt-2 text-gray-800">
                Total: ₹{order.totalPrice}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
