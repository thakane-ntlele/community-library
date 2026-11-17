
import { useEffect, useState } from "react";

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/books")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load books");
        return response.json();
      })
      .then((data) => setBooks(data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const totalBooks = books.length;
  const totalCopies = books.reduce(
    (total, book) => total + Number(book.quantity),
    0
  );
  const lowStock = books.filter(
    (book) => Number(book.quantity) < 2
  ).length;

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Community Library Management Overview</p>
        </div>
      </div>

      {loading ? (
        <p>Loading books...</p>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Book Titles</h3>
              <p>{totalBooks}</p>
            </div>

            <div className="stat-card">
              <h3>Total Copies in Stock</h3>
              <p>{totalCopies}</p>
            </div>

            <div className="stat-card warning-card">
              <h3>Low Stock Books</h3>
              <p>{lowStock}</p>
            </div>
          </div>

          <div className="section-card">
            <h2>Current Book Availability</h2>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Genre</th>
                    <th>Available Copies</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {books.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-message">
                        No books have been added yet.
                      </td>
                    </tr>
                  ) : (
                    books.map((book) => (
                      <tr key={book.id}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.genre}</td>
                        <td>{book.quantity}</td>
                        <td>
                          <span className={
                            Number(book.quantity) < 2
                              ? "status-low"
                              : "status-available"
                          }>
                            {Number(book.quantity) < 2
                              ? "Low Stock"
                              : "Available"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
