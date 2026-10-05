import { useState } from "react";

function Transactions({
  books,
  transactions,
  onTransaction
}) {
  const [bookId, setBookId] = useState("");
  const [type, setType] = useState("Add Stock");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!bookId) {
      setError("Please select a book.");
      return;
    }

    if (!amount) {
      setError("Please enter a quantity.");
      return;
    }

    const quantity = Number(amount);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      setError(
        "Quantity must be a whole number greater than zero."
      );
      return;
    }

    const result = onTransaction(
      bookId,
      type,
      quantity
    );

    if (!result.success) {
      setError(result.message);
      return;
    }

    setBookId("");
    setAmount("");
    setType("Add Stock");
    setMessage(
      "Transaction recorded successfully."
    );
  };

  return (
    <main className="page-container">
      <div className="page-heading">
        <div>
          <h1>Transactions</h1>
          <p>
            Manage stock additions and book borrowing.
          </p>
        </div>
      </div>

      <section className="content-card">
        <div className="section-heading">
          <div>
            <h2>Record Transaction</h2>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="form-grid"
        >
          <div className="form-group">
            <label htmlFor="transaction-book">
              Book
            </label>

            <select
              id="transaction-book"
              value={bookId}
              onChange={(event) =>
                setBookId(event.target.value)
              }
            >
              <option value="">
                Select a book
              </option>

              {books.map((book) => (
                <option
                  key={book.id}
                  value={book.id}
                >
                  {book.title} - {book.quantity} available
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="transaction-type">
              Transaction Type
            </label>

            <select
              id="transaction-type"
              value={type}
              onChange={(event) =>
                setType(event.target.value)
              }
            >
              <option value="Add Stock">
                Add Stock
              </option>

              <option value="Borrow">
                Borrow / Deduct Stock
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="transaction-quantity">
              Quantity
            </label>

            <input
              id="transaction-quantity"
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
              placeholder="Quantity"
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="primary-button"
            >
              Record Transaction
            </button>
          </div>
        </form>
      </section>

      <section className="content-card">
        <div className="section-heading">
          <div>
            <h2>Current Stock</h2>
          </div>
        </div>

        {books.length === 0 ? (
          <div className="empty-state">
            No books are currently registered.
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Author</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {books.map((book) => {
                  const lowStock =
                    Number(book.quantity) < 2;

                  return (
                    <tr key={book.id}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
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

      <section className="content-card">
        <div className="section-heading">
          <div>
            <h2>Transaction History</h2>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="empty-state">
            No transactions have been recorded yet.
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Book</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Recorded By</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.date}</td>
                    <td>{transaction.bookTitle}</td>

                    <td>
                      <span
                        className={
                          transaction.type ===
                          "Borrow"
                            ? "status borrowed"
                            : "status stocked"
                        }
                      >
                        {transaction.type}
                      </span>
                    </td>

                    <td>{transaction.amount}</td>
                    <td>{transaction.user}</td>
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

export default Transactions;