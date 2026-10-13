# RentNest Frontend

**"Find & List Rental Properties with Ease"**

RentNest is a rental property marketplace. This is the frontend of the project. Tenants browse the properties, send rental requests and pay with Stripe. Landlords list their properties and manage the requests. Admins manage the users, the listings and the property categories.

The frontend is built with Next.js (App Router) and it uses my own RentNest backend API from assignment 4.

## Links

| Item | Link |
| --- | --- |
| Live Frontend | https://rentnest-frontend-gold.vercel.app |
| Frontend Repo | https://github.com/ebrahim2355/rentnest-frontend |
| Backend API | https://rentnest-backend-red.vercel.app |
| Backend API Docs | https://rentnest-backend-red.vercel.app/api/docs |
| Backend Repo | https://github.com/ebrahim2355/rentnest-backend |
| API Integration Map | [API_INTEGRATION.md](./API_INTEGRATION.md) |

## Admin Credentials

| Email | Password |
| --- | --- |
| admin@rentnest.com | admin123 |

There are two demo accounts too. The login page has buttons that fill these accounts in one click.

| Role | Email | Password |
| --- | --- | --- |
| Landlord | landlord@rentnest.com | landlord123 |
| Tenant | tenant@rentnest.com | tenant123 |

Stripe is in test mode. Use the card `4242 4242 4242 4242` with any future date and any CVC.

## Features

### Public

- Home page with a hero search, the featured properties and the property types
- Browse page with search, filters (location, type, price range, bedrooms, amenities), sorting and pagination
- The filters are saved in the URL, so a filtered page can be shared or reloaded
- Property details page with an image gallery, the landlord info and the reviews
- Register as a tenant or a landlord, and login
- Light and dark mode

### Tenant

- Send a rental request from the property details page
- See all requests with the status (Pending, Approved, Active, Completed, Rejected, Cancelled)
- Cancel a request
- Pay for an approved request with Stripe Checkout
- Payment success and payment cancel pages
- Payment history table
- Leave a review with a star rating
- Update the profile

### Landlord

- Overview with the stats and the latest requests
- Create, edit and delete properties, with image links and amenities
- Turn the availability of a property on and off
- Approve or reject rental requests and mark a rental as completed
- See the reviews of own properties

### Admin

- Overview with the platform stats
- See all users with search and filters, ban and unban a user
- See all properties and remove a listing
- See all rental requests
- Create, rename and delete property categories

## Tech Stack

- Next.js 16 (App Router) and React 19
- TypeScript
- Tailwind CSS 4
- TanStack Query for the client side data and the mutations
- React Context for the logged in user
- React Hook Form and Zod for the forms
- Sonner for the toast messages
- next-themes for the dark mode
- Stripe Checkout for the payment

## How it works

### Server and client components

The public pages (home, browse, details) are server components. They get the data on the server with `fetch`, so the page comes with the content and it is good for SEO. The slow parts are inside `Suspense` with a skeleton, so the page shell shows first.

The dashboards are client components with TanStack Query. The data there is private and it changes after every action, so the query cache, the refetch and the optimistic updates are useful there.

### Login and the JWT

The backend gives a JWT on login. The frontend does not keep it in `localStorage`. The Next.js route handler `/api/auth/login` takes the token from the backend and saves it in an `httpOnly` cookie, so JavaScript in the browser cannot read it.

The browser never calls the backend directly for private data. It calls `/api/backend/...` and that route handler reads the cookie and sends the request to the backend with the `Authorization` header.

### Route protection

Next.js 16 renamed Middleware to Proxy, so the file is [src/proxy.ts](./src/proxy.ts). It does the same job as `middleware.ts` in the older versions. It runs before the page and it checks the cookie.

- A visitor who opens `/dashboard/...` or `/payment/...` goes to the login page, and comes back to the same page after login
- A logged in user who opens `/auth/login` goes to the own dashboard
- A tenant cannot open the landlord or the admin dashboard, and the same for the other roles

The navbar, the sidebar and the buttons also change with the role.

### Payment flow

1. The landlord approves the request
2. The tenant clicks **Pay now** and sees the payment summary
3. The frontend calls `POST /payments/checkout` and the backend makes a Stripe Checkout session
4. The tenant pays on the Stripe page
5. Stripe sends the tenant to `/payment/success?session_id=...`. The page calls `POST /payments/confirm`, the backend checks the session with Stripe and the rental becomes Active
6. If the tenant leaves the Stripe page, Stripe sends the tenant to `/payment/cancel` and the tenant can try again

### Error handling

- Every failed API call shows a toast with the message from the backend
- Form validation errors show under the field. The validation errors from the backend are also put under the right field
- Every list has a loading skeleton, an empty state and an error state with a retry button
- `error.tsx` files catch the page errors, `global-error.tsx` catches the layout errors and `not-found.tsx` is the 404 page
- If the backend is down or the internet is off, the user sees a clear message and not a blank page
- If the session is expired, the user goes to the login page with a note and comes back to the same page after the login

## Project Structure

```text
src
├── app
│   ├── (site)              public pages with the navbar and the footer
│   │   ├── properties      browse page and details page
│   │   └── payment         success page and cancel page
│   ├── auth                login and register
│   ├── dashboard
│   │   ├── tenant          overview, requests, pay page, payments
│   │   ├── landlord        overview, properties, requests, reviews
│   │   ├── admin           overview, users, properties, rentals, categories
│   │   └── profile
│   ├── api
│   │   ├── auth            login, register, logout, me (cookie handling)
│   │   └── backend         proxy route to the backend API
│   ├── not-found.tsx
│   └── global-error.tsx
├── components
│   ├── ui                  button, form field, modal, table, skeleton, badge...
│   ├── layout              navbar, footer, user menu, theme toggle
│   ├── home
│   ├── property
│   ├── payment
│   ├── auth
│   ├── dashboard
│   └── providers           theme, TanStack Query, auth context, toaster
├── lib                     api client, validations, helpers
├── types
└── proxy.ts                route protection (Middleware)
```

## Run it locally

You need Node.js 20 or newer and a running RentNest backend.

1. Clone the repo and install the packages

```bash
git clone https://github.com/ebrahim2355/rentnest-frontend.git
cd rentnest-frontend
npm install
```

2. Make a `.env.local` file from the example

```bash
cp .env.example .env.local
```

| Variable | Description |
| --- | --- |
| API_URL | Base URL of the backend API. Use `http://localhost:5000/api` for a local backend or `https://rentnest-backend-red.vercel.app/api` for the live one |

3. Start the dev server

```bash
npm run dev
```

Open http://localhost:3000.

For the Stripe redirect to work, the backend must allow the frontend URL. Set `CLIENT_URL` in the backend `.env` file to the frontend URL (for example `http://localhost:3000`).

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Starts the dev server |
| `npm run build` | Makes the production build |
| `npm start` | Runs the production build |
| `npm run lint` | Runs ESLint |
