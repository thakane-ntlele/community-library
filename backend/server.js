require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Check database connection
app.get("/", (req, res) => {
    res.send("Community Library API is running.");
});

// GET all books
app.get("/books", async (req, res) => {
    try {
        const [books] = await db.query("SELECT * FROM books ORDER BY id DESC");
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ADD a book
app.post("/books", async (req, res) => {
    try {
        const { title, author, genre, isbn, quantity } = req.body;

        if (!title || !author || !genre || !isbn || quantity === undefined ||
            !Number.isInteger(Number(quantity)) || Number(quantity) < 0) {
            return res.status(400).json({ message: "Please provide valid book details." });
        }

        const [result] = await db.query(
            "INSERT INTO books (title, author, genre, isbn, quantity) VALUES (?, ?, ?, ?, ?)",
            [title, author, genre, isbn, Number(quantity)]
        );

        res.status(201).json({ message: "Book added successfully.", id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.code === "ER_DUP_ENTRY" ? "This ISBN already exists." : error.message });
    }
});

// UPDATE a book
app.put("/books/:id", async (req, res) => {
    try {
        const { title, author, genre, isbn, quantity } = req.body;

        if (!title || !author || !genre || !isbn || quantity === undefined ||
            !Number.isInteger(Number(quantity)) || Number(quantity) < 0) {
            return res.status(400).json({ message: "Please provide valid book details." });
        }

        const [result] = await db.query(
            "UPDATE books SET title = ?, author = ?, genre = ?, isbn = ?, quantity = ? WHERE id = ?",
            [title, author, genre, isbn, Number(quantity), req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found." });
        }

        res.json({ message: "Book updated successfully." });
    } catch (error) {
        res.status(500).json({ message: error.code === "ER_DUP_ENTRY" ? "This ISBN already exists." : error.message });
    }
});

// DELETE a book
app.delete("/books/:id", async (req, res) => {
    try {
        const [result] = await db.query(
            "DELETE FROM books WHERE id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found." });
        }

        res.json({ message: "Book deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Could not delete this book. It may have transaction records." });
    }
});

// GET all transactions
app.get("/transactions", async (req, res) => {
    try {
        const [transactions] = await db.query(`
            SELECT transactions.id, transactions.book_id AS bookId,
                   books.title AS bookTitle, transactions.type,
                   transactions.quantity, transactions.created_at AS createdAt
            FROM transactions
            INNER JOIN books ON transactions.book_id = books.id
            ORDER BY transactions.created_at DESC
        `);

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ADD a stock or borrowing transaction
app.post("/transactions", async (req, res) => {
    const connection = await db.getConnection();

    try {
        const { bookId, type, quantity } = req.body;
        const amount = Number(quantity);

        if (!bookId || !["add", "borrow"].includes(type) ||
            !Number.isInteger(amount) || amount < 1) {
            return res.status(400).json({ message: "Please provide valid transaction details." });
        }

        await connection.beginTransaction();

        const [books] = await connection.query(
            "SELECT * FROM books WHERE id = ? FOR UPDATE",
            [bookId]
        );

        if (books.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Book not found." });
        }

        const currentQuantity = Number(books[0].quantity);

        if (type === "borrow" && currentQuantity < amount) {
            await connection.rollback();
            return res.status(400).json({ message: "Not enough copies available." });
        }

        const newQuantity = type === "add"
            ? currentQuantity + amount
            : currentQuantity - amount;

        await connection.query(
            "UPDATE books SET quantity = ? WHERE id = ?",
            [newQuantity, bookId]
        );

        await connection.query(
            "INSERT INTO transactions (book_id, type, quantity) VALUES (?, ?, ?)",
            [bookId, type, amount]
        );

        await connection.commit();

        res.status(201).json({ message: "Transaction recorded successfully." });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: error.message });
    } finally {
        connection.release();
    }
});

// GET all users
app.get("/users", async (req, res) => {
    try {
        const [users] = await db.query(`
            SELECT id, name, membership_id AS membershipId, role
            FROM users ORDER BY id DESC
        `);

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ADD a user
app.post("/users", async (req, res) => {
    try {
        const { name, membershipId, role } = req.body;

        if (!name || !membershipId || !["Member", "Admin"].includes(role)) {
            return res.status(400).json({ message: "Please provide valid user details." });
        }

        const [result] = await db.query(
            "INSERT INTO users (name, membership_id, role) VALUES (?, ?, ?)",
            [name, membershipId, role]
        );

        res.status(201).json({ message: "User added successfully.", id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.code === "ER_DUP_ENTRY" ? "This membership ID already exists." : error.message });
    }
});

// UPDATE a user
app.put("/users/:id", async (req, res) => {
    try {
        const { name, membershipId, role } = req.body;

        if (!name || !membershipId || !["Member", "Admin"].includes(role)) {
            return res.status(400).json({ message: "Please provide valid user details." });
        }

        const [result] = await db.query(
            "UPDATE users SET name = ?, membership_id = ?, role = ? WHERE id = ?",
            [name, membershipId, role, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json({ message: "User updated successfully." });
    } catch (error) {
        res.status(500).json({ message: error.code === "ER_DUP_ENTRY" ? "This membership ID already exists." : error.message });
    }
});

// DELETE a user
app.delete("/users/:id", async (req, res) => {
    try {
        const [result] = await db.query(
            "DELETE FROM users WHERE id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json({ message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// LOGIN using membership ID
app.post("/users/login", async (req, res) => {
    try {
        const { membershipId } = req.body;

        const [users] = await db.query(
            "SELECT id, name, membership_id AS membershipId, role FROM users WHERE membership_id = ?",
            [membershipId]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid membership ID." });
        }

        res.json({ message: "Login successful.", user: users[0] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Community Library API running on port ${PORT}`);
});