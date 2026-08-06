-- Nexora AI Database Seed Data

INSERT INTO "users" (id, email, phone, password, "firstName", "lastName", role, status, "emailVerified", "phoneVerified")
VALUES 
  ('admin-001', 'admin@nexora.ai', '+911234567890', '$2a$12$hash', 'Super', 'Admin', 'SUPER_ADMIN', 'ACTIVE', true, true),
  ('vendor-001', 'vendor@nexora.ai', '+911234567891', '$2a$12$hash', 'Demo', 'Vendor', 'VENDOR', 'ACTIVE', true, true),
  ('customer-001', 'customer@nexora.ai', '+911234567892', '$2a$12$hash', 'Demo', 'Customer', 'CUSTOMER', 'ACTIVE', true, true);

INSERT INTO "categories" (id, name, slug, description, "isActive", "sortOrder")
VALUES 
  ('cat-001', 'Grocery', 'grocery', 'Fresh groceries and staples', true, 1),
  ('cat-002', 'Restaurants', 'restaurants', 'Food delivery from local restaurants', true, 2),
  ('cat-003', 'Pharmacy', 'pharmacy', 'Medicines and healthcare products', true, 3),
  ('cat-004', 'Electronics', 'electronics', 'Gadgets and electronic items', true, 4),
  ('cat-005', 'Fashion', 'fashion', 'Clothing and accessories', true, 5),
  ('cat-006', 'Home Services', 'home-services', 'Plumbing, electrical, repairs', true, 6);

INSERT INTO "vendor_profiles" (id, "userId", "businessName", "businessType", status, "commissionRate", "subscriptionPlan", "isFeatured")
VALUES 
  ('vp-001', 'vendor-001', 'Green Farms', 'GROCERY', 'APPROVED', 10.00, 'STANDARD', true);

INSERT INTO "stores" (id, "vendorId", name, "addressLine1", city, state, "postalCode", latitude, longitude, "isActive")
VALUES 
  ('store-001', 'vp-001', 'Green Farms Main Store', '123 Farm Road', 'Mumbai', 'Maharashtra', '400001', 19.0760, 72.8777, true);

INSERT INTO "products" (id, "vendorId", "storeId", "categoryId", name, slug, description, sku, "basePrice", quantity, images, status, "isFeatured")
VALUES 
  ('prod-001', 'vp-001', 'store-001', 'cat-001', 'Organic Apples', 'organic-apples-001', 'Fresh organic apples', 'NXR-001', 120.00, 100, '["https://example.com/apple.jpg"]', 'ACTIVE', true),
  ('prod-002', 'vp-001', 'store-001', 'cat-001', 'Whole Wheat Bread', 'whole-wheat-bread-001', 'Fresh baked bread', 'NXR-002', 45.00, 50, '["https://example.com/bread.jpg"]', 'ACTIVE', false);
