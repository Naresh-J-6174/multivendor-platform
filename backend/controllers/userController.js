import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc Register a new user (buyer or seller)
// @route POST /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, shopName } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Only allow buyer/seller from public registration; admin is created via seeder only
    const safeRole = role === 'seller' ? 'seller' : 'buyer';

    const user = await User.create({
      name,
      email,
      password,
      role: safeRole,
      shopName: safeRole === 'seller' ? shopName || `${name}'s Shop` : ''
    });

    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      shopName: user.shopName
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Auth user & get token
// @route POST /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        shopName: user.shopName
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Logout user / clear cookie
// @route POST /api/users/logout
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.json({ message: 'Logged out' });
};

// @desc Get current logged in user's profile
// @route GET /api/users/profile
export const getProfile = async (req, res) => {
  res.json(req.user);
};

// ---------- ADMIN ONLY ----------

// @desc Get all sellers awaiting approval
// @route GET /api/users/admin/pending-sellers
export const getPendingSellers = async (req, res) => {
  const sellers = await User.find({ role: 'seller', isApproved: false }).select('-password');
  res.json(sellers);
};

// @desc Approve a seller account
// @route PUT /api/users/admin/approve-seller/:id
export const approveSeller = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.role !== 'seller') {
    return res.status(404).json({ message: 'Seller not found' });
  }
  user.isApproved = true;
  await user.save();
  res.json({ message: 'Seller approved', user });
};

// @desc Reject / remove a pending seller account
// @route DELETE /api/users/admin/reject-seller/:id
export const rejectSeller = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.role !== 'seller') {
    return res.status(404).json({ message: 'Seller not found' });
  }
  await user.deleteOne();
  res.json({ message: 'Seller rejected and removed' });
};

// @desc Get all users (for admin overview)
// @route GET /api/users/admin/all
export const getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
};
