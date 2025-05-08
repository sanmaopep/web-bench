# NoSQL

This Project is created based on Project: [nextjs](../nextjs/readme.md)

## Introduction

**MongoDB** is a popular NoSQL database that provides high performance, high availability, and easy scalability for modern applications.

Its significance in modern web development comes from its unique features:

- **Document-Oriented**: Stores data in flexible, JSON-like documents
- **Scalable**: Horizontal scaling through sharding
- **High Performance**: Rich indexing and aggregation capabilities
- **Real-Time Analytics**: Powerful aggregation framework for data analysis
- **Cloud-Ready**: Easy deployment with MongoDB Atlas

MongoDB has become the **leading NoSQL database choice for enterprise applications**, especially for applications requiring flexible schema and high scalability.

[MongoDB Github](https://github.com/mongodb/mongo): Star 24.1k, Fork 5.3k

## Third-Party Libraries Used

### Mongoose

**Mongoose** is an elegant MongoDB object modeling tool designed for Node.js applications.

Key features that make Mongoose essential for MongoDB development:

- **Schema-Based**: Provides a straight-forward, schema-based solution
- **Built-in TypeChecking**: Automatic type casting and validation
- **Middleware Support**: Pre and post hooks for better control
- **Query Building**: Powerful and intuitive query building API
- **Business Logic Hooks**: Supports methods and statics

[Mongoose Github](https://github.com/Automattic/mongoose): Star 25.9k, Fork 3.8k

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

Tasks are designed to verify Agent's knowledge of NoSQL:

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

| API                                   | Status |
| :------------------------------------ | :----: |
| Schema Definition                     |   ✅   |
| Model Creation                        |   ✅   |
| Document Creation (save)              |   ✅   |
| Document Creation (create)            |   ✅   |
| Document Query (find)                 |   ✅   |
| Document Query (findOne)              |   ✅   |
| Document Update (findByIdAndUpdate)   |   ✅   |
| Document Update (findOneAndUpdate)    |   ✅   |
| Document Deletion (findByIdAndDelete) |   ✅   |
| Document Deletion (findOneAndDelete)  |   ✅   |
| Population (Populate)                 |   ✅   |
| Middleware (Pre/Post Hooks)           |   ❌   |
| Virtuals                              |   ❌   |
| Indexes                               |   ✅   |
| Validation                            |   ❌   |
| Aggregation                           |   ❌   |
| Transactions                          |   ✅   |
| Plugins                               |   ❌   |
| Query Building                        |   ❌   |
| Connection Management                 |   ✅   |
| Schema Methods                        |   ❌   |
| Schema Statics                        |   ❌   |
| Schema Query Helpers                  |   ❌   |
| Instance Methods                      |   ❌   |

## Development

```bash
npx next dev --port 3005
```

## Reference

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Commerce](https://nextjs.org/commerce)
