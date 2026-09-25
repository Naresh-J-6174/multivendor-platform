import Order from '../models/Order.js';

// @desc Create a new order
// @route POST /api/orders
export const addOrderItems = async (req, res) => {
  const { orderItems, shippingAddress, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    totalPrice
  });

  res.status(201).json(order);
};

// @desc Mock "pay now" — instantly marks the order as paid, no real gateway
// @route PUT /api/orders/:id/pay
export const markOrderAsPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  const updated = await order.save();
  res.json(updated);
};

// @desc Get logged-in user's own orders
// @route GET /api/orders/myorders
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

// @desc Get a single order by id (owner or admin)
// @route GET /api/orders/:id
export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }
  res.json(order);
};

// @desc Admin: get all orders in the system
// @route GET /api/orders
export const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
};

// @desc Seller: get orders that contain at least one of their own products
// @route GET /api/orders/seller/mine
export const getSellerOrders = async (req, res) => {
  const orders = await Order.find({ 'orderItems.seller': req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};
