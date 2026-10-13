# API Integration

This file shows which frontend page and component uses which backend endpoint.

- Backend base URL: `https://rentnest-backend-red.vercel.app/api`
- Backend docs: https://rentnest-backend-red.vercel.app/api/docs
- The base URL comes from the `API_URL` environment variable

## How the frontend calls the backend

There are two ways.

| Way | Used in | How it works |
| --- | --- | --- |
| Server fetch | Public pages (server components) | The page calls the backend on the server with `serverFetch` from [src/lib/server-api.ts](./src/lib/server-api.ts). No token is needed for these endpoints |
| Client fetch | Dashboards and forms (client components) | The component calls `api.get`, `api.post` and so on from [src/lib/api.ts](./src/lib/api.ts). The request goes to the Next.js route `/api/backend/...`, the route reads the JWT from the `httpOnly` cookie and sends the request to the backend with the `Authorization: Bearer <token>` header |

So the JWT stays in an `httpOnly` cookie and the browser JavaScript never sees it.

Every backend response has the same shape, and the frontend reads it in one place ([src/lib/http.ts](./src/lib/http.ts)).

```json
{
  "success": true,
  "message": "Properties retrieved successfully",
  "meta": { "page": 1, "limit": 9, "total": 8, "totalPages": 1 },
  "data": []
}
```

## Next.js route handlers

These routes are inside the frontend. They sit between the browser and the backend.

| Frontend route | Backend endpoint | What it does |
| --- | --- | --- |
| `POST /api/auth/login` | `POST /auth/login` | Logs in and saves the token in the `rentnest_token` cookie |
| `POST /api/auth/register` | `POST /auth/register` then `POST /auth/login` | Creates the account and logs the user in |
| `POST /api/auth/logout` | none | Removes the cookie |
| `GET /api/auth/me` | `GET /auth/me` | Returns the logged in user. Removes the cookie if the token is not valid any more |
| `ALL /api/backend/[...path]` | same path on the backend | Sends any request to the backend with the token from the cookie |

## Authentication

| Page | Component | Endpoint | Purpose |
| --- | --- | --- | --- |
| `/auth/login` | `auth/login-form.tsx` | `POST /auth/login` | Login |
| `/auth/register` | `auth/register-form.tsx` | `POST /auth/register` | Register as tenant or landlord |
| All pages | `providers/auth-provider.tsx` | `GET /auth/me` | Load the logged in user for the navbar and the dashboards |
| `/dashboard/profile` | `dashboard/profile-form.tsx` | `PATCH /auth/me` | Update the name and the phone |

## Public pages

| Page | Component | Endpoint | Purpose |
| --- | --- | --- | --- |
| `/` | `home/featured-properties.tsx` | `GET /properties?limit=6` | Featured properties |
| `/` | `home/category-list.tsx` | `GET /categories` | Property types |
| `/properties` | `property/property-results.tsx` | `GET /properties` | Property list with `searchTerm`, `location`, `type`, `minPrice`, `maxPrice`, `bedrooms`, `amenities`, `sortBy`, `sortOrder`, `page`, `limit` |
| `/properties` | `app/(site)/properties/page.tsx` | `GET /categories` | Options of the property type filter in `property/property-browser.tsx` |
| `/properties/[id]` | `app/(site)/properties/[id]/page.tsx` | `GET /properties/:id` | Property details, landlord, reviews and average rating |

## Tenant

| Page | Component | Endpoint | Purpose |
| --- | --- | --- | --- |
| `/properties/[id]` | `property/rent-request-card.tsx` | `POST /rentals` | Send a rental request |
| `/dashboard/tenant` | `dashboard/tenant/tenant-overview.tsx` | `GET /rentals/stats` | Stat cards |
| `/dashboard/tenant` | `dashboard/tenant/tenant-overview.tsx` | `GET /rentals?limit=3` | Latest requests |
| `/dashboard/tenant/requests` | `dashboard/tenant/tenant-requests.tsx` | `GET /rentals` | Request history with status filter and pagination |
| `/dashboard/tenant/requests` | `dashboard/tenant/tenant-requests.tsx` | `PATCH /rentals/:id/cancel` | Cancel a request |
| `/dashboard/tenant/requests` | `dashboard/review-dialog.tsx` | `POST /reviews` | Leave a review |
| `/dashboard/tenant/requests/[id]/pay` | `payment/pay-panel.tsx` | `GET /rentals/:id` | Payment summary |
| `/dashboard/tenant/requests/[id]/pay` | `payment/pay-panel.tsx` | `POST /payments/checkout` | Create the Stripe Checkout session and go to Stripe |
| `/payment/success` | `payment/payment-result.tsx` | `POST /payments/confirm` | Confirm the payment after Stripe sends the tenant back |
| `/payment/cancel` | `payment/payment-cancelled.tsx` | none | Shows the message and a link to try again |
| `/dashboard/tenant/payments` | `dashboard/tenant/tenant-payments.tsx` | `GET /payments` | Payment history with status filter |

## Landlord

| Page | Component | Endpoint | Purpose |
| --- | --- | --- | --- |
| `/dashboard/landlord` | `dashboard/landlord/landlord-overview.tsx` | `GET /landlord/stats` | Stat cards |
| `/dashboard/landlord` | `dashboard/landlord/landlord-requests.tsx` | `GET /landlord/requests` | Latest requests |
| `/dashboard/landlord/properties` | `dashboard/landlord/landlord-properties.tsx` | `GET /landlord/properties` | Own properties |
| `/dashboard/landlord/properties` | `dashboard/landlord/landlord-properties.tsx` | `PUT /landlord/properties/:id` | Change the availability status |
| `/dashboard/landlord/properties` | `dashboard/landlord/landlord-properties.tsx` | `DELETE /landlord/properties/:id` | Delete a property |
| `/dashboard/landlord/properties/new` | `dashboard/landlord/property-form.tsx` | `POST /landlord/properties` | Create a property |
| `/dashboard/landlord/properties/new` | `dashboard/landlord/property-form.tsx` | `GET /categories` | Options of the property type |
| `/dashboard/landlord/properties/[id]/edit` | `dashboard/landlord/edit-property.tsx` | `GET /properties/:id` | Load the property into the form |
| `/dashboard/landlord/properties/[id]/edit` | `dashboard/landlord/property-form.tsx` | `PUT /landlord/properties/:id` | Update a property |
| `/dashboard/landlord/requests` | `dashboard/landlord/landlord-requests.tsx` | `GET /landlord/requests` | Requests for own properties with status filter |
| `/dashboard/landlord/requests` | `dashboard/landlord/landlord-requests.tsx` | `PATCH /landlord/requests/:id` | Approve, reject or complete a request |
| `/dashboard/landlord/reviews` | `dashboard/landlord/landlord-reviews.tsx` | `GET /landlord/reviews` | Reviews of own properties |

## Admin

| Page | Component | Endpoint | Purpose |
| --- | --- | --- | --- |
| `/dashboard/admin` | `dashboard/admin/admin-overview.tsx` | `GET /admin/stats` | Platform stats |
| `/dashboard/admin/users` | `dashboard/admin/admin-users.tsx` | `GET /admin/users` | All users with search, role and status filter |
| `/dashboard/admin/users` | `dashboard/admin/admin-users.tsx` | `PATCH /admin/users/:id` | Ban or unban a user |
| `/dashboard/admin/properties` | `dashboard/admin/admin-properties.tsx` | `GET /admin/properties` | All properties |
| `/dashboard/admin/properties` | `dashboard/admin/admin-properties.tsx` | `DELETE /admin/properties/:id` | Remove a listing |
| `/dashboard/admin/rentals` | `dashboard/admin/admin-rentals.tsx` | `GET /admin/rentals` | All rental requests |
| `/dashboard/admin/categories` | `dashboard/admin/admin-categories.tsx` | `GET /categories` | Category list |
| `/dashboard/admin/categories` | `dashboard/admin/admin-categories.tsx` | `POST /admin/categories` | Create a category |
| `/dashboard/admin/categories` | `dashboard/admin/admin-categories.tsx` | `PATCH /admin/categories/:id` | Rename a category |
| `/dashboard/admin/categories` | `dashboard/admin/admin-categories.tsx` | `DELETE /admin/categories/:id` | Delete a category |

## Stripe payment flow

```text
Tenant clicks "Pay with Stripe"
        |
        v
POST /payments/checkout  { rentalRequestId, clientUrl }
        |
        v
Backend creates a Stripe Checkout session and returns checkoutUrl
        |
        v
Browser goes to the Stripe page
        |
        +--> paid   --> /payment/success?session_id=cs_...
        |                    |
        |                    v
        |               POST /payments/confirm  { transactionId: session_id }
        |                    |
        |                    v
        |               Payment is COMPLETED, rental is ACTIVE
        |
        +--> left   --> /payment/cancel?rentalRequestId=...
                             |
                             v
                        Rental stays APPROVED, tenant can pay again
```

The backend also has a Stripe webhook (`POST /payments/webhook`). So the payment is saved even if the tenant closes the browser before the success page opens.

## Route protection

Next.js 16 calls Middleware "Proxy". The file is [src/proxy.ts](./src/proxy.ts) and it works like `middleware.ts`.

| Route | Who can open it |
| --- | --- |
| `/dashboard/tenant/*` | Tenant |
| `/dashboard/landlord/*` | Landlord |
| `/dashboard/admin/*` | Admin |
| `/dashboard/profile` | Any logged in user |
| `/payment/*` | Tenant |
| `/auth/*` | Visitors only. A logged in user goes to the own dashboard |

The backend checks the role again on every request, so the proxy is only for the UI. A user cannot do anything by changing the URL.

## Error handling

The backend sends errors in this shape.

```json
{
  "success": false,
  "message": "Validation failed",
  "errorDetails": [{ "field": "email", "message": "A valid email is required" }]
}
```

`errorDetails` is a list for the validation errors and a simple text for the other errors.

| Case | What the user sees |
| --- | --- |
| `400` validation error with `errorDetails` | The message under the right form field |
| `401` (token is expired or not valid) | The cookie is removed and the user goes to the login page with a "Your session has expired" note. After the login the user comes back to the same page |
| `403`, `404`, `409` | A toast with the message from the backend |
| `500` | A toast with a simple message |
| No internet or backend is down | A toast that says the server cannot be reached, and an error box with a retry button on the list |
| Error while rendering a page | The `error.tsx` page with a "Try again" button |
| Unknown URL | The custom 404 page |

Failed queries show a toast from one place, the `QueryCache` in [src/components/providers/query-provider.tsx](./src/components/providers/query-provider.tsx). The same file handles the `401` case for the queries and the mutations. Failed mutations use `showErrorToast` from [src/lib/api.ts](./src/lib/api.ts).
