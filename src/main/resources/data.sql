-- Assuming a table structure:
-- (id, user_role, email, password_hash, first_name, last_name, phone_number)

INSERT INTO app_user (user_role, email, password_hash, first_name, last_name, phone_number) VALUES
    ('CUSTOMER', 'alice.c@example.com', '$2a$10$abc123...', 'Alice', 'Customer', '555-1001');

INSERT INTO app_user (user_role, email, password_hash, first_name, last_name, phone_number) VALUES
    ('RESTAURANT', 'bob.r@example.com', '$2a$10$def456...', 'Bob', 'Resto', '555-2002');

INSERT INTO app_user (user_role, email, password_hash, first_name, last_name, phone_number) VALUES
    ('ADMIN', 'admin@yueats.com', '$2a$10$ghi789...', 'System', 'Administrator', NULL);