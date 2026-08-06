# Nexora AI - Powering Local Commerce with AI

## Complete Multi-Vendor Marketplace Ecosystem

### Architecture
- **Backend**: NestJS (Node.js) with Prisma ORM
- **Database**: PostgreSQL + Redis + Elasticsearch
- **Frontend**: React.js (Admin, Vendor, Customer portals)
- **Mobile**: Flutter (Customer, Vendor, Service, Delivery apps)
- **Infrastructure**: Docker + Kubernetes ready

### Quick Start

```bash
# 1. Start infrastructure
cd docker && docker-compose up -d

# 2. Setup backend
cd backend
npm install
npx prisma migrate dev
npx prisma generate
npm run start:dev

# 3. Web apps
cd web-admin && npm install && npm run dev    # Port 3001
cd web-vendor && npm install && npm run dev    # Port 3002
cd web-customer && npm install && npm run dev  # Port 3003

# 4. Mobile apps
cd mobile-customer && flutter pub get && flutter run
cd mobile-vendor && flutter pub get && flutter run
cd mobile-delivery && flutter pub get && flutter run
cd mobile-service && flutter pub get && flutter run
```

### API Documentation
Available at: http://localhost:3000/api/docs

### Modules
- Authentication (JWT, OAuth, OTP, 2FA)
- User Management
- Vendor Management
- Product Catalog with AI Search
- Order & Delivery Management
- Service Booking
- Payment Gateway Integration
- Wallet System
- AI Recommendations & Analytics
- Notifications (Push, Email, SMS)
- Admin Dashboard
- Franchise System
- Influencer Program
