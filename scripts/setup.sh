#!/bin/bash
set -e

echo "🚀 Setting up Nexora AI development environment..."

# Start Docker infrastructure
cd docker
docker-compose up -d postgres redis elasticsearch
cd ..

# Setup backend
cd backend
npm install
echo "📦 Backend dependencies installed"

# Wait for postgres
sleep 5

npx prisma migrate dev --name init
echo "🗄️ Database migrated"

npx prisma generate
echo "✅ Prisma client generated"

cd ..

# Setup web apps
for app in web-admin web-vendor web-customer; do
  cd $app
  npm install
  cd ..
  echo "✅ $app dependencies installed"
done

echo ""
echo "🎉 Setup complete! Start development servers:"
echo "  Backend:   cd backend && npm run start:dev"
echo "  Admin:     cd web-admin && npm run dev"
echo "  Vendor:    cd web-vendor && npm run dev"
echo "  Customer:  cd web-customer && npm run dev"
