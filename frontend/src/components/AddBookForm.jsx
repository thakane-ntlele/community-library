
import { useEffect, useState } from "react";

function AddBookForm({ onSubmit, editingBook, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    isbn: "",
    quantity: 1
  });

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        author: editingBook.author,
        genre: editingBook.genre,
        isbn: editingBook.isbn,
        quantity: editingBook.quantity
      });
    } else {
      setFormData({
        title: "",
        author: "",
        genre: "",
        isbn: "",
        quantity: 1
      });
    }
  }, [editingBook]);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "quantity" ? value : value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.author.trim() ||
      !formData.genre.trim() ||
      !formData.isbn.trim() ||
      formData.quantity === "" ||
      Number(formData.quantity) < 0
    ) {
      alert("Please complete all fields correctly.");
      return;
    }

    onSubmit({
      ...formData,
      quantity: Number(formData.quantity)
    });

    setFormData({
      title: "",
      author: "",
      genre: "",
      isbn: "",
      quantity: 1
    });
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>{editingBook ? "Update Book" : "Add New Book"}</h2>

      <div className="form-grid">
        <div className="form-group">
          <label>Book Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Genre</label>
          <input
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>ISBN</label>
          <input
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Initial Quantity</label>
          <input
            type="number"
            name="quantity"
            min="0"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="primary-btn">
          {editingBook ? "Save Changes" : "Add Book"}
        </button>

        {editingBook && (
          <button
            type="button"
            className="cancel-btn"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default AddBookForm;
