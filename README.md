# 📚 BookWorm

**Personalized Book Recommendation & Reading Tracker Application**

---

## 🔗 Live Demo
https://bookworm-umber-delta.vercel.app/login
---

## 📝 Overview

BookWorm is an interactive platform designed to enhance the reading experience by helping users discover new books, track their reading progress, write reviews, and receive personalized book recommendations. The application features two distinct user roles:

- **Admin:** Manage users, books, genres, reviews, and tutorials.
- **User:** Browse books, maintain personal reading shelves, submit reviews, and view personalized recommendations.

This project emphasizes a cozy, book-themed UI, responsive design, and seamless user experience.

---

## 🌟 Key Features

### Admin Features
- **User Management:** Assign roles, promote/demote users.
- **Book Management:** Add, edit, delete books with cover image uploads.
- **Genre Management:** Create, edit genres/categories.
- **Review Moderation:** Approve or delete user-submitted reviews.
- **Tutorial Management:** Embed/manage YouTube book-related tutorials.
- **Dashboard Stats:** Overview of total books, users, and pending reviews.

### User Features
- **Personal Library:** "Want to Read", "Currently Reading", and "Read" shelves.
- **Reading Tracker:** Track reading progress with percentages or pages.
- **Book Discovery:** Browse books with search, genre filters, rating filters, and sorting options.
- **Reviews & Ratings:** Submit reviews with 1–5 star ratings.
- **Personalized Recommendations:** Based on reading history, top-rated books, and genre preferences.
- **Tutorials:** Watch embedded YouTube tutorials for book reviews and tips.
- **Reading Challenges:** Set yearly reading goals and track progress.
- **Social Features (Bonus):** Follow other users and view activity feeds.

---

## 📂 Pages & Layout

### User Pages
- Dashboard / Home: Personalized recommendations & reading stats.
- Browse Books: Book listings with search, filters, and pagination.
- My Library: Shelves & reading progress tracking.
- Book Details: Review submission, add to shelf.
- Tutorials: Embedded YouTube videos.
- Login / Register: Secure authentication.

### Admin Pages
- Dashboard: Stats overview (books, users, reviews).
- Manage Books: CRUD operations for books.
- Manage Genres: Add/edit genres.
- Manage Users: View/change roles.
- Moderate Reviews: Approve/delete reviews.
- Manage Tutorials: Add/manage YouTube tutorials.

---

## 🛠 Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Chart.js / Recharts
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** NextAuth.js (JWT strategy), Role-Based Access Control
- **Image Uploads:** Cloudinary or Local Storage
- **Hosting:** Vercel (Frontend), [Backend hosting if applicable]

---

## 🛡 Authentication & Security

- **Registration:** Name, Email, Password, Profile Photo.
- **Login:** Email & Password verification.
- **Protected Routes:** Role-based access; all pages require login.
- **Default Redirection:**
  - Normal User → My Library
  - Admin → Dashboard

---

## 💾 Database Models (Overview)

- **User:** Name, Email, Password (hashed), Role, Profile Photo
- **Book:** Title, Author, Genre, Description, Cover Image
- **Genre:** Name, Description
- **Review:** User, Book, Rating, Comment, Status (pending/approved)
- **Tutorial:** Title, YouTube Link

---
