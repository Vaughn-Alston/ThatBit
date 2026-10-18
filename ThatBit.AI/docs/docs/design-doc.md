Bakery Management Platform
Design Document
Author: Vaughn
Status: Draft
Last Updated: [Date]
Repository: [GitHub repository URL]
Current Stack: React, Vite, JavaScript
Planned Backend: Supabase
Potential Payments: Stripe

1. Overview
1.1 Project Summary
The Bakery Management Platform is a customer-facing bakery website combined with an owner management system.
Customers will be able to browse bakery products, view upcoming drops, join an early-access list, create accounts, place orders, earn rewards, and leave reviews after completing eligible orders.
The bakery owner will eventually have a protected administrative dashboard that allows them to manage the storefront without editing source code.
The owner should be able to:
Add products
Edit products
Delete products
Upload product images
Change prices
Mark products as available or sold out
Reorder products
Create bakery drops
Enable or disable early-access mode
View customer orders
Manage Customers accounts so lockouts
View customers email
Send drop announcements
Manage promotions and loyalty rewards
The initial version of the application will focus on building the customer-facing frontend before introducing the backend.

2. Problem
A small bakery owner should not need to contact a developer every time they want to:
Add a new pastry
Replace a product photo
Change a price
Mark something sold out
Announce a drop
Open or close access to the storefront
The application should give the owner control over these operations through an easy-to-use interface.
At the same time, customers should have a visually appealing and straightforward way to discover products and upcoming bakery drops.

3. Goals
MVP Goals
The first version should support:
Responsive bakery homepage
Navigation to major sections
Hero section
Product catalog
Reusable product cards
Product data stored separately from the UI
Dynamic rendering using React
Reviews section
Early-access promotional section
About section
Contact section
Mobile-friendly layout
Backend Goals
Later versions should support:
Supabase database
Owner authentication
Customer authentication
Product CRUD operations
Image uploads
Persistent storefront changes
Store settings
Customer profiles
Order tracking
Verified customer reviews
Loyalty points
Drop notifications
Stretch Goals
Stripe checkout
Rewards redemption
Promotional discounts
Automated email campaigns
Inventory tracking
Product scheduling
Drag-and-drop product ordering
Analytics dashboard
External review integrations

4. Non-Goals for the First Version
The first frontend version will NOT initially include:
Real payments
Real authentication
Production database
Email delivery
Yelp API integration
Loyalty calculations
Production order management
These will be added after the frontend architecture is stable.

5. Users
Customer
A customer should be able to:
Visit the bakery website.
Browse products.
View product images, descriptions, prices, and availability.
Learn about the bakery.
Join an early-access or drop notification list.
Eventually create an account.
Eventually place an order.
Eventually earn points.
View placed orders or at least a number of placed orders
Eventually submit a review after a completed order.

Bakery Owner / Administrator
The bakery owner should eventually be able to:
Log into a protected admin area.
Add a product.
Upload a product image.
Add a description.
Set a price.
Change product availability.
Delete a product.
Reorder products.
Control early-access mode.
Create bakery drops.
View orders.
Contact subscribers.

6. User Experience
Public Navigation
The initial navigation should include:
Home
Menu
Drops
About
Reviews
Contact
Potential later additions:
Account
Cart
Rewards

7. Homepage Structure
The homepage should roughly follow this structure:
Header
Bakery logo and bakery name centered or prominently displayed.
Navigation should appear beneath or alongside the branding.
Hero
Large centered bakery image.
Possible overlay:
Bakery slogan
Upcoming drop
Call-to-action
Example:
Freshly baked. Limited drops.
View This Week's Drop
Catalog
Products displayed dynamically in reusable cards.
Each card should contain:
Image
Product name
Description
Price
Availability
Optional badge
Example:
Strawberry Cake
Fresh strawberries, vanilla sponge, and cream.
$42
Available
Early Access
Customers can join the bakery mailing list for:
Early access
Upcoming drops
Limited items
Promotions
Reviews
Reviews should be displayed horizontally as reusable cards.
Each review can contain:
Profile image
Customer name
1–5 star rating
Review
Date
About
Information about the bakery and baker.
Contact
Contact information and social links.

8. Visual Design
Typography
Primary font:
DM Sans
Fallback:
Arial, sans-serif
Color Direction
The website will primarily use variations of blue with black typography and neutral white/light backgrounds.
Potential palette:
Primary Blue
#155EEF
Royal Blue
#4169E1
Deep Blue
#0057B8
Sky Blue
#7EC8E3
Ice Blue
#D9EEFF
Dark Text
#111111
Background
#FAFAF7
Blue should be used strategically rather than covering every element.
Examples:
Buttons
Section titles
Links
Product badges
Navigation highlights
Borders
Promotional elements

9. Frontend Architecture
The frontend uses:
Vite
React
JavaScript
CSS
Initial project structure:
src/
├── assets/
│
├── components/
│   ├── Header.jsx
│   ├── Hero.jsx
│   ├── ProductCard.jsx
│   ├── ProductCatalog.jsx
│   ├── ReviewCard.jsx
│   ├── Reviews.jsx
│   └── Footer.jsx
│
├── data/
│   ├── products.js
│   └── reviews.js
│
├── App.jsx
├── App.css
└── main.jsx

Initially product information can live in:
src/data/products.js

Later, the data source will change from a local array to Supabase.

10. Product Rendering
The UI should NOT contain a fixed number of empty product boxes.
Instead:
Product Data
     ↓
products.map()
     ↓
ProductCard
ProductCard
ProductCard
ProductCard

React determines how many cards should exist based on the data.
Example product:
{
  id: 1,
  name: 'Blueberry Croissant',
  description: 'Butter croissant filled with blueberries.',
  price: 7.50,
  image: '/images/croissant.jpg',
  category: 'Pastries',
  available: true,
  featured: false,
  sortOrder: 1
}

If a product is added to the array, another card appears.
If a product is deleted, its card disappears.

11. Product Management
During frontend development, React state can temporarily manage products.
Future production flow:
Owner
  ↓
Admin Dashboard
  ↓
Create / Edit Product
  ↓
Supabase
  ↓
products table
  ↓
Customer Storefront

This allows storefront changes to persist and become visible to every visitor.

12. Backend Architecture
Planned backend:
Supabase
Supabase will provide:
PostgreSQL database
Authentication
File storage
Database permissions
API access
Architecture:
                    React
                       │
          ┌────────────┴────────────┐
          │                         │
       Customer                  Admin
          │                         │
          └────────────┬────────────┘
                       │
                    Supabase
          ┌────────────┼─────────────┐
          │            │             │
       Database       Auth         Storage
          │            │             │
       Products      Users         Images
       Orders        Admins
       Reviews
       Settings


13. Database Design
products
id
name
description
price
image_url
category
available
featured
sort_order
created_at
updated_at

profiles
id
first_name
last_name
email
points
created_at

orders
id
user_id
status
subtotal
total
created_at

order_items
id
order_id
product_id
product_name
quantity
unit_price

reviews
id
user_id
order_id
rating
comment
approved
created_at

store_settings
id
early_access_enabled
orders_enabled
announcement
drop_date

subscribers
id
email
early_access
created_at


14. Authentication
Supabase Auth will eventually manage accounts.
Two primary roles:
Customer
Can:
View products
Place orders
View own orders
Update own profile
Submit eligible reviews
Cannot:
Modify products
Change store settings
View other customers' orders
Owner
Can:
Create products
Update products
Delete products
Upload images
Manage drops
Manage store settings
View orders
Manage promotions

15. Security
Security must be enforced by the backend.
Hiding an admin button in React is NOT sufficient security.
Supabase Row Level Security will determine which database operations each user may perform.
Example:
                Customer     Owner

Read Products       ✓           ✓
Create Product      ✗           ✓
Edit Product        ✗           ✓
Delete Product      ✗           ✓
View Own Orders     ✓           ✓
View All Orders     ✗           ✓


16. Image Storage
Images uploaded by the owner will eventually be stored using Supabase Storage.
Flow:
Owner chooses image
       ↓
Supabase Storage
       ↓
Image URL
       ↓
products.image_url
       ↓
ProductCard

Images should not be stored directly inside database rows.

17. Early Access Mode
The owner should eventually control whether customers immediately see the storefront.
Example database setting:
early_access_enabled = true

When enabled:
COMING SOON

Join for early access.

[email input]

[JOIN THE LIST]

When disabled:
Normal bakery storefront

The owner can modify this setting from the admin dashboard.

18. Reviews
Initial frontend reviews can use mock data.
Later, verified reviews should be connected to orders.
Potential requirement:
User
  ↓
Has completed order?
  ↓
YES
  ↓
Review form enabled

Review data:
rating: 1–5
comment
user
order
date


19. Loyalty System
New customer:
Points: 0

Completed purchases can generate points.
Potential future structure:
point_transactions
├── id
├── user_id
├── points
├── reason
├── order_id
└── created_at

Example:
+50   Order #21
+30   Order #25
-50   Reward redeemed


20. Payments
Stripe is considered a stretch goal.
Potential flow:
Customer Cart
     ↓
Checkout
     ↓
Backend
     ↓
Stripe
     ↓
Payment confirmation
     ↓
Order created / updated

Sensitive card information should never be stored directly by this application.

21. Development Phases
Phase 1 — Static Frontend
- Header
- Navigation
- Hero
- Product cards
- Reviews
- About
- Contact
- Responsive CSS
Phase 2 — React Data
- Product array
- .map()
- ProductCard component
- Add product
- Delete product
- Edit product
- React state
Phase 3 — Supabase
- Create Supabase project
- Connect React
- Create products table
- Fetch products
- Replace local array
Phase 4 — Admin
- Owner authentication
- Protected admin dashboard
- Product CRUD
- Image uploading
- Store settings
Phase 5 — Customers
- Customer authentication
- Profiles
- Orders
- Order history
Phase 6 — Engagement
- Reviews
- Loyalty points
- Subscriber list
- Drop emails
Phase 7 — Commerce
- Shopping cart
- Stripe
- Payment confirmation
- Inventory handling

22. MVP Success Criteria
The MVP is successful when:
The bakery has a professional responsive website.
Products are dynamically generated from data.
The owner can eventually manage products without touching source code.
Owner changes persist for all visitors.
Images can be uploaded through the admin interface.
Early-access mode can be controlled by the owner.
Customers can browse products easily.

23. Open Questions
What is the bakery's official name?
What logo will be used?
Will products have limited quantities?
Will drops have scheduled opening times?
Will customers need accounts before checkout?
Should guest checkout be supported?
Should products disappear or show "Sold Out"?
How should pickup dates work?
Will delivery be supported?
How will loyalty points be calculated?
What rewards can points purchase?
Should reviews require owner approval?
Should early-access customers receive a password/link?
Should the owner be able to schedule products ahead of time?

24. Current Focus
The current development priority is:
Build the customer-facing frontend using React and local mock data.
Do not introduce backend complexity until the reusable catalog architecture and visual design are working correctly.
Next technical milestone:
Local products array
        ↓
ProductCard component
        ↓
products.map()
        ↓
Responsive catalog