# YUEats Backend API Documentation

**Base URL:** `http://localhost:8080`

## Overview

YUEats is a food delivery platform with three main user types: Customers, Vendors, and Delivery Drivers (Couriers). The backend uses Spring Security with session-based authentication and CORS configured for `http://localhost:3000`.

---

## Authentication & Security

### Security Configuration

- **Authentication Type:** Session-based (Form Login)
- **Password Encoding:** BCrypt (strength: 12)
- **CORS Origins:** `http://localhost:3000`
- **Session Cookie:** `JSESSIONID`

### Public Endpoints (No Auth Required)

- `POST /customers` - Customer signup
- `POST /vendors` - Vendor signup
- `GET /users` - List all users
- `POST /login` - Login (Spring Security default)
- `POST /logout` - Logout

### Protected Endpoints

- `/vendors/**` - Requires `ROLE_VENDOR`
- `/customers/**` - Requires `ROLE_CUSTOMER`
- `/drivers/**` - Requires `ROLE_COURIER`
- All other endpoints require authentication

### Login/Logout

```http
POST /login
Content-Type: application/x-www-form-urlencoded

username=email@example.com&password=yourPassword
```

**Response:** Sets `JSESSIONID` cookie

```http
POST /logout
```

**Response:** 200 OK, invalidates session, deletes `JSESSIONID` cookie

---

## User Types & Structure

### User Hierarchy

All users inherit from the `User` base class using Single Table Inheritance (discriminator: `user_role`).

```
User (Abstract Base)
├── Customer
├── Vendor (has businessName, owns Restaurants)
├── DeliveryDriver (Courier)
└── Admin
```

### UserRole Enum

```java
enum UserRole {
    CUSTOMER,
    VENDOR,
    ADMIN,
    COURIER
}
```

### User Base Structure

All users have:

- `id` (Integer, auto-generated)
- `email` (String, unique)
- `passwordHash` (String, BCrypt)
- `firstName` (String, max 50 chars)
- `lastName` (String, max 50 chars)
- `phoneNumber` (String, 10 digits)
- `userRole` (UserRole enum)
- `isVerified` (Boolean, default: false)

### Customer

Inherits all User properties. No additional fields.

**Capabilities:**

- Place orders
- View order history (not yet implemented)

### Vendor

Inherits all User properties, adds:

- `businessName` (String, unique, max 100 chars)
- `ownedRestaurants` (List of Restaurant objects)

**Capabilities:**

- Create restaurants
- Manage menu items
- View orders for their restaurants (not yet implemented)

### DeliveryDriver (Courier)

Inherits all User properties. No additional fields.

**Capabilities:**

- View available orders (status: READY_FOR_PICKUP)
- Claim orders
- Pick up orders (with pickup code verification)
- Complete deliveries (not yet implemented)

### Admin

Inherits all User properties. No additional fields.

**Capabilities:** Not yet defined/implemented

---

## Data Models

### Restaurant

```json
{
  "id": 1,
  "restaurantName": "Bob's Burgers",
  "address": "123 Ocean Avenue",
  "owner": {
    /* Vendor object - excluded in JSON */
  },
  "menuItems": [
    /* List of MenuItem objects - excluded in JSON */
  ]
}
```

**Fields:**

- `id` (Integer, auto-generated)
- `restaurantName` (String, unique)
- `address` (String)
- `owner` (Vendor reference - @JsonIgnore)
- `menuItems` (List<MenuItem> - @JsonIgnore)

### MenuItem

```json
{
  "id": 1,
  "itemName": "Classic Cheeseburger",
  "description": "Beef patty with cheddar cheese",
  "price": 9.99,
  "restaurant": {
    /* Restaurant object */
  }
}
```

**Fields:**

- `id` (Integer, auto-generated)
- `itemName` (String, unique per restaurant)
- `description` (String)
- `price` (BigDecimal)
- `restaurant` (Restaurant reference)

**Constraints:**

- Unique constraint on `(restaurant_id, item_name)`

### Order

```json
{
  "id": 1,
  "customer": {
    /* User object */
  },
  "restaurant": {
    /* Restaurant object */
  },
  "orderDate": "2025-12-17T10:30:00",
  "lastUpdated": "2025-12-17T10:30:00",
  "status": "PENDING",
  "totalPrice": 14.49,
  "deliveryAddress": "Alice Home Address, Apt 4B",
  "driver": null,
  "pickupCode": null,
  "orderDetails": [
    {
      "id": 1,
      "menuItem": {
        /* MenuItem object */
      },
      "quantity": 1,
      "priceAtPurchase": 9.99
    }
  ]
}
```

**Fields:**

- `id` (Integer, auto-generated)
- `customer` (User reference)
- `restaurant` (Restaurant reference)
- `orderDate` (LocalDateTime)
- `lastUpdated` (LocalDateTime)
- `status` (OrderStatus enum)
- `totalPrice` (BigDecimal)
- `deliveryAddress` (String)
- `driver` (DeliveryDriver reference, nullable)
- `pickupCode` (String, max 10 chars, nullable)
- `orderDetails` (List<OrderDetail>)

### OrderDetail

```json
{
  "id": 1,
  "menuItem": {
    /* MenuItem object */
  },
  "quantity": 1,
  "priceAtPurchase": 9.99
}
```

**Fields:**

- `id` (Integer, auto-generated)
- `order` (Order reference - @JsonBackReference)
- `menuItem` (MenuItem reference)
- `quantity` (Integer)
- `priceAtPurchase` (BigDecimal)

### OrderStatus Enum

```java
enum OrderStatus {
    PENDING,          // Order created
    PREPARING,        // Restaurant preparing food
    READY_FOR_PICKUP, // Ready for driver to claim
    PICKED_UP,        // Driver has picked up
    IN_TRANSIT,       // Being delivered
    DELIVERED,        // Completed
    CANCELLED         // Cancelled
}
```

**State Machine:** Orders automatically transition through states via `OrderStatusScheduler`

---

## API Endpoints

### User Endpoints

#### List All Users

```http
GET /users
Authorization: Required
```

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "email": "alice@test.com",
    "firstName": "Alice",
    "lastName": "Wonderland",
    "phoneNumber": "5550100",
    "userRole": "CUSTOMER",
    "isVerified": true
  }
]
```

---

### Customer Endpoints

#### Customer Signup

```http
POST /customers
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "customer@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "5551234567",
  "password": "Password123!"
}
```

**Response:** `201 CREATED`

```json
{
  "id": 4,
  "email": "customer@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "5551234567",
  "userRole": "CUSTOMER",
  "isVerified": false
}
```

**Validation:**

- Email: valid format, not blank
- First name: no numbers, max 50 chars, not blank
- Last name: no numbers, max 50 chars, not blank
- Phone: exactly 10 digits
- Password: 8-32 chars, at least 1 number, 1 lowercase, 1 uppercase, 1 special char `!@#$%^&+=()`

---

### Vendor Endpoints

#### Vendor Signup

```http
POST /vendors
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "vendor@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "phoneNumber": "5559876543",
  "password": "Password123!",
  "businessName": "Jane's Kitchen"
}
```

**Response:** `201 CREATED`

```json
{
  "id": 5,
  "email": "vendor@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "phoneNumber": "5559876543",
  "userRole": "VENDOR",
  "businessName": "Jane's Kitchen",
  "isVerified": false
}
```

**Validation:** Same as Customer + businessName (max 30 chars, not blank)

---

### Driver Endpoints

#### Driver Signup

```http
POST /drivers
Content-Type: application/json
Authorization: Not required for signup
```

**Request Body:** Same as CustomerSignupRequest

```json
{
  "email": "driver@example.com",
  "firstName": "Mike",
  "lastName": "Courier",
  "phoneNumber": "5551112222",
  "password": "Password123!"
}
```

**Response:** `201 CREATED`

#### Get Available Orders

```http
GET /drivers/orders/available
Authorization: Required (ROLE_COURIER)
```

**Response:** `200 OK`

```json
[
  {
    "id": 10,
    "customer": {
      /* User object */
    },
    "restaurant": {
      /* Restaurant object */
    },
    "orderDate": "2025-12-17T11:00:00",
    "status": "READY_FOR_PICKUP",
    "totalPrice": 25.5,
    "deliveryAddress": "456 Main St",
    "driver": null,
    "pickupCode": null,
    "orderDetails": [
      /* order items */
    ]
  }
]
```

**Notes:**

- Only returns orders with status `READY_FOR_PICKUP`
- Driver must be authenticated

#### Claim Order

```http
POST /drivers/orders/{id}/claim
Authorization: Required (ROLE_COURIER)
```

**Path Parameters:**

- `id` (Integer) - Order ID

**Response:** `202 ACCEPTED`

```
"ABC123"
```

**Response Body:** String containing the pickup code

**Notes:**

- Order status changes to `PICKED_UP`
- Pickup code is generated (10 chars max)
- Driver is assigned to the order

#### Pickup Order (Verify Code)

```http
POST /drivers/orders/{id}/pickup
Authorization: Required (ROLE_COURIER)
Content-Type: application/json
```

**Path Parameters:**

- `id` (Integer) - Order ID

**Request Body:**

```json
{
  "code": "ABC123"
}
```

**Response:** `202 ACCEPTED`

**Notes:**

- Verifies the pickup code matches
- Transitions order to next status (IN_TRANSIT)

---

### Restaurant Endpoints

#### Create Restaurant

```http
POST /restaurants
Content-Type: application/json
Authorization: Likely required (ROLE_VENDOR) - check implementation
```

**Request Body:**

```json
{
  "restaurantName": "Pizza Palace",
  "ownerId": 2,
  "address": "789 Pizza Lane"
}
```

**Response:** `201 CREATED`

```json
{
  "id": 3,
  "restaurantName": "Pizza Palace",
  "address": "789 Pizza Lane"
}
```

**Validation:**

- Restaurant name: not blank, max 50 chars
- Owner ID: not null
- Address: not blank

#### Create Menu Item

```http
POST /restaurants/{id}/menu-item
Content-Type: application/json
Authorization: Likely required (ROLE_VENDOR)
```

**Path Parameters:**

- `id` (Integer) - Restaurant ID

**Request Body:**

```json
{
  "itemName": "Margherita Pizza",
  "description": "Fresh mozzarella and basil",
  "price": 12.99
}
```

**Response:** `201 CREATED`

```json
{
  "id": 7,
  "itemName": "Margherita Pizza",
  "description": "Fresh mozzarella and basil",
  "price": 12.99,
  "restaurant": {
    /* Restaurant object */
  }
}
```

**Validation:**

- Item name: not blank, 3-30 chars
- Description: not blank, 5-255 chars
- Price: not null

---

### Order Endpoints

#### Create Order

```http
POST /orders
Content-Type: application/json
Authorization: Required
```

**Request Body:**

```json
{
  "customerId": 1,
  "restaurantId": 1,
  "deliveryAddress": "123 Customer St, Apt 5",
  "items": [
    {
      "menuItemId": 1,
      "quantity": 2
    },
    {
      "menuItemId": 3,
      "quantity": 1
    }
  ]
}
```

**Response:** `201 CREATED`

```json
{
  "id": 11,
  "customer": {
    /* User object */
  },
  "restaurant": {
    /* Restaurant object */
  },
  "orderDate": "2025-12-17T12:00:00",
  "lastUpdated": "2025-12-17T12:00:00",
  "status": "PENDING",
  "totalPrice": 24.48,
  "deliveryAddress": "123 Customer St, Apt 5",
  "driver": null,
  "pickupCode": null,
  "orderDetails": [
    {
      "id": 20,
      "menuItem": {
        /* MenuItem object */
      },
      "quantity": 2,
      "priceAtPurchase": 9.99
    },
    {
      "id": 21,
      "menuItem": {
        /* MenuItem object */
      },
      "quantity": 1,
      "priceAtPurchase": 4.5
    }
  ]
}
```

**Validation:**

- Customer ID: not null
- Restaurant ID: not null
- Delivery address: not blank, not null
- Items: not empty, not null
- Each item: menuItemId not null, quantity > 0

**Business Logic:**

- Total price calculated from menu item prices at time of order
- Order starts with status `PENDING`
- Order date set to current timestamp

---

## Request/Response DTOs

### CustomerSignupRequest

```typescript
{
  email: string; // Email format, required
  firstName: string; // Max 50, no numbers, required
  lastName: string; // Max 50, no numbers, required
  phoneNumber: string; // Exactly 10 digits
  password: string; // 8-32 chars, 1 upper, 1 lower, 1 number, 1 special
}
```

### VendorSignupRequest

```typescript
{
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  businessName: string; // Max 30 chars, required
}
```

### RestaurantCreationRequest

```typescript
{
  restaurantName: string; // Max 50 chars, required
  ownerId: number; // Required
  address: string; // Required
}
```

### MenuItemCreationRequest

```typescript
{
  itemName: string; // 3-30 chars, required
  description: string; // 5-255 chars, required
  price: number; // Required
}
```

### OrderCreationRequest

```typescript
{
  customerId: number;           // Required
  restaurantId: number;         // Required
  deliveryAddress: string;      // Required
  items: OrderItemRequest[];    // Required, not empty
}
```

### OrderItemRequest

```typescript
{
  menuItemId: number; // Required
  quantity: number; // Required, must be > 0
}
```

### PickupCodeRequest

```typescript
{
  code: string; // Required, not blank
}
```

---

## Validation Rules

### Email

- Must be valid email format
- Must be unique
- Required

### Passwords

- **Regex:** `^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=()])(?=\\S+$).{8,32}$`
- Length: 8-32 characters
- Must contain:
  - At least 1 number
  - At least 1 lowercase letter
  - At least 1 uppercase letter
  - At least 1 special character from: `!@#$%^&+=()`
- No whitespace allowed

### Names (First/Last)

- **Regex:** `^[^0-9]*$` (no numbers)
- Max length: 50 characters
- Required, cannot be blank

### Phone Numbers

- **Regex:** `\\d{10}` (exactly 10 digits)
- No formatting characters

### Business Name (Vendor)

- Max length: 30 characters
- Required, cannot be blank

---

## Frontend Implementation Checklist

### Authentication & Session Management

- [ ] Implement login form with form-urlencoded submission
- [ ] Handle JSESSIONID cookie (automatic with credentials: 'include')
- [ ] Implement logout functionality
- [ ] Create auth context/store for user state
- [ ] Implement protected routes based on user role
- [ ] Handle 401/403 responses and redirect to login
- [ ] Store current user info after login

### User Registration

- [ ] Customer signup form with validation
- [ ] Vendor signup form with business name field
- [ ] Driver signup form
- [ ] Display validation errors from backend
- [ ] Password strength indicator
- [ ] Auto-login after successful signup (or redirect to login)

### Customer Features

- [ ] Browse restaurants (needs GET /restaurants endpoint - NOT YET IMPLEMENTED)
- [ ] View restaurant menu items (needs endpoint - NOT YET IMPLEMENTED)
- [ ] Shopping cart functionality (client-side)
- [ ] Place order form
- [ ] View order history (needs GET /customers/orders - NOT YET IMPLEMENTED)
- [ ] Track order status in real-time (needs WebSocket or polling - NOT YET IMPLEMENTED)

### Vendor Features

- [ ] Vendor dashboard
- [ ] Create restaurant form
- [ ] Add menu items to restaurant
- [ ] View own restaurants list (needs GET /vendors/restaurants - NOT YET IMPLEMENTED)
- [ ] Edit restaurant details (needs PUT endpoint - NOT YET IMPLEMENTED)
- [ ] Edit/delete menu items (needs PUT/DELETE endpoints - NOT YET IMPLEMENTED)
- [ ] View incoming orders (needs GET /vendors/orders - NOT YET IMPLEMENTED)
- [ ] Update order status (needs PATCH /orders/{id}/status - NOT YET IMPLEMENTED)

### Driver Features

- [ ] Driver dashboard
- [ ] View available orders (GET /drivers/orders/available) ✓
- [ ] Claim order button (POST /drivers/orders/{id}/claim) ✓
- [ ] Pickup verification with code input (POST /drivers/orders/{id}/pickup) ✓
- [ ] View current delivery (needs endpoint - NOT YET IMPLEMENTED)
- [ ] Mark order as delivered (needs POST /drivers/orders/{id}/complete - NOT YET IMPLEMENTED)
- [ ] View delivery history (needs endpoint - NOT YET IMPLEMENTED)

### Data Types/Interfaces (TypeScript)

```typescript
// Already exists in frontend/src/types/users.ts
// Add these additional types:

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userRole: UserRole;
  isVerified: boolean;
}

interface Customer extends User {
  userRole: "CUSTOMER";
}

interface Vendor extends User {
  userRole: "VENDOR";
  businessName: string;
  ownedRestaurants?: Restaurant[];
}

interface DeliveryDriver extends User {
  userRole: "COURIER";
}

interface Admin extends User {
  userRole: "ADMIN";
}

type UserRole = "CUSTOMER" | "VENDOR" | "COURIER" | "ADMIN";

type OrderStatus =
  | "PENDING"
  | "PREPARING"
  | "READY_FOR_PICKUP"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED";

interface Restaurant {
  id: number;
  restaurantName: string;
  address: string;
}

interface MenuItem {
  id: number;
  itemName: string;
  description: string;
  price: number;
  restaurant?: Restaurant;
}

interface OrderDetail {
  id: number;
  menuItem: MenuItem;
  quantity: number;
  priceAtPurchase: number;
}

interface Order {
  id: number;
  customer: User;
  restaurant: Restaurant;
  orderDate: string; // ISO 8601 datetime
  lastUpdated: string;
  status: OrderStatus;
  totalPrice: number;
  deliveryAddress: string;
  driver?: DeliveryDriver | null;
  pickupCode?: string | null;
  orderDetails: OrderDetail[];
}

// Request types
interface SignupRequest {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
}

interface VendorSignupRequest extends SignupRequest {
  businessName: string;
}

interface LoginRequest {
  username: string; // Actually email
  password: string;
}

interface RestaurantCreateRequest {
  restaurantName: string;
  ownerId: number;
  address: string;
}

interface MenuItemCreateRequest {
  itemName: string;
  description: string;
  price: number;
}

interface OrderItemRequest {
  menuItemId: number;
  quantity: number;
}

interface OrderCreateRequest {
  customerId: number;
  restaurantId: number;
  deliveryAddress: string;
  items: OrderItemRequest[];
}

interface PickupCodeRequest {
  code: string;
}
```

### API Service Functions Needed

```typescript
// auth.ts
- login(email: string, password: string): Promise<void>
- logout(): Promise<void>
- getCurrentUser(): Promise<User>

// customers.ts
- signupCustomer(data: SignupRequest): Promise<Customer>

// vendors.ts
- signupVendor(data: VendorSignupRequest): Promise<Vendor>

// drivers.ts
- signupDriver(data: SignupRequest): Promise<DeliveryDriver>
- getAvailableOrders(): Promise<Order[]>
- claimOrder(orderId: number): Promise<string> // returns pickup code
- verifyPickup(orderId: number, code: string): Promise<void>

// restaurants.ts
- createRestaurant(data: RestaurantCreateRequest): Promise<Restaurant>
- createMenuItem(restaurantId: number, data: MenuItemCreateRequest): Promise<MenuItem>

// orders.ts
- createOrder(data: OrderCreateRequest): Promise<Order>
```

### Missing Backend Endpoints (Need to Request Implementation)

1. **GET /restaurants** - List all restaurants
2. **GET /restaurants/{id}** - Get restaurant details
3. **GET /restaurants/{id}/menu-items** - Get menu items for restaurant
4. **GET /customers/orders** - Get customer's order history
5. **GET /vendors/restaurants** - Get vendor's restaurants
6. **GET /vendors/orders** - Get orders for vendor's restaurants
7. **PATCH /orders/{id}/status** - Update order status
8. **PUT /restaurants/{id}** - Update restaurant details
9. **PUT /menu-items/{id}** - Update menu item
10. **DELETE /menu-items/{id}** - Delete menu item
11. **POST /drivers/orders/{id}/complete** - Mark delivery as complete
12. **GET /drivers/orders/active** - Get driver's current/active deliveries
13. **GET /drivers/orders/history** - Get driver's delivery history

### Error Handling

- [ ] Display validation errors from 400 responses
- [ ] Handle 401 Unauthorized (redirect to login)
- [ ] Handle 403 Forbidden (show access denied message)
- [ ] Handle 404 Not Found
- [ ] Handle 500 Server Error
- [ ] Network error handling

### Configuration

- [ ] Set axios/fetch baseURL to `http://localhost:8080`
- [ ] Configure credentials: 'include' for cookie-based auth
- [ ] Configure CORS headers (already handled by backend)

---

## Notes for Frontend Developers

1. **Authentication Flow:**

   - Login sends form-urlencoded data (not JSON)
   - Backend sets JSESSIONID cookie
   - All subsequent requests must include credentials
   - Use `credentials: 'include'` in fetch or `withCredentials: true` in axios

2. **Password Requirements:**

   - Show password requirements on signup forms
   - Implement client-side validation matching backend regex
   - Special characters allowed: `!@#$%^&+=()`

3. **Order Status Flow:**

   - Orders automatically transition through states
   - Frontend should poll or use WebSocket for real-time updates (WebSocket not yet implemented)
   - Expected flow: PENDING → PREPARING → READY_FOR_PICKUP → PICKED_UP → IN_TRANSIT → DELIVERED

4. **Pickup Code:**

   - Generated when driver claims order
   - Driver receives code in response
   - Vendor/Restaurant should display code to verify pickup
   - Code verification prevents unauthorized pickups

5. **User Roles:**

   - CUSTOMER can place orders
   - VENDOR can create restaurants and menu items
   - COURIER can claim and deliver orders
   - ADMIN role exists but has no functionality yet

6. **Data Relationships:**

   - Vendors own multiple Restaurants
   - Restaurants have multiple MenuItems
   - Orders contain OrderDetails (line items)
   - Orders link to Customer, Restaurant, and optionally Driver

7. **Current Limitations:**

   - No restaurant listing/browsing endpoints yet
   - No order history endpoints yet
   - No real-time order tracking
   - No vendor order management endpoints
   - No menu item editing/deletion
   - No image uploads for restaurants or menu items

8. **State Management Recommendations:**
   - Store authenticated user info (with role) in global state
   - Cache restaurant and menu data
   - Implement shopping cart as local state
   - Consider optimistic updates for better UX

---

## Development Database

**H2 Console:** `http://localhost:8080/h2-console`

- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (empty)

**Pre-seeded Data:**

- Customer: `alice@test.com`
- Vendor: `bob@test.com` (owns "Bob's Burgers" and "Pasta Palace")
- Admin: `admin@yueats.com`

(Passwords in seed data are hashed placeholders - not usable for actual login)

---

## Change Log & Version History

**Current Version:** 0.0.1-SNAPSHOT

- Initial implementation
- Basic CRUD for users, restaurants, menu items, orders
- Driver order claiming and pickup workflow
- Session-based authentication

---

**Last Updated:** December 17, 2025
