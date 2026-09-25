import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  getPendingSellers,
  approveSeller,
  rejectSeller,
  getAllUsers
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getProfile);

// Admin: seller approval workflow
router.get('/admin/pending-sellers', protect, admin, getPendingSellers);
router.put('/admin/approve-seller/:id', protect, admin, approveSeller);
router.delete('/admin/reject-seller/:id', protect, admin, rejectSeller);
router.get('/admin/all', protect, admin, getAllUsers);

export default router;
