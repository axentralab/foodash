# 🍽️ FooDash — Full-Stack Food Ordering App

Built with **Next.js 14 · Supabase · Stripe · Zustand · Tailwind CSS**

---

## 🚀 Quick Start

```bash
unzip foodash-final.zip && cd foodash-app
npm install
npm run dev
# → http://localhost:3000
```

**Demo mode** works instantly — no Supabase or Stripe keys needed.
- Demo login: `demo@foodash.com` / `demo1234`
- Admin panel: `http://localhost:3000/admin`
- Promo code: `FOODASH` ($5 off)

---

## ✨ Features

### 👤 User App
| Page | Route | Description |
|---|---|---|
| Sign In / Up | `/auth/sign-in` | Supabase Auth |
| Menu | `/dashboard/menu` | 40 items, 12 categories, featured picks, offers |
| Search | `/dashboard/search` | Real-time search + price/rating/sort filters |
| Cart | `/dashboard/cart` | Add/remove, promo code, delivery address |
| Payment | `/dashboard/cart` | Card, bKash/Nagad/Rocket, Cash on Delivery |
| Orders | `/dashboard/orders` | Live tracking with animated progress + cancel |
| Profile | `/dashboard/profile` | Edit info, loyalty points, settings |

### 🛠️ Admin Panel (`/admin`)
| Page | Description |
|---|---|
| Dashboard | Stats overview, top-rated items |
| Menu Management | **Add / Edit / Delete / Toggle** food items |
| Orders | View all orders, update status |

### 🔌 API Routes (Backend)
| Endpoint | Method | Description |
|---|---|---|
| `/api/menu` | GET | Menu items with filters, sort, search |
| `/api/categories` | GET | All categories |
| `/api/orders` | GET / POST | User orders + place new order |
| `/api/orders/[id]` | GET / PATCH | Single order + cancel |
| `/api/profile` | GET / PATCH | User profile |
| `/api/favorites` | GET / POST | Toggle favorites |
| `/api/payment/create-intent` | POST | Stripe payment intent |
| `/api/payment/webhook` | POST | Stripe webhook handler |
| `/api/admin/menu` | GET / POST | Admin: list/create items |
| `/api/admin/menu/[id]` | PATCH / DELETE | Admin: update/delete item |
| `/api/auth/callback` | GET | OAuth callback |

---

## ⚙️ Environment Setup

```bash
cp .env.local.example .env.local
```

```env
# Supabase (supabase.com → Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Stripe (dashboard.stripe.com → Developers → API Keys)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🗄️ Supabase Setup

1. Create project at [supabase.com](https://supabase.com)
2. Run `supabase-schema.sql` in SQL Editor
3. Add env vars

**Tables:** `profiles` · `categories` · `menu_items` · `orders` · `order_items` · `favorites`

**Features:** Row Level Security · Realtime on orders · Auto-create profile trigger · Loyalty points RPC

---

## 💳 Stripe Setup

1. Create account at [stripe.com](https://stripe.com)
2. Get test API keys from Dashboard → Developers
3. For webhooks: `stripe listen --forward-to localhost:3000/api/payment/webhook`

**Supported payments:** Credit/Debit Card · bKash · Nagad · Rocket · Cash on Delivery

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── admin/                  ← Admin panel
│   │   ├── menu/page.tsx       ← Add/Edit/Delete food items
│   │   └── orders/page.tsx     ← Manage all orders
│   ├── api/                    ← Backend API routes
│   │   ├── menu/               ← Menu CRUD
│   │   ├── orders/             ← Orders + cancel
│   │   ├── payment/            ← Stripe integration
│   │   ├── admin/menu/         ← Admin-only CRUD
│   │   └── profile/            ← User profile
│   ├── auth/                   ← Sign in / Sign up
│   └── dashboard/              ← Main user app
├── components/
│   ├── menu/MenuCard.tsx
│   └── payment/PaymentForm.tsx ← Card + Mobile + Cash UI
├── hooks/
│   ├── useMenu.ts              ← API + mock fallback
│   ├── useOrders.ts            ← Orders + place order
│   ├── useProfile.ts           ← Profile + update
│   └── useRealtime.ts          ← Supabase realtime
├── lib/
│   ├── actions/index.ts        ← Server Actions
│   ├── mock-data.ts            ← 40 food items
│   └── supabase/               ← Client + server
├── middleware.ts               ← Auth protection
├── store/cart.store.ts         ← Zustand (persisted)
└── types/index.ts
```
