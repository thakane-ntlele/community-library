import { useState } from "react";

const emptyBook = {
  title: "",
  author: "",
  genre: "",
  isbn: "",
  quantity: ""
};

function Books({
  books,
  onAddBook,
  onUpdateBook,
  onDeleteBook
}) {
  const [formData, setFormData] =
    useState(emptyBook);

  const [editingId, setEditingId] =
    useState(null);

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData(emptyBook);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.author.trim() ||
      !formData.genre.trim() ||
      !formData.isbn.trim() ||
      formData.quantity === ""
    ) {
      setError("Please complete all fields.");
      return;
    }

    const quantity = Number(formData.quantity);

    if (!Number.isInteger(quantity) || quantity < 0) {
      setError(
        "Quantity must be a whole number greater than or equal to zero."
      );
      return;
    }

    if (editingId !== null) {
      onUpdateBook(editingId, {
        ...formData,
        quantity
      });
    } else {
      onAddBook({
        ...formData,
        quantity
      });
    }

    resetForm();
  };

  const handleEdit = (book) => {
    setEditingId(book.id);

    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      isbn: book.isbn,
      quantity: String(book.quantity)
    });

    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (confirmed) {
      onDeleteBook(id);
    }
  };

  const searchText = search.trim().toLowerCase();

  const filteredBooks = books.filter((book) => {
    return (
      book.title.toLowerCase().includes(searchText) ||
      book.author.toLowerCase().includes(searchText) ||
      book.genre.toLowerCase().includes(searchText) ||
      book.isbn.toLowerCase().includes(searchText)
    );
  });

  return (
    <main className="page-container">
      <div className="page-heading">
        <div>
          <h1>Book Management</h1>
          <p>
            Add, update, search and remove books.
          </p>
        </div>
      </div>

      <section className="content-card">
        <div className="section-heading">
          <div>
            <h2>
              {editingId !== null
                ? "Update Book"
                : "Add New Book"}
            </h2>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="form-grid"
        >
          <div className="form-group">
            <label htmlFor="title">Title</label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Book title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Author</label>

            <input
              id="author"
              name="author"
              type="text"
              value={formData.author}
              onChange={handleChange}
              placeholder="Author name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="genre">Genre</label>

            <input
              id="genre"
              name="genre"
              type="text"
              value={formData.genre}
              onChange={handleChange}
              placeholder="Genre"
            />
          </div>

          <div className="form-group">
            <label htmlFor="isbn">ISBN</label>

            <input
              id="isbn"
              name="isbn"
              type="text"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="ISBN"
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">
              Quantity
            </label>

            <input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              step="1"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Quantity"
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="primary-button"
            >
              {editingId !== null
                ? "Update Book"
                : "Add Book"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="content-card">
        <div className="section-heading">
          <div>
            <h2>Book List</h2>
          </div>

          <input
            className="search-input"
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search books..."
          />
        </div>

        {filteredBooks.length === 0 ? (
          <div className="empty-state">
            No books match your search.
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>ISBN</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.genre}</td>
                    <td>{book.isbn}</td>
                    <td>{book.quantity}</td>

                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="edit-button"
                          onClick={() =>
                            handleEdit(book)
                          }
                        >
                          Update
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            handleDelete(book.id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default Books;