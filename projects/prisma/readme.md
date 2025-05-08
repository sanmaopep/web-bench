# Prisma

This Project is created based on Project: [nextjs](../nextjs/readme.md)

## Introduction

**Prisma** is a modern, type-safe ORM for Node.js and TypeScript that provides a high-level abstraction for interacting with databases including PostgreSQL, MySQL, SQLite, SQL Server, MongoDB, and CockroachDB.

Its significance in modern web development comes from its unique features:

- **Type Safety**: Full TypeScript support with auto-generated client
- **Schema Definition**: Define your database schema using Prisma Schema Language (PSL)
- **Migrations**: Auto-generated SQL migrations with a declarative approach
- **Fluent API**: Intuitive and type-safe query building
- **Relations**: Easily define and manage relationships between models
- **Transactions**: Support for atomic operations and data integrity
- **Prisma Studio**: Visual database editor for browsing and modifying data

Prisma has rapidly become the **leading ORM choice for TypeScript applications**, especially for applications requiring type safety, robust database interactions, and maintainable code.

[Prisma Github](https://github.com/prisma/prisma): Star 35k+, Fork 1.2k+

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

Tasks are designed to verify Agent's knowledge of Prisma:

easy:

- Task 1: Basic Router (App Router or Page Router)
- Task 2: Read Data
- Task 3: Create Schema, Create And Read Data
- Task 4: Update, Delete Data
- Task 5: List Page with Data Fetching

moderate:

- Task 6: Add Dynamic Routes For Detail Page
- Task 7: Simple JWT Authentication & Cookie
- Task 8: Login
- Task 9: Register
- Task 10: Static User Profile with Redirect

challenging:

- Task 11: User Widget with REALTIME STATUS. Combine React Context Provider & Server Actions.
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

| API                            | Status |
| :----------------------------- | :----: |
| Schema Definition              |   ✅   |
| Model Creation (Prisma Client) |   ✅   |
| Document Creation (create)     |   ✅   |
| Document Creation (createMany) |   ✅   |
| Document Query (findMany)      |   ✅   |
| Document Query (findUnique)    |   ✅   |
| Document Update (update)       |   ✅   |
| Document Update (updateMany)   |   ✅   |
| Document Deletion (delete)     |   ✅   |
| Document Deletion (deleteMany) |   ✅   |
| Relations (include)            |   ✅   |
| Middlewares                    |   ❌   |
| Computed Fields                |   ❌   |
| Indexes                        |   ❌   |
| Validation                     |   ❌   |
| Aggregation                    |   ❌   |
| Transactions ($transaction)    |   ✅   |
| Extensions                     |   ❌   |
| Raw Database Access            |   ❌   |
| Connection Management          |   ❌   |
| Fluent API                     |   ❌   |
| Nested Writes                  |   ❌   |
| Query Filters                  |   ❌   |

## Development

```bash
npx next dev --port 3005
```

## Reference

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Commerce](https://nextjs.org/commerce)
