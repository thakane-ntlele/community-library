import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users";

const defaultBooks = [
  {
    id: 1,
    title: "Things Fall Apart",
    author: "Chinua Achebe",
    genre: "Fiction",
    isbn: "9780385474542",
    quantity: 3
  },
  {
    id: 2,
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Adventure",
    isbn: "9780061122415",
    quantity: 1
  }
];

const defaultUsers = [
  {
    id: 1,
    name: "Administrator",
    membershipId: "ADMIN001",
    role: "Admin",
    password: "admin123"
  },
  {
    id: 2,
    name: "Library Member",
    membershipId: "MEM001",
    role: "Member",
    password: "1234"
  }
];

function App() {
  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem("libraryBooks");

    return savedBooks
      ? JSON.parse(savedBooks)
      : defaultBooks;
  });

  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("libraryUsers");

    return savedUsers
      ? JSON.parse(savedUsers)
      : defaultUsers;
  });

  const [transactions, setTransactions] = useState(() => {
    const savedTransactions =
      localStorage.getItem("libraryTransactions");

    return savedTransactions
      ? JSON.parse(savedTransactions)
      : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser =
      localStorage.getItem("currentLibraryUser");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  useEffect(() => {
    localStorage.setItem(
      "libraryBooks",
      JSON.stringify(books)
    );
  }, [books]);

  useEffect(() => {
    localStorage.setItem(
      "libraryUsers",
      JSON.stringify(users)
    );
  }, [users]);

  useEffect(() => {
    localStorage.setItem(
      "libraryTransactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        "currentLibraryUser",
        JSON.stringify(currentUser)
      );
    } else {
      localStorage.removeItem("currentLibraryUser");
    }
  }, [currentUser]);

  const handleLogin = (membershipId, password) => {
    const user = users.find(
      (item) =>
        item.membershipId.toLowerCase() ===
          membershipId.toLowerCase() &&
        item.password === password
    );

    if (!user) {
      return {
        success: false,
        message: "Invalid membership ID or password."
      };
    }

    setCurrentUser(user);

    return {
      success: true
    };
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleAddBook = (bookData) => {
    const newBook = {
      id: Date.now(),
      title: bookData.title.trim(),
      author: bookData.author.trim(),
      genre: bookData.genre.trim(),
      isbn: bookData.isbn.trim(),
      quantity: Number(bookData.quantity)
    };

    setBooks((currentBooks) => [
      ...currentBooks,
      newBook
    ]);
  };

  const handleUpdateBook = (id, bookData) => {
    setBooks((currentBooks) =>
      currentBooks.map((book) =>
        book.id === id
          ? {
              ...book,
              title: bookData.title.trim(),
              author: bookData.author.trim(),
              genre: bookData.genre.trim(),
              isbn: bookData.isbn.trim(),
              quantity: Number(bookData.quantity)
            }
          : book
      )
    );
  };

  const handleDeleteBook = (id) => {
    setBooks((currentBooks) =>
      currentBooks.filter((book) => book.id !== id)
    );
  };

  const handleTransaction = (
    bookId,
    type,
    amount
  ) => {
    const quantity = Number(amount);

    if (!quantity || quantity <= 0) {
      return {
        success: false,
        message: "Quantity must be greater than zero."
      };
    }

    const book = books.find(
      (item) => item.id === Number(bookId)
    );

    if (!book) {
      return {
        success: false,
        message: "Book not found."
      };
    }

    if (
      type === "Borrow" &&
      book.quantity < quantity
    ) {
      return {
        success: false,
        message: "Not enough stock available."
      };
    }

    setBooks((currentBooks) =>
      currentBooks.map((item) =>
        item.id === Number(bookId)
          ? {
              ...item,
              quantity:
                type === "Add Stock"
                  ? item.quantity + quantity
                  : item.quantity - quantity
            }
          : item
      )
    );

    const newTransaction = {
      id: Date.now(),
      bookId: book.id,
      bookTitle: book.title,
      type,
      amount: quantity,
      user: currentUser
        ? currentUser.name
        : "Unknown",
      date: new Date().toLocaleString()
    };

    setTransactions((currentTransactions) => [
      newTransaction,
      ...currentTransactions
    ]);

    return {
      success: true
    };
  };

  const handleAddUser = (userData) => {
    const exists = users.some(
      (user) =>
        user.membershipId.toLowerCase() ===
        userData.membershipId
          .trim()
          .toLowerCase()
    );

    if (exists) {
      return {
        success: false,
        message: "Membership ID already exists."
      };
    }

    const newUser = {
      id: Date.now(),
      name: userData.name.trim(),
      membershipId:
        userData.membershipId.trim(),
      role: userData.role,
      password: userData.password
    };

    setUsers((currentUsers) => [
      ...currentUsers,
      newUser
    ]);

    return {
      success: true
    };
  };

  const handleUpdateUser = (id, userData) => {
    const exists = users.some(
      (user) =>
        user.id !== id &&
        user.membershipId.toLowerCase() ===
          userData.membershipId
            .trim()
            .toLowerCase()
    );

    if (exists) {
      return {
        success: false,
        message: "Membership ID already exists."
      };
    }

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              name: userData.name.trim(),
              membershipId:
                userData.membershipId.trim(),
              role: userData.role,
              password: userData.password
            }
          : user
      )
    );

    if (currentUser?.id === id) {
      setCurrentUser((current) => ({
        ...current,
        name: userData.name.trim(),
        membershipId:
          userData.membershipId.trim(),
        role: userData.role,
        password: userData.password
      }));
    }

    return {
      success: true
    };
  };

  const handleDeleteUser = (id) => {
    if (currentUser?.id === id) {
      return;
    }

    setUsers((currentUsers) =>
      currentUsers.filter((user) => user.id !== id)
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            currentUser ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <>
                <Navbar
                  currentUser={currentUser}
                  onLogout={handleLogout}
                />

                <Dashboard
                  books={books}
                  users={users}
                />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/books"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <>
                <Navbar
                  currentUser={currentUser}
                  onLogout={handleLogout}
                />

                <Books
                  books={books}
                  onAddBook={handleAddBook}
                  onUpdateBook={handleUpdateBook}
                  onDeleteBook={handleDeleteBook}
                />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <>
                <Navbar
                  currentUser={currentUser}
                  onLogout={handleLogout}
                />

                <Transactions
                  books={books}
                  transactions={transactions}
                  onTransaction={handleTransaction}
                />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute currentUser={currentUser}>
              {currentUser?.role === "Admin" ? (
                <>
                  <Navbar
                    currentUser={currentUser}
                    onLogout={handleLogout}
                  />

                  <Users
                    users={users}
                    onAddUser={handleAddUser}
                    onUpdateUser={handleUpdateUser}
                    onDeleteUser={handleDeleteUser}
                  />
                </>
              ) : (
                <Navigate to="/" replace />
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;