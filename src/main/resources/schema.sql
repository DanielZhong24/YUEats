CREATE TABLE IF NOT EXISTS app_user (
    id IDENTITY PRIMARY KEY,
    user_role VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone_number VARCHAR(255)

);