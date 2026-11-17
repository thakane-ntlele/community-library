# Community Library

A full-stack library management system for a community library.
Manage books, track stock, record borrowing/returns, and manage users.

#Features

#Book Management
- Add new books: Title, Author, Genre, ISBN, Initial Quantity
- Update existing book details
- Delete books that are no longer available

#Availability Management
- Track quantity of each book in stock
- Add stock when new books arrive
- Deduct stock when books are borrowed
- Dashboard highlights low stock books (fewer than 2 copies)

#Transactions
- Record borrow and return transactions
- View transaction history log

#User Management
- Login form for users
- Add new users: Name, Membership ID, Role
- Update and delete users

# Tech Stack
- Frontend: React (Vite), React Router, Hooks (useState, useEffect), Fetch API, CSS
- Backend: Node.js, Express.js
- Database: MySQL / PostgreSQL
- Communication: React -> Express -> Database

## Project Structure
community-library/
├── frontend/          # React app
│   ├── src/
│   │   ├── components/  # AddBookForm, BookList, Navbar
│   │   ├── pages/       # Dashboard, Books, Transactions, Users, Login
│   │   ├── App.jsx
│   │   └── main.jsx
├── backend/           # Express API
│   ├── server.js      # Routes for /books, /users, /transactions
│   ├── db.js          # Database connection
│   └── package.json

#How To Run

#1. Backend
cd backend
npm install
npm start
Backend runs on http://localhost:5000

#2. Frontend
cd frontend
npm install
npm run dev
Frontend runs on http://localhost:5173

# API Endpoints
- GET /books - Get all books
- POST /books - Add a book
- PUT /books/:id - Update a book
- DELETE /books/:id - Delete a book
- GET /users - Get all users
- POST /users - Add a user
- PUT /users/:id - Update a user
- DELETE /users/:id - Delete a user
- GET /transactions - Get transaction history
- POST /transactions - Add / deduct stock
