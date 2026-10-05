function Dashboard({ books, users }) {
  const totalTitles = books.length;

  const totalCopies = books.reduce(
    (total, book) => total + Number(book.quantity),
    0
  );

  const lowStockBooks = books.filter(
    (book) => Number(book.quantity) < 2
  );

  return (
    <main className="page-container">
      <div className="page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>
            Overview of the Community Library.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Titles</span>
          <strong>{totalTitles}</strong>
        </div>

        <div className="stat-card">
          <span>Total Copies</span>
          <strong>{totalCopies}</strong>
        </div>

        <div className="stat-card warning-card">
          <span>Low Stock</span>
          <strong>{lowStockBooks.length}</strong>
        </div>

        <div className="stat-card">
          <span>Registered Users</span>
          <strong>{users.length}</strong>
        </div>
      </div>

      <section className="content-card">
        <div className="section-heading">
          <div>
            <h2>Book Availability</h2>
            <p>
              Current quantity of books in the library.
            </p>
          </div>
        </div>

        {books.length === 0 ? (
          <div className="empty-state">
            No books have been added yet.
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
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {books.map((book) => {
                  const lowStock =
                    Number(book.quantity) < 2;

                  return (
                    <tr
                      key={book.id}
                      className={
                        lowStock
                          ? "low-stock-row"
                          : ""
                      }
                    >
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.genre}</td>
                      <td>{book.isbn}</td>
                      <td>{book.quantity}</td>

                      <td>
                        <span
                          className={
                            lowStock
                              ? "status low-stock"
                              : "status available"
                          }
                        >
                          {lowStock
                            ? "Low Stock"
                            : "Available"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;