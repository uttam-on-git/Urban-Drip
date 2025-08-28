# Urban Drip

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-764ABC?logo=redux&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?logo=tanstack&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?logo=cloudinary&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-2A2A2A?logo=nodemailer&logoColor=white)

Urban Drip is a modern e-commerce platform built with Next.js, offering a robust and scalable solution for online retail. This project is currently in development, with a focus on building out core features like user authentication, media management, and an administrative dashboard.

## 🚀 Getting Started

To get started with Urban Drip, follow these steps:

### Prerequisites

-   Node.js (v18.18.0 or later)
-   npm, yarn, pnpm, or bun

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/uttam-on-git/urban-drip.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd urban-drip
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```

### Environment Variables

To run the application locally, you'll need to set up your environment variables.

1.  **Create a `.env.local` file in the root of the project:**
    ```bash
    touch .env.local
    ```
2.  **Add the following environment variables to the newly created `.env.local` file and fill in your values:**

    ```
    SECRET_KEY=
    NODEMAILER_HOST = 
    NODEMAILER_PORT = 
    NODEMAILER_EMAIL = 
    NODEMAILER_PASSWORD = 

    NEXT_PUBLIC_BASE_URL = "http://localhost:3000"
    NODE_ENV = "development"

    #cloudinary
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME =
    NEXT_PUBLIC_CLOUDINARY_API_KEY = 
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = 
    CLOUDINARY_SECRET_KEY = 

    DB_USER=
    DB_PASSWORD=
    DB_NAME=

    DATABASE_URL = "postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}?schema=public"
    ```

### Running the Development Server

1.  **Start the development server:**
    ```bash
    npm run dev
    ```
2.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the application in action.

---

## 🎨 UI Screenshots

Here's a glimpse of the user interface for the currently developed pages:

### Authentication Pages

-   **Login Page:** A clean and simple form for user login, with options for password recovery and registration. It also includes an OTP verification step for added security.
    ![Login Page](screenshots/login-page.png)

-   **Registration Page:** A user-friendly form for new users to sign up, requiring essential details like full name, email, and password.
    ![Registration Page](screenshots/registration-page.png)

-   **Reset Password Page:** A multi-step process for password recovery, including email and OTP verification, followed by a form to set a new password.
    ![Reset Password Page](screenshots/reset-password-page.png)

-   **Email Verification Page:** A dedicated page to confirm the user's email address, displaying a clear success or failure message.
    ![Email Verification Page](screenshots/email-verification-page.png)

### Admin Panel

-   **Media Management Page:** A grid-based layout for managing media, with features for selection, deletion, and uploading new files via Cloudinary.
    ![Media Management Page](screenshots/media-management-page.png)

-   **Media Functionalities:** A view of the media management page showcasing the various functionalities available for each media item, such as editing, copying the link, and moving to trash.
    ![Media Functionalities](screenshots/media-functionalities.png)

-   **Media Edit Page:** An intuitive form for editing media details, such as title and alt text, with a preview of the selected image.
    ![Media Edit Page](screenshots/media-edit-page.png)

-   **Media Trash Page:** A dedicated page for managing soft-deleted media.
    ![Media Trash Page](screenshots/media-trash.png)

-   **Restore/Permanent Delete:** The media trash view where users can either restore soft-deleted items or delete them permanently.
    ![Restore/Permanent Delete](screenshots/rsd-pd.png)

---

## ✨ Features

Urban Drip comes with a range of features designed to provide a seamless e-commerce experience:

### Authentication

-   **User Registration:** New users can easily create an account by providing their name, email, and password.
-   **Email Verification:** To ensure the authenticity of users, a verification link is sent to the user's email address upon registration, enhancing security and user trust.
-   **User Login & Two-Factor Authentication:** Registered users can log in using their email and password. For enhanced security, the system includes OTP-based two-factor authentication.
-   **Password Reset:** A secure, multi-step password reset process is available for users who forget their password, involving OTP verification sent to their email.

### Media Management

-   **Cloudinary Integration:** Media assets are seamlessly uploaded and managed using Cloudinary, a powerful cloud-based service for image and video management.
-   **Versatile Upload Options:** Users can upload media from various sources, including local files, URLs, Google Drive, and Unsplash, providing flexibility and convenience.
-   **Comprehensive Media Dashboard:** The admin panel features a media dashboard where administrators can efficiently manage all media assets with functionalities to view, edit, soft delete, restore, and permanently delete files.

### Admin Panel

-   **Centralized Dashboard:** A dedicated dashboard provides administrators with a centralized location to manage the entire application.
-   **Intuitive Navigation:** The admin panel includes a well-organized sidebar for easy navigation between different management sections like Dashboard, Category, Products, and Coupons.
-   **Customizable Theme:** Administrators can switch between light and dark modes to suit their visual preferences.

### State Management

-   **Redux Toolkit:** The application leverages Redux Toolkit for efficient and predictable state management across the application.
-   **Persistent State with Redux Persist:** To enhance user experience, Redux Persist is integrated to save the Redux store in the browser's local storage, maintaining state across sessions.

---

## 🛠️ Tech Stack

Urban Drip is built with a modern and powerful tech stack:

-   **Framework:** [Next.js](https://nextjs.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
-   **Database:** [PostgreSQL](https://www.postgresql.org/)
-   **ORM:** [Prisma](https://www.prisma.io/)
-   **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
-   **Data Fetching:** [TanStack Query](https://tanstack.com/query/latest)
-   **Form Handling:** [React Hook Form](https://react-hook-form.com/)
-   **Schema Validation:** [Zod](https://zod.dev/)
-   **Media Management:** [Cloudinary](https://cloudinary.com/)
-   **Email Service:** [Nodemailer](https://nodemailer.com/)

---

## 📝 API Endpoints

The following are the key API endpoints available in the application:

-   **Authentication:**
    -   `POST /api/auth/register`: User registration.
    -   `POST /api/auth/login`: User login.
    -   `POST /api/auth/verify-email`: Email verification.
    -   `POST /api/auth/reset-password/send-otp`: Send OTP for password reset.
    -   `POST /api/auth/reset-password/verify-otp`: Verify OTP for password reset.
    -   `PUT /api/auth/reset-password/update-password`: Update user password.
-   **Media:**
    -   `POST /api/media/create`: Upload new media.
    -   `GET /api/media`: Get a list of media.
    -   `GET /api/media/get/[id]`: Get a specific media by ID.
    -   `PUT /api/media/update`: Update media details.
    -   `PUT /api/media/delete`: Soft delete or restore media.
    -   `DELETE /api/media/delete`: Permanently delete media.

---

## Future Development

Urban Drip is an evolving project with several features planned for future releases:

-   **Product Management:** Full CRUD functionality for products and product variants.
-   **Category Management:** Functionality to add, edit, and delete product categories.
-   **Coupon Management:** A system for creating and managing promotional coupons.
-   **Order Management:** A comprehensive system for handling customer orders.
-   **Customer Management:** Tools for managing customer information and order history.
-   **Ratings and Reviews:** A feature to allow customers to rate and review products.

---
