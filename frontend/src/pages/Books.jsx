
import { useEffect, useState } from "react";
import AddBookForm from "../components/AddBookForm";
import BookList from "../components/BookList";

function Books() {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchBooks() {
    try {
      const response = await fetch("http://localhost:5000/books");

      if (!response.ok) throw new Error("Failed to fetch books");

      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  async function handleSubmit(bookData) {
    const url = editingBook
      ? `http://localhost:5000/books/${editingBook.id}`
      : "http://localhost:5000/books";

    try {
      const response = await fetch(url, {
        method: editingBook ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bookData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Book operation failed");
      }

      setEditingBook(null);
      await fetchBooks();
      alert(editingBook ? "Book updated successfully." : "Book added successfully.");
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/books/${id}`, {
        method: "DELETE"
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not delete book");
      }

      await fetchBooks();
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h1>Book Management</h1>
          <p>Add, update and manage library books.</p>
        </div>
      </div>

      <AddBookForm
        onSubmit={handleSubmit}
        editingBook={editingBook}
        onCancel={() => setEditingBook(null)}
      />

      <div className="section-card">
        <h2>Library Books</h2>

        {loading ? (
          <p>Loading books...</p>
        ) : (
          <BookList
            books={books}
            onEdit={setEditingBook}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}

export default Books;
