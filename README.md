# ShopHub — Multi-Vendor MERN Marketplace

A full-stack e-commerce marketplace where:
- **Buyers** browse and purchase products (mock payment, no real gateway)
- **Sellers** register, get approved by an admin, then list their own products (which also need admin approval before going live)
- **Admins** approve/reject sellers and products, and see everything happening on the platform

## Tech Stack
- Backend: Node.js, Express, MongoDB (Mongoose), JWT auth (httpOnly cookies)
- Frontend: React (Vite), Tailwind CSS (via CDN), React Router, Axios

## Project Structure
```
mern-marketplace/
  backend/     -> Express API + MongoDB models
  frontend/    -> React app (Vite)
```

## Setup

### 1. Backend
```
cd backend
npm install
```
Copy `.env.example` to `.env` and fill in:
```
MONGO_URI=mongodb://localhost:27017/marketplace   (or your Atlas URI)
JWT_SECRET=anyRandomLongString
```
Then seed demo data and start the server:
```
npm run data:import
npm run server
```
Backend runs at http://localhost:5000

### 2. Frontend
In a new terminal:
```
cd frontend
npm install
npm run dev
```
Frontend runs at http://localhost:5173

## Demo Accounts (created by the seeder)
| Role | Email | Password | Notes |
|---|---|---|---|
| Admin | admin@example.com | admin123 | Full access |
| Seller (approved) | seller1@example.com | seller123 | Already approved, has live products |
| Seller (pending) | seller2@example.com | seller123 | Not approved yet — log in as admin to approve |
| Buyer | buyer@example.com | buyer123 | Can browse, buy, check order history |

## Demo Flow (for your project presentation)
1. Log in as **buyer**, browse products, add to cart, checkout, click "Pay Now (Mock Payment)" — no real payment gateway involved.
2. Log out, register a **new seller** account — notice it's stuck on "pending approval".
3. Log in as **admin**, go to Admin Panel → Pending Sellers → approve the new seller.
4. Log back in as that seller → add a new product → notice it's marked "Pending".
5. Log in as admin again → Pending Products → approve it.
6. Log back in as a buyer (or browse logged out) → the new product now appears on the homepage.

This demonstrates the full seller-onboarding + product-approval workflow end to end.

## Notes
- Payment is fully mocked — clicking "Pay Now" just marks the order as paid in the database. No Razorpay/Stripe/real gateway is involved.
- Product images are entered as plain URLs (paste any image link) — there's no file upload system, keeping the project simpler to run and deploy.
- To deploy: host `backend` (Render/Railway) and `frontend` (Vercel/Netlify) separately, and set `CLIENT_URL` in the backend `.env` to your deployed frontend URL, and update `frontend/src/api/axios.js`'s `baseURL` to your deployed backend URL.
