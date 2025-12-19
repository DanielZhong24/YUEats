# YUEats 🍔

A full-stack food delivery platform built with Spring Boot and React, featuring separate interfaces for customers, vendors (restaurants), and couriers.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Development](#development)
- [License](#license)

## ✨ Features

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

- **Framework:** Spring Boot 3.5.7
- **Java Version:** 21
- **Database:** PostgreSQL
- **ORM:** Spring Data JPA (Hibernate)
- **Security:** Spring Security
- **Build Tool:** Maven

### Frontend

- **Framework:** React 19.2.0
- **Language:** TypeScript 5.7.2
- **Routing:** TanStack Router
- **State Management:** Zustand, TanStack Query
- **Forms:** TanStack Form, React Hook Form
- **UI Components:** Radix UI
- **Styling:** Tailwind CSS 4.0.6
- **Build Tool:** Vite 7.1.7
- **HTTP Client:** Axios
- **Package Manager:** pnpm

## 📁 Project Structure

```
YUEats/
├── backend/                # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── cssd2101/     # Java source code
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       ├── schema.sql
│   │   │       └── data.sql
│   │   └── test/
│   ├── pom.xml
│   └── mvnw
│
└── frontend/               # React frontend
    ├── src/
    │   ├── components/     # Reusable UI components
    │   │   ├── customer/   # Customer-specific components
    │   │   ├── vendor/     # Vendor-specific components
    │   │   ├── courier/    # Courier-specific components
    │   │   ├── forms/      # Form components
    │   │   └── ui/         # Base UI components
    │   ├── routes/         # Application routes
    │   ├── services/       # API service layer
    │   ├── hooks/          # Custom React hooks
    │   ├── store/          # State management
    │   ├── auth/           # Authentication logic
    │   └── schemas/        # Validation schemas
    ├── package.json
    └── vite.config.ts
```

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK) 21** or higher
- **Node.js 18+** and **pnpm**
- **PostgreSQL 12+**
- **Maven 3.8+** (or use the included Maven wrapper)

## 🚀 Installation

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

## 🏃 Running the Application

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

## 📚 API Documentation

The backend provides RESTful APIs for:

- User authentication
- Restaurant management
- Menu items
- Orders
- Customer operations
- Courier operations

API endpoints are organized by user role (customer, vendor, courier).

## 💻 Development

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

## 📝 License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
