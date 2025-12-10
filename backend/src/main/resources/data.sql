-- Assuming a table structure:
-- (id, user_role, email, password_hash, first_name, last_name, phone_number)

-- 1. Alice (Customer) - ID: 1
INSERT INTO app_user (user_role, email, password_hash, first_name, last_name, phone_number, is_verified)
VALUES ('CUSTOMER', 'alice@test.com', '$2a$10$Un6jG.iG.YV.x/P.x/P.x/P.x/P.x/P.x/P.x/P.x/P.x/P.', 'Alice', 'Wonderland', '555-0100', TRUE);

-- 2. Bob (Vendor) - ID: 2
INSERT INTO app_user (user_role, email, password_hash, first_name, last_name, phone_number, business_name, is_verified)
VALUES ('VENDOR', 'bob@test.com', '$2a$10$Un6jG.iG.YV.x/P.x/P.x/P.x/P.x/P.x/P.x/P.x/P.x/P.', 'Bob', 'Builder', '555-0200', 'Bobs Foods Inc', TRUE);

-- 3. Admin - ID: 3
INSERT INTO app_user (user_role, email, password_hash, first_name, last_name, is_verified)
VALUES ('ADMIN', 'admin@yueats.com', '$2a$10$Un6jG.iG.YV.x/P.x/P.x/P.x/P.x/P.x/P.x/P.x/P.x/P.', 'System', 'Admin', TRUE);

-- Restaurant 1: Bob's Burgers - ID: 1
INSERT INTO restaurants (owner_id, restaurant_name, address)
VALUES (2, 'Bob''s Burgers', '123 Ocean Avenue');

-- Restaurant 2: Pasta Palace - ID: 2
INSERT INTO restaurants (owner_id, restaurant_name, address)
VALUES (2, 'Pasta Palace', '456 Little Italy St');

-- Items for Bob's Burgers (Restaurant ID: 1)
INSERT INTO menu_items (restaurant_id, item_name, description, price) VALUES
(1, 'Classic Cheeseburger', 'Beef patty with cheddar cheese', 9.99), -- ID: 1
(1, 'Bacon Deluxe', 'Double patty with crispy bacon', 12.50),        -- ID: 2
(1, 'Fries', 'Crispy golden potato fries', 4.50),                      -- ID: 3
(1, 'Vanilla Shake', 'Classic milkshake with real vanilla', 5.00);     -- ID: 4

-- Items for Pasta Palace (Restaurant ID: 2)
INSERT INTO menu_items (restaurant_id, item_name, description, price) VALUES
(2, 'Spaghetti Carbonara', 'Creamy sauce with pancetta', 15.00),       -- ID: 5
(2, 'Garlic Bread', 'Toasted bread with garlic butter', 3.99);         -- ID: 6


-- The Order Header
INSERT INTO orders (user_id, restaurant_id, order_date, status, total_price, delivery_address)
VALUES (1, 1, CURRENT_TIMESTAMP, 'PENDING', 14.49, 'Alice Home Address, Apt 4B'); -- Order ID: 1

-- The Order Details (Items)
-- 1x Cheeseburger ($9.99)
INSERT INTO order_details (order_id, menu_item_id, quantity, price, price_at_purchase)
VALUES (1, 1, 1, 9.99, 9.99);

-- 1x Fries ($4.50)
INSERT INTO order_details (order_id, menu_item_id, quantity, price, price_at_purchase)
VALUES (1, 3, 1, 4.50, 4.50);