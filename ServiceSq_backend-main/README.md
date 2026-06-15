# LocalConnect Backend

Production-ready Node.js, Express, MongoDB, and Mongoose backend APIs for LocalConnect, a hyperlocal marketplace connecting customers with nearby verified providers.

## Folder Structure

```text
.
|-- app.js
|-- server.js
|-- package.json
|-- .env.example
|-- config/
|   `-- db.js
|-- controllers/
|   |-- authController.js
|   |-- bookingController.js
|   |-- providerController.js
|   `-- reviewController.js
|-- middleware/
|   |-- auth.js
|   |-- errorHandler.js
|   |-- rateLimiter.js
|   |-- role.js
|   `-- validate.js
|-- models/
|   |-- Booking.js
|   |-- Otp.js
|   |-- ProviderProfile.js
|   |-- Review.js
|   `-- User.js
|-- routes/
|   |-- authRoutes.js
|   |-- bookingRoutes.js
|   |-- providerRoutes.js
|   `-- reviewRoutes.js
|-- services/
|   |-- bookingService.js
|   |-- otpService.js
|   |-- providerRatingService.js
|   `-- smsService.js
|-- utils/
|   |-- AppError.js
|   |-- apiResponse.js
|   |-- asyncHandler.js
|   |-- generateToken.js
|   |-- location.js
|   `-- normalizePhone.js
`-- validators/
    |-- authValidators.js
    |-- bookingValidators.js
    |-- providerValidators.js
    `-- reviewValidators.js
```

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Set `MONGO_URI` and replace `JWT_SECRET` with a long random value before using this outside local development.

All routes are available under both `/api/*` and `/api/v1/*`.

Create an admin account for category and moderation APIs:

```bash
npm run seed:admin
```

## Swagger API Documentation

Interactive API documentation is available at:

```text
http://localhost:5000/api-docs
```

The raw OpenAPI JSON is available at:

```text
http://localhost:5000/api-docs.json
```

Swagger UI supports JWT testing directly from the browser. Click **Authorize**, paste the token returned from `/api/auth/verify-otp` or `/api/auth/register`, and run protected endpoints without Postman.

## API Response Format

Success:

```json
{
  "success": true,
  "message": "Operation completed.",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": []
}
```

Protected routes require:

```http
Authorization: Bearer <jwt-token>
```

## MongoDB Schema Relationships

- `User` is the base account record. Each account has one role: `customer` or `provider`.
- `ProviderProfile.userId` references `User` and is unique, so one provider user has one provider profile.
- `Booking.customerId` references the customer `User`.
- `Booking.providerId` references the provider's `ProviderProfile`.
- `Review.bookingId` references `Booking` and is unique, which enforces one review per completed booking.
- `Review.customerId` references the reviewing customer `User`.
- `Review.providerId` references the reviewed `ProviderProfile`.

## Auth and OTP APIs

### POST `/api/auth/send-otp`

```json
{
  "phone": "+919876543210"
}
```

Development response includes `devOtp` for Postman testing. Production never returns or logs OTP when `NODE_ENV=production`.

### POST `/api/auth/verify-otp`

```json
{
  "phone": "+919876543210",
  "otp": "123456"
}
```

Example response:

```json
{
  "success": true,
  "message": "OTP verified successfully.",
  "data": {
    "token": "<jwt>",
    "requiresRegistration": true,
    "user": {
      "_id": "665a00000000000000000001",
      "phone": "+919876543210",
      "role": "customer",
      "isVerified": true
    }
  }
}
```

### POST `/api/auth/register`

Requires the token from OTP verification.

```json
{
  "name": "Amit Sharma",
  "role": "provider",
  "email": "amit@example.com",
  "avatar": "https://example.com/avatar.jpg"
}
```

### GET `/api/auth/profile`

Returns the authenticated user and the provider profile when the user role is `provider`.

## Provider APIs

### POST `/api/providers/create-profile`

Provider-only route.

```json
{
  "category": "electrician",
  "skills": ["wiring", "fan repair", "switchboard"],
  "hourlyRate": 500,
  "experience": 6,
  "availabilityStatus": "available",
  "address": "Indiranagar, Bengaluru",
  "latitude": 12.9719,
  "longitude": 77.6412
}
```

GeoJSON input is also accepted:

```json
{
  "category": "plumber",
  "skills": ["pipe repair"],
  "hourlyRate": 450,
  "experience": 4,
  "address": "Koramangala, Bengaluru",
  "location": {
    "type": "Point",
    "coordinates": [77.6245, 12.9352]
  }
}
```

### GET `/api/providers/nearby`

Example:

```http
GET /api/providers/nearby?latitude=12.9719&longitude=77.6412&radius=10&category=electrician&minRating=4&maxPrice=800&page=1&limit=10&sort=distance
```

Supported query parameters:

- `latitude`, `longitude`: user location.
- `radius`: distance in kilometers, default `10`.
- `category`: provider category filter.
- `minRating`: minimum average rating.
- `maxPrice`: maximum hourly rate.
- `availabilityStatus`: defaults to `available`.
- `page`, `limit`: pagination.
- `sort`: `distance`, `rating`, or `price`.

### GET `/api/providers/:id`

Fetches a single provider profile.

### PUT `/api/providers/update-profile`

Provider-only route. Send any fields from create-profile to update them.

```json
{
  "availabilityStatus": "busy",
  "hourlyRate": 650
}
```

## Geospatial Query Explanation

`ProviderProfile.location` is stored as GeoJSON:

```json
{
  "type": "Point",
  "coordinates": [77.6412, 12.9719]
}
```

MongoDB requires coordinates in `[longitude, latitude]` order. The model defines a `2dsphere` index so `/api/providers/nearby` can run `$geoNear`, calculate `distanceMeters`, filter by radius, and sort by distance, rating, or price. `radius` is accepted in kilometers and converted to meters before querying MongoDB.

## Booking APIs

### POST `/api/bookings/create`

Customer-only route.

```json
{
  "providerId": "665a00000000000000000010",
  "serviceType": "electrician",
  "bookingDate": "2026-05-12T09:00:00.000Z",
  "scheduledStart": "2026-05-12T09:00:00.000Z",
  "scheduledEnd": "2026-05-12T11:00:00.000Z",
  "address": "221B MG Road, Bengaluru",
  "amount": 1000
}
```

The backend rejects overlapping `pending` or `accepted` bookings for the same provider.

### GET `/api/bookings/my-bookings`

Optional query:

```http
GET /api/bookings/my-bookings?status=pending&page=1&limit=10
```

Customers see their bookings. Providers see bookings for their provider profile.

### PUT `/api/bookings/:id/status`

Provider accepts, rejects, or completes:

```json
{
  "status": "accepted"
}
```

Customer cancels:

```json
{
  "status": "cancelled"
}
```

Allowed transitions:

- `pending -> accepted`
- `pending -> rejected`
- `pending -> cancelled`
- `accepted -> completed`
- `accepted -> cancelled`

### GET `/api/bookings/:id`

Customers and the assigned provider can fetch booking details.

## Review APIs

### POST `/api/reviews/add`

Customer-only route. Booking must be completed.

```json
{
  "bookingId": "665a00000000000000000020",
  "rating": 5,
  "comment": "Arrived on time and fixed the issue cleanly."
}
```

The backend prevents duplicate reviews by using a unique `bookingId` index. After each review, the provider's average rating and review count are recalculated.

### GET `/api/reviews/provider/:providerId`

```http
GET /api/reviews/provider/665a00000000000000000010?page=1&limit=10
```

## APIs 5-12

### Availability

Provider-only mutations:

```http
PUT /api/availability/toggle
PUT /api/availability/working-hours
```

Example toggle:

```json
{
  "isOnline": true,
  "isAvailable": true
}
```

Public reads:

```http
GET /api/availability/provider/:id
GET /api/availability/online-providers?category=electrician&page=1&limit=10
```

Nearby/search APIs hide providers unless they are approved, online, and available.

### Categories

Admin-only mutations:

```http
POST /api/categories/create
PUT /api/categories/:id
DELETE /api/categories/:id
```

Public list:

```http
GET /api/categories?popular=true&page=1&limit=10
```

Example category:

```json
{
  "name": "Electrician",
  "icon": "zap",
  "description": "Electrical repair and installation services.",
  "isActive": true
}
```

Categories are soft-deleted and use generated slugs.

### Notifications

```http
GET /api/notifications?isRead=false&page=1&limit=10
PUT /api/notifications/:id/read
DELETE /api/notifications/:id
```

Notifications are created for booking lifecycle events and successful payments.

### Payments

Customer payment flow:

```http
POST /api/payments/create-payment-intent
POST /api/payments/verify
GET /api/payments/history
```

Provider earnings:

```http
GET /api/payments/provider-earnings
```

The default payment adapter is mock. In development, verify with the returned `clientSecret`; in production, configure `PAYMENT_WEBHOOK_SECRET` and send the verification signature.

### Admin

Admin-only routes:

```http
GET /api/admin/dashboard
GET /api/admin/users
GET /api/admin/providers
PUT /api/admin/provider/:id/verify
DELETE /api/admin/user/:id
```

Provider verification accepts:

```json
{
  "status": "approved"
}
```

### Chat and Support

Booking-based chat:

```http
POST /api/chat/send
GET /api/chat/:bookingId?page=1&limit=20
```

Support tickets:

```http
POST /api/support/create-ticket
GET /api/support/my-tickets
```

### Search and Recommendations

```http
GET /api/search/providers?q=fan%20repair&latitude=12.9719&longitude=77.6412&radius=10
GET /api/search/trending?page=1&limit=10
GET /api/search/recommended
```

Search combines full-text provider indexes, GeoJSON distance filtering, rating, price, category, and live availability.

### Uploads

Multipart form-data field name: `file`.

```http
POST /api/upload/profile-image
POST /api/upload/documents
GET /api/upload/:id
```

Allowed files: `jpg`, `png`, `pdf`. Profile images are compressed with Sharp and stored locally under `uploads/`. Documents require owner or admin access.

## Expansion APIs

All new routes are available under both `/api/*` and `/api/v1/*`.

### Address Management

```http
POST /api/address/add
GET /api/address
PUT /api/address/:id
DELETE /api/address/:id
```

Example:

```json
{
  "fullName": "Amit Sharma",
  "phone": "+919876543210",
  "houseNo": "221B",
  "street": "MG Road",
  "city": "Bengaluru",
  "state": "Karnataka",
  "pincode": "560001",
  "landmark": "Near Metro Station",
  "isDefault": true
}
```

Only one address per user can be default. The first saved address is made default automatically.

### Invoices and Billing

```http
GET /api/invoices/:bookingId
GET /api/invoices/user/history
```

Invoices are generated lazily for completed bookings only. Customers, assigned providers, and admins can access the invoice. Totals are PDF-ready with base amount, taxes, platform fee, line items, snapshots, and invoice number.

### Analytics Dashboard

Admin-only:

```http
GET /api/analytics/revenue?year=2026
GET /api/analytics/bookings?year=2026
GET /api/analytics/providers?limit=10
GET /api/analytics/users?year=2026
```

Analytics use MongoDB aggregation for monthly revenue, booking trends, active users, provider stats, total provider earnings, platform earnings, and top providers.

### Provider Portfolio

Multipart form-data field name: `images`.

```http
POST /api/portfolio/add
GET /api/portfolio/:providerId
DELETE /api/portfolio/:id
```

Portfolio uploads accept `jpg` and `png`, store local upload records, and return URLs shaped for a later Cloudinary adapter.

### Subscriptions

```http
GET /api/subscription/plans
POST /api/subscription/upgrade
GET /api/subscription/status
```

Example upgrade:

```json
{
  "planName": "premium_monthly",
  "paymentMethod": "mock"
}
```

The mock-ready upgrade marks the subscription paid, calculates expiry, and updates `ProviderProfile.isPremium` plus `premiumUntil` for badge support.

### Reports and Moderation

```http
POST /api/report/user
POST /api/report/provider
GET /api/report/all
PUT /api/report/:id/action
```

Example user report:

```json
{
  "targetUser": "665a00000000000000000002",
  "reason": "abusive_behavior",
  "description": "Used abusive language in chat."
}
```

Open duplicate reports by the same reporter for the same target are blocked. Admin listing supports pagination and status filters.

### Verification / KYC

Multipart form-data field names: `document` or `file`.

```http
POST /api/verification/upload
GET /api/verification/status
PUT /api/admin/verification/:id
```

Allowed files: `jpg`, `png`, `pdf`. Uploaded KYC documents are owner/admin protected through `/api/upload/:id`. Admin approval or rejection syncs both `Verification` and `ProviderProfile.verificationStatus`.

### Live Location

```http
PUT /api/location/update
GET /api/location/provider/:id?latitude=12.9719&longitude=77.6412
```

Example update:

```json
{
  "latitude": 12.9719,
  "longitude": 77.6412
}
```

Live locations are stored as GeoJSON `[longitude, latitude]` with a `2dsphere` index. Fetching with requester coordinates returns `distanceKm`.

### Search History

```http
GET /api/search/history
DELETE /api/search/history
```

Authenticated calls to `/api/search/providers?q=fan repair` automatically save recent searches. History is latest-first and trims older entries beyond `SEARCH_HISTORY_LIMIT` (default `20`).

## Sample MongoDB Documents

```json
{
  "Address": {
    "userId": "665a00000000000000000001",
    "fullName": "Amit Sharma",
    "phone": "+919876543210",
    "houseNo": "221B",
    "street": "MG Road",
    "city": "Bengaluru",
    "state": "Karnataka",
    "pincode": "560001",
    "isDefault": true
  },
  "Invoice": {
    "bookingId": "665a00000000000000000020",
    "customerId": "665a00000000000000000001",
    "providerId": "665a00000000000000000010",
    "amount": 1000,
    "taxes": 0,
    "platformFee": 0,
    "totalAmount": 1000,
    "paymentStatus": "paid",
    "invoiceNumber": "LC-INV-20260512-A1B2C3"
  },
  "LiveLocation": {
    "providerId": "665a00000000000000000010",
    "location": {
      "type": "Point",
      "coordinates": [77.6412, 12.9719]
    },
    "updatedAt": "2026-05-12T10:00:00.000Z"
  }
}
```

## API Testing Examples

```bash
curl -H "Authorization: Bearer <jwt>" http://localhost:5000/api/address
curl -H "Authorization: Bearer <admin-jwt>" http://localhost:5000/api/analytics/revenue?year=2026
curl -X POST -H "Authorization: Bearer <provider-jwt>" -H "Content-Type: application/json" \
  -d '{"planName":"premium_monthly","paymentMethod":"mock"}' \
  http://localhost:5000/api/subscription/upgrade
```

## Docker

```bash
docker compose up --build
```

The compose setup runs the API and MongoDB, with local uploads mounted into the container.

## Tests and Checks

```bash
npm run check
npm test
```

## Security Best Practices Included

- JWT-based authentication with role middleware.
- Refresh-token rotation and logout revocation.
- Admin-only category and moderation APIs.
- OTPs are bcrypt-hashed and expire automatically using a MongoDB TTL index.
- OTP request rate limiting and max verification attempts.
- Centralized error handling with consistent response shape.
- Helmet security headers and configurable CORS.
- Input validation using `express-validator`.
- Multer file validation for `jpg`, `png`, and `pdf`.
- Audit logging for sensitive admin, payment, upload, category, and booking changes.
- No provider phone or email exposure in public nearby search results.
- Production mode rejects console OTP delivery unless a real SMS provider is configured.
- KYC documents are protected so only the owner provider or admin can download them.
- Default-address uniqueness is enforced with a partial MongoDB unique index.
- Live provider location uses GeoJSON validation and authenticated access.
- Report moderation endpoints are admin-only and audit logged.


