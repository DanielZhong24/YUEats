DROP TABLE IF EXISTS order_details CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS app_user CASCADE;
CREATE TABLE IF NOT EXISTS app_user (
    id IDENTITY PRIMARY KEY,
    user_role VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone_number VARCHAR(255),
    business_name VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE

);

CREATE TABLE IF NOT EXISTS restaurants (
    id IDENTITY PRIMARY KEY,
    owner_id INTEGER NOT NULL,
    restaurant_name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES app_user(id)
);

CREATE TABLE IF NOT EXISTS menu_items (
    id IDENTITY PRIMARY KEY,
    restaurant_id INTEGER,
    item_name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

CREATE TABLE IF NOT EXISTS orders (
    id IDENTITY PRIMARY KEY,
    user_id INTEGER,
    restaurant_id INTEGER,
    driver_id INTEGER,
    order_date TIMESTAMP,
    last_updated TIMESTAMP,
    status VARCHAR(255),
    total_price DECIMAL(10,2),
    delivery_address VARCHAR(255),
    pickup_code VARCHAR(10),
    FOREIGN KEY (user_id) REFERENCES app_user(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    FOREIGN KEY (driver_id) REFERENCES app_user(id)
);

CREATE TABLE IF NOT EXISTS order_details (
    id IDENTITY PRIMARY KEY,
    order_id INTEGER,
    menu_item_id INTEGER,
    quantity INTEGER,
    price DOUBLE,
    price_at_purchase DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);