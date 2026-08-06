# Nexora AI API Documentation

## Authentication
- POST /auth/register
- POST /auth/login
- POST /auth/verify-otp
- POST /auth/refresh
- POST /auth/forgot-password
- POST /auth/reset-password

## Users
- GET /users/me
- PATCH /users/me
- POST /users/addresses
- GET /users/wallet
- GET /users/notifications

## Products
- GET /products
- GET /products/:id
- POST /products
- PATCH /products/:id
- DELETE /products/:id

## Orders
- POST /orders
- GET /orders
- GET /orders/:id
- PATCH /orders/:id/status

## Delivery
- POST /delivery/location
- POST /delivery/accept
- PATCH /delivery/:id/status
- GET /delivery/my-deliveries

## Services
- GET /services
- POST /services
- POST /services/appointments
- PATCH /services/availability

## Payments
- POST /payments/transaction
- POST /payments/wallet/topup
- POST /payments/wallet/payout

## Admin
- GET /admin/dashboard
- GET /admin/vendors/pending
- PATCH /admin/vendors/:id/status
- POST /admin/coupons
- GET /admin/support-tickets

## AI
- GET /ai/recommendations
- GET /ai/search
- POST /ai/sentiment
- GET /ai/forecast/:productId
