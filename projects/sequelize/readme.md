# Sequelize

This Project is created based on Project: [nextjs](../nextjs/readme.md)

## Introduction

**Sequelize** is a powerful Object-Relational Mapping (ORM) library for Node.js that provides a high-level abstraction for interacting with relational databases like PostgreSQL, MySQL, SQLite, and MSSQL.

Its significance in modern web development comes from its unique features:

- **Multi-Database Support**: Works seamlessly with multiple relational databases
- **Model Definition**: Define models with a simple, declarative syntax
- **Migrations**: Manage database schema changes with ease
- **Query Building**: Build complex queries using a fluent API
- **Associations**: Easily define and manage relationships between models
- **Transactions**: Support for atomic operations and data integrity

Sequelize has become the **leading ORM choice for Node.js applications**, especially for applications requiring robust database interactions and maintainable code.

[Sequelize Github](https://github.com/sequelize/sequelize): Star 29.3k, Fork 4.5k

## Project Design

```mermaid
graph TD
    subgraph Components["React Components"]
        HeaderUserMenu["HeaderUserMenu"]
        CartComponent["Cart"]
    end

    subgraph Context["React Context"]
        AuthContext["AuthContext"]
        CartContext["CartContext"]
    end

    subgraph Frontend["Pages"]
        direction TB
        Root["/"]

        subgraph Auth["Auth Pages"]
            Login["/login"]
            Register["/register"]
        end

        subgraph User["User Pages"]
            Profile["/profile/[username]"]
            MyOrders["/my-orders"]
            Wishlist["/wishlist"]
            ProductsList["/products"]
            ProductDetail["/products/[id]"]
        end

        subgraph Admin["Admin Pages"]
            AdminProducts["/admin/products"]
            AdminUsers["/admin/users"]
            AdminOrders["/admin/orders"]
        end


    end

    subgraph Actions["Server Actions"]
        AuthActions["AuthActions"]
        CartActions["CartActions"]
        RefundActions["RefundActions"]
        RegisterActions["RegisterActions"]
        ReferralActions["ReferralActions"]
    end

    subgraph API["API Routes"]
        direction TB
        AuthAPI["/api/auth"]
        ProductsAPI["/api/products"]
        CartAPI["/api/cart"]
        WishlistAPI["/api/wishlist"]
        OrdersAPI["/api/orders"]
        CommentsAPI["/api/comments"]
        UsersAPI["/api/users"]
    end

    subgraph Database["Database Tables"]
        direction TB
        Users[(Users)]
        Products[(Products)]
        Orders[(Orders)]
        OrderItems[(Order Items)]
        Cart[(Cart)]
        Wishlists[(Wishlists)]
        Comments[(Comments)]
        Referrals[(Referrals)]
    end

    %% Context & Components Relations
    AuthContext --> HeaderUserMenu
    AuthContext --> Login
    AuthContext --> Register
    CartContext --> CartComponent

    %% Frontend to API Relationships
    Login --> AuthAPI
    Register --> AuthAPI
    ProductsList --> ProductsAPI
    ProductDetail --> ProductsAPI
    ProductDetail --> CommentsAPI
    Wishlist --> WishlistAPI
    MyOrders --> OrdersAPI
    AdminProducts --> ProductsAPI
    AdminUsers --> UsersAPI
    AdminOrders --> OrdersAPI

    %% API to Database Relationships
    AuthAPI --> Database
    ProductsAPI --> Database
    CartAPI --> Database
    WishlistAPI --> Database
    OrdersAPI --> Database
    CommentsAPI --> Database
    UsersAPI --> Database

    classDef pageClass fill:#e1f5fe,stroke:#01579b
    classDef apiClass fill:#fff3e0,stroke:#e65100
    classDef dbClass fill:#e8f5e9,stroke:#1b5e20
    classDef componentClass fill:#f3e5f5,stroke:#4a148c
    classDef contextClass fill:#fce4ec,stroke:#880e4f
    classDef actionClass fill:#e8eaf6,stroke:#1a237e

    class Root,Login,Register,Profile,MyOrders,Wishlist,ProductsList,ProductDetail,AdminProducts,AdminUsers,AdminOrders pageClass
    class AuthAPI,ProductsAPI,CartAPI,WishlistAPI,OrdersAPI,CommentsAPI,UsersAPI apiClass
    class Users,Products,Orders,OrderItems,Cart,Wishlists,Comments,Referrals,Database dbClass
    class CartComponent,HeaderUserMenu componentClass
    class AuthContext,CartContext contextClass
    class AuthActions,CartActions,RefundActions,RegisterActions,ReferralActions actionClass
```

Tasks are designed to verify Agent's knowledge of Sequelize:

easy:

- Task 1: Basic Router (App Router or Page Router)
- Task 2: Read Data
- Task 3: Create Model, Create And Read Data
- Task 4: Update, Delete Data
- Task 5: List Page with Data Fetching

moderate:

- Task 6: Add Dynamic Routes For Detail Page
- Task 7: Simple JWT Authentication & Cookie
- Task 8: Login
- Task 9: Register
- Task 10: Static User Profile with Redirect

challenging:

- Task 11: User Widget with REALTIME STATUS (Agent might forget it). Combine React Context Provider & Server Actions.
- Task 12: ACCURATE Number Increment
- Task 13: Add Admin Portals, add middleware to check privileges
- Task 14: Wish List
- Task 15: Cart Functionality
- Task 16: Place Order
- Task 17: Pay Order
- Task 18: Refunds Order
- Task 19: Comment System
- Task 20: Invitation System (Bonus when new User Registered or Pay a New Order)

## Feature Coverage

| API                                  | Status |
| :----------------------------------- | :----: |
| Schema Definition (Model Definition) |   ✅   |
| Model Creation                       |   ✅   |
| Document Creation (create)           |   ✅   |
| Document Creation (bulkCreate)       |   ✅   |
| Document Query (findAll)             |   ✅   |
| Document Query (findOne)             |   ✅   |
| Document Update (update)             |   ✅   |
| Document Update (findOneAndUpdate)   |   ✅   |
| Document Deletion (destroy)          |   ✅   |
| Document Deletion (findOneAndDelete) |   ✅   |
| Association (Include)                |   ✅   |
| Hooks (Before/After Hooks)           |   ❌   |
| Virtual Fields                       |   ❌   |
| Indexes                              |   ✅   |
| Validation                           |   ❌   |
| Aggregation                          |   ❌   |
| Transactions                         |   ✅   |
| Plugins                              |   ❌   |
| Query Building                       |   ❌   |
| Connection Management                |   ✅   |
| Model Methods                        |   ❌   |
| Model Statics                        |   ❌   |
| Scopes                               |   ❌   |
| Instance Methods                     |   ❌   |

## Development

```bash
npx next dev --port 3005
```

## Reference

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Commerce](https://nextjs.org/commerce)
