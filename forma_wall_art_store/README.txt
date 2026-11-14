FORMA WALL & LIVING — SUPABASE STORE

This is a refreshed storefront for wall posters, photo frames and wall art.

FILES
- index.html: customer storefront
- admin.html: admin login and product manager
- styles.css: responsive editorial-style design
- config.js: Supabase Project URL and Publishable key
- store.js: product display, category filters, search and local cart
- admin.js: admin authentication, product add/edit/delete and image upload
- add-category-column.sql: one-time database migration for product categories

IMPORTANT FIRST STEP
In Supabase > SQL Editor, run the contents of add-category-column.sql once.
This adds a category column to your existing products table without deleting existing products.
Your existing products will default to "Wall Posters". You can edit their category in Admin.

The existing setup is expected to contain:
- public.products with id, name, description, price, image_url, is_active, created_at
- public.admins with user_id
- Storage bucket product-images
- RLS policies granting product management and image upload only to admins

RUN THE WEBSITE
1. Extract this ZIP.
2. Open the folder in VS Code.
3. Start the Live Server extension on index.html.
4. Open admin.html to sign in with your Supabase Auth email/password.

SECURITY
The browser config uses a Supabase Publishable key. Never use a Secret key or service_role key in frontend code. Keep RLS enabled.

CURRENT FEATURES
- Product catalogue, category filters and search
- Admin login and product management
- Product image upload to Supabase Storage
- Browser-local shopping bag

NOT YET INCLUDED
Real checkout, online payment gateway, customer accounts, order management, shipping/tax calculations and inventory reservation are not included yet.
