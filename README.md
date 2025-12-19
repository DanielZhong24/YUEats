# YUEats

A full-stack food delivery platform built with Spring Boot and React, featuring separate interfaces for customers, vendors (restaurants), and couriers.

## Features

### Customer Features

- Browse restaurants and menus
- Add items to cart and checkout
- Place and track orders in real-time
- View order history
- Live order status updates

### Vendor (Restaurant) Features

- Restaurant management and profile setup
- Menu creation and management
- Order management
- Restaurant switcher for multi-restaurant vendors
- Dashboard analytics

### Courier Features

- Dashboard for available deliveries
- Order pickup and delivery management
- Real-time order tracking

### General Features

- User authentication and authorization
- Secure session management
- Responsive design with dark/light theme support
- Real-time updates

## 🛠️ Tech Stack

### Backend

- **Framework:** Spring Boot
- **Java Version:** 21
- **Database:** PostgreSQL
- **ORM:** Spring Data JPA (Hibernate)
- **Security:** Spring Security
- **Build Tool:** Maven

### Frontend

- **Framework:** React
- **Language:** TypeScript
- **Routing:** TanStack Router
- **State Management:** Zustand, TanStack Query
- **Forms:** TanStack Form, React Hook Form
- **UI Components:** Radix UI
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **HTTP Client:** Axios
- **Package Manager:** pnpm

## Project Structure

<details>
<summary><strong>Click to expand full project structure</strong></summary>

```
YUEats/
├── LICENSE
├── README.md
│
├── backend/                                    # Spring Boot Backend Application
│   ├── mvnw                                   # Maven wrapper script (Unix)
│   ├── mvnw.cmd                              # Maven wrapper script (Windows)
│   ├── pom.xml                               # Maven project configuration
│   │
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── cssd2101/
│   │   │   │       └── yueats/
│   │   │   │           ├── YuEatsApplication.java           # Main Spring Boot application class
│   │   │   │           │
│   │   │   │           ├── builder/                         # Builder pattern implementations
│   │   │   │           │
│   │   │   │           ├── configuration/                   # Spring configuration classes
│   │   │   │           │   └── SecurityConfig.java          # Security configuration
│   │   │   │           │
│   │   │   │           ├── controller/                      # REST API Controllers
│   │   │   │           │   ├── CourierController.java       # Courier endpoints
│   │   │   │           │   ├── CustomerController.java      # Customer endpoints
│   │   │   │           │   ├── OrderController.java         # Order management endpoints
│   │   │   │           │   ├── RestaurantController.java    # Restaurant endpoints
│   │   │   │           │   ├── UserController.java          # User authentication endpoints
│   │   │   │           │   └── VendorController.java        # Vendor endpoints
│   │   │   │           │
│   │   │   │           ├── dto/                             # Data Transfer Objects
│   │   │   │           │   ├── CustomerSignupRequest.java
│   │   │   │           │   ├── MenuItemCreationRequest.java
│   │   │   │           │   ├── OrderCreationRequest.java
│   │   │   │           │   ├── OrderItemRequest.java
│   │   │   │           │   ├── PickupCodeRequest.java
│   │   │   │           │   ├── RestaurantCreationRequest.java
│   │   │   │           │   └── VendorSignupRequest.java
│   │   │   │           │
│   │   │   │           ├── exceptions/                      # Custom exception classes
│   │   │   │           │
│   │   │   │           ├── factory/                         # Factory pattern implementations
│   │   │   │           │   └── UserFactory.java
│   │   │   │           │
│   │   │   │           ├── model/                           # JPA Entity Models
│   │   │   │           │   ├── Admin.java
│   │   │   │           │   ├── Customer.java
│   │   │   │           │   ├── DeliveryCourier.java
│   │   │   │           │   ├── MenuItem.java
│   │   │   │           │   ├── Order.java
│   │   │   │           │   ├── OrderDetail.java
│   │   │   │           │   ├── Restaurant.java
│   │   │   │           │   ├── User.java
│   │   │   │           │   └── Vendor.java
│   │   │   │           │
│   │   │   │           ├── repository/                      # Spring Data JPA Repositories
│   │   │   │           │   ├── MenuItemRepository.java
│   │   │   │           │   ├── OrderRepository.java
│   │   │   │           │   ├── RestaurantRepository.java
│   │   │   │           │   └── UserRepository.java
│   │   │   │           │
│   │   │   │           ├── scheduler/                       # Order state machine & scheduling
│   │   │   │           │   ├── OrderEventListener.java
│   │   │   │           │   ├── OrderStateMachine.java
│   │   │   │           │   ├── OrderStatusEvent.java
│   │   │   │           │   ├── OrderStatusScheduler.java
│   │   │   │           │   └── SchedulerConfig.java
│   │   │   │           │
│   │   │   │           ├── service/                         # Business Logic Layer
│   │   │   │           │   ├── CustomerDetailsService.java
│   │   │   │           │   ├── MenuItemService.java
│   │   │   │           │   ├── OrderService.java
│   │   │   │           │   ├── RestaurantService.java
│   │   │   │           │   └── UserService.java
│   │   │   │           │
│   │   │   │           ├── types/                           # Enums and Type definitions
│   │   │   │           │   ├── OrderStatus.java
│   │   │   │           │   └── UserRole.java
│   │   │   │           │
│   │   │   │           └── validation/                      # Custom validation logic
│   │   │   │
│   │   │   └── resources/
│   │   │       ├── application.properties                   # Application configuration
│   │   │       ├── schema.sql                               # Database schema definition
│   │   │       └── data.sql                                 # Sample data for initialization
│   │   │
│   │   └── test/
│   │       └── java/
│   │           └── cssd2101/
│   │               └── yueats/                              # Test classes
│   │
│   └── target/                                              # Compiled classes (generated)
│       ├── classes/
│       ├── generated-sources/
│       ├── generated-test-sources/
│       ├── maven-status/
│       └── test-classes/
│
└── frontend/                                   # React Frontend Application
    ├── index.html                             # Main HTML entry point
    ├── package.json                           # NPM dependencies and scripts
    ├── pnpm-lock.yaml                         # Lockfile for dependencies
    ├── tsconfig.json                          # TypeScript configuration
    ├── vite.config.ts                         # Vite build configuration
    ├── components.json                        # UI components configuration
    ├── eslint.config.js                       # ESLint configuration
    ├── prettier.config.js                     # Prettier configuration
    ├── README.md                              # Frontend documentation
    │
    ├── public/                                # Static assets
    │   ├── favicon.ico
    │   ├── logo.png
    │   ├── hero-1.jpg
    │   ├── manifest.json
    │   ├── robots.txt
    │   ├── tanstack-circle-logo.png
    │   ├── tanstack-word-logo-white.svg
    │   └── assets/
    │       └── home/                          # Homepage assets
    │
    └── src/
        ├── App.tsx                            # Root application component
        ├── main.tsx                           # Application entry point
        ├── router.tsx                         # Router configuration
        ├── routeTree.gen.ts                   # Generated route tree (TanStack Router)
        ├── reportWebVitals.ts                 # Performance monitoring
        ├── styles.css                         # Global styles
        ├── logo.svg
        │
        ├── auth/                              # Authentication Module
        │   ├── hooks.ts                       # Auth-related hooks
        │   ├── provider.tsx                   # Auth context provider
        │   └── types.ts                       # Auth type definitions
        │
        ├── components/                        # React Components
        │   ├── auth-card.tsx                  # Authentication card wrapper
        │   ├── theme-mode-toggle.tsx          # Dark/Light mode toggle
        │   ├── theme-provider.tsx             # Theme context provider
        │   │
        │   ├── courier/                       # Courier Role Components
        │   │   ├── CourierDashboard.tsx
        │   │   ├── CourierLayout.tsx
        │   │   └── CourierTopbar.tsx
        │   │
        │   ├── customer/                      # Customer Role Components
        │   │   ├── CheckoutPage.tsx
        │   │   ├── CustomerDashboard.tsx
        │   │   ├── CustomerLayout.tsx
        │   │   ├── CustomerTopbar.tsx
        │   │   ├── LiveOrderStatus.tsx
        │   │   ├── OrdersPage.tsx
        │   │   └── RestaurantDetail.tsx
        │   │
        │   ├── forms/                         # Form Components
        │   │   ├── login-form.tsx
        │   │   └── signup-form.tsx
        │   │
        │   ├── ui/                            # Reusable UI Components (shadcn/ui)
        │   │   ├── button.tsx
        │   │   ├── card.tsx
        │   │   ├── ConfirmDeleteModal.tsx
        │   │   ├── dropdown-menu.tsx
        │   │   ├── field.tsx
        │   │   ├── hero.tsx
        │   │   ├── input-group.tsx
        │   │   ├── input.tsx
        │   │   ├── label.tsx
        │   │   ├── select.tsx
        │   │   ├── separator.tsx
        │   │   ├── slider.tsx
        │   │   ├── sonner.tsx                 # Toast notifications
        │   │   ├── switch.tsx
        │   │   ├── tabs.tsx
        │   │   ├── textarea.tsx
        │   │   ├── toggle-group.tsx
        │   │   └── toggle.tsx
        │   │
        │   └── vendor/                        # Vendor Role Components
        │       ├── CreateMenuModal.tsx
        │       ├── RestaurantCreatePage.tsx
        │       ├── RestaurantSwitcher.tsx
        │       ├── Sidebar.tsx
        │       ├── Topbar.tsx
        │       ├── VenderPrepPage.tsx
        │       ├── VendorSettingsPage.tsx
        │       └── Dashboard/                 # Vendor Dashboard Components
        │           ├── AnalyticsCard.tsx
        │           ├── Charts.tsx
        │           └── Dashboard.tsx
        │
        ├── context/                           # React Context Providers
        │   └── VendorContext.tsx
        │
        ├── hooks/                             # Custom React Hooks
        │   ├── useCustomerApi.ts
        │   ├── userCourierApi.ts
        │   └── useVendorApi.ts
        │
        ├── integrations/                      # Third-party Integrations
        │   └── tanstack-query/                # TanStack Query configuration
        │
        ├── lib/                               # Utility Libraries
        │   └── utils.ts                       # Helper functions
        │
        ├── routes/                            # Route Components (TanStack Router)
        │   ├── __root.tsx                     # Root layout
        │   ├── _authenticated.tsx             # Authenticated layout wrapper
        │   ├── auth.tsx                       # Authentication page
        │   ├── index.tsx                      # Homepage
        │   │
        │   └── _authenticated/                # Protected Routes
        │       ├── dashboard.tsx              # Main dashboard
        │       │
        │       ├── courier/                   # Courier Routes
        │       │   └── index.tsx
        │       │
        │       ├── customer/                  # Customer Routes
        │       │   ├── index.tsx              # Customer dashboard
        │       │   ├── checkout.tsx           # Checkout page
        │       │   ├── orders.tsx             # Order history
        │       │   ├── restaurant.$restaurantId.tsx  # Restaurant details
        │       │   └── route.tsx              # Customer layout
        │       │
        │       └── vendor/                    # Vendor Routes
        │           ├── index.tsx              # Vendor dashboard
        │           ├── menu.tsx               # Menu management
        │           ├── prep.tsx               # Order preparation
        │           ├── settings.tsx           # Vendor settings
        │           ├── route.tsx              # Vendor layout
        │           └── restaurants/           # Restaurant management
        │               └── create/            # Create restaurant
        │
        ├── schemas/                           # Validation Schemas (Zod)
        │   └── signup-login.ts
        │
        ├── services/                          # API Service Layer
        │   ├── courier.ts                     # Courier API calls
        │   ├── customer.ts                    # Customer API calls
        │   └── vendor.ts                      # Vendor API calls
        │
        ├── store/                             # State Management (Zustand)
        │   └── useCartStore.ts                # Shopping cart state
        │
        └── utils/                             # Utility Functions
            └── upload.ts                      # File upload utilities
```

</details>

## Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK) 21** or higher
- **Node.js 18+** and **pnpm**
- **PostgreSQL 12+**
- **Maven 3.8+** (or use the included Maven wrapper)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/DanielZhong24/YUEats.git
cd YUEats
```

### 2. Backend Setup

```bash
cd backend
```

The project includes Maven Wrapper, so you don't need to install Maven separately.

### 3. Frontend Setup

```bash
cd frontend
pnpm install
```

## 🔧 Configuration

### Database Configuration

1. Create a PostgreSQL database for the application:

```sql
CREATE DATABASE yueats;
```

2. Set up environment variables for the backend. Create a `.env` file or set the following environment variables:

```bash
export DB_URL=jdbc:postgresql://localhost:5432/yueats
export DB_USERNAME=your_username
export DB_PASSWORD=your_password
```

Alternatively, you can modify [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties) directly (not recommended for production).

### Backend Configuration

The backend is configured through [application.properties](backend/src/main/resources/application.properties):

- **Database URL:** Set via `DB_URL` environment variable
- **Database Username:** Set via `DB_USERNAME` environment variable
- **Database Password:** Set via `DB_PASSWORD` environment variable
- **Server Port:** Default is 8080 (Spring Boot default)

### Frontend Configuration

The frontend connects to the backend API. If your backend runs on a different port or host, update the API base URL in the service files located in [src/services/](frontend/src/services/).

## Running the Application

### Start the Backend

```bash
cd backend
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### Start the Frontend

In a new terminal:

```bash
cd frontend
pnpm dev
```

The frontend will start on `http://localhost:3000`

### Access the Application

Open your browser and navigate to:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080

## API Documentation

The backend provides RESTful APIs for:

- User authentication
- Restaurant management
- Menu items
- Orders
- Customer operations
- Courier operations

API endpoints are organized by user role (customer, vendor, courier).

## Development

### Backend Development

```bash
cd backend
./mvnw spring-boot:run
```

The application uses:

- JPA for database operations
- Spring Security for authentication
- Automatic schema initialization from `schema.sql`
- Sample data loading from `data.sql`

### Frontend Development

```bash
cd frontend
pnpm dev        # Start dev server
pnpm build      # Build for production
pnpm lint       # Run ESLint
pnpm format     # Run Prettier
pnpm check      # Format and lint
pnpm test       # Run tests
```

### Code Style

- **Frontend:** The project uses ESLint and Prettier for code formatting
- **Backend:** Follow standard Java/Spring Boot conventions

### Building for Production

#### Backend

```bash
cd backend
./mvnw clean package
java -jar target/YUEats-0.0.1-SNAPSHOT.jar
```

#### Frontend

```bash
cd frontend
pnpm build
```

The production build will be in the `dist/` directory.
