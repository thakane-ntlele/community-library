
function BookList({ books, onEdit, onDelete }) {
  return (
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
          {books.length === 0 ? (
            <tr>
              <td colSpan="6" className="empty-message">
                No books available.
              </td>
            </tr>
          ) : (
            books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.isbn}</td>
                <td>
                  <span className={book.quantity < 2 ? "low-stock" : ""}>
                    {book.quantity}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => onEdit(book)}
                    >
                      Update
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => onDelete(book.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BookList;
