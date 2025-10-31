# E-Shop Microservices Project

This project is a modern e-commerce platform built using a microservices architecture with a React frontend.

## Project Structure & Repository Locations

The application is divided into a frontend client and multiple backend microservices.

### Frontend Application

The user-facing single-page application built with React.

-   **Repository Location:** [react-frontend](https://github.com/gitruns/eshop/tree/main/react-frontend)
-   **Running on:** `http://localhost:3000`

### Backend Services

The backend is composed of several independent Spring Boot microservices.

-   **API Gateway:** The single entry point for all frontend requests. It handles routing, security, and CORS.
    -   **Repository Location:** [api-gateway](https://github.com/gitruns/eshop/tree/main/api-gateway)
    -   **Running on:** `http://localhost:9191`

-   **Service Registry:** Allows services to discover and communicate with each other using Eureka.
    -   **Repository Location:** [service-registry](https://github.com/gitruns/eshop/tree/main/service-registry)
    -   **Dashboard:** `http://localhost:8761`

-   **Config Server:** Centralized configuration management for all microservices.
    -   **Repository Location:** [config-server](https://github.com/gitruns/eshop/tree/main/config-server)
    -   **Running on:** `http://localhost:9000`

-   **Authentication Service:** Manages user registration, login, and JWT token generation.
    -   **Repository Location:** [auth-service](https://github.com/gitruns/eshop/tree/main/auth-service)

-   **Product Service:** Manages product information, inventory, and details.
    -   **Repository Location:** [product-service](https://github.com/gitruns/eshop/tree/main/product-service)

-   **Category Service:** Manages product categories.
    -   **Repository Location:** [category-service](https://github.com/gitruns/eshop/tree/main/category-service)

-   **Order Service:** Manages order creation and processing logic.
    -   **Repository Location:** [order-service](https://github.com/gitruns/eshop/tree/main/order-service)

-   **Payment Service:** Handles payment transactions.
    -   **Repository Location:** [payment-service](https://github.com/gitruns/eshop/tree/main/payment-service)
