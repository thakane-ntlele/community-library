
import { useEffect, useState } from "react";

function Transactions() {
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    bookId: "",
    type: "add",
    quantity: 1
  });

  async function loadData() {
    try {
      const [booksResponse, transactionsResponse] = await Promise.all([
        fetch("http://localhost:5000/books"),
        fetch("http://localhost:5000/transactions")
      ]);

      if (!booksResponse.ok || !transactionsResponse.ok) {
        throw new Error("Could not load transaction data");
      }

      setBooks(await booksResponse.json());
      setTransactions(await transactionsResponse.json());
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.bookId || Number(formData.quantity) < 1) {
      alert("Select a book and enter a valid quantity.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          bookId: Number(formData.bookId),
          type: formData.type,
          quantity: Number(formData.quantity)
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Transaction failed");
      }

      alert("Transaction recorded successfully.");

      setFormData({
        bookId: "",
        type: "add",
        quantity: 1
      });

      await loadData();
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h1>Transactions</h1>
          <p>Manage book stock and borrowing records.</p>
        </div>
      </div>

      <div className="form-card">
        <h2>Record a Transaction</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Select Book</label>
              <select
                value={formData.bookId}
                onChange={(e) =>
                  setFormData({ ...formData, bookId: e.target.value })
                }
                required
              >
                <option value="">Choose a book</option>
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} (Stock: {book.quantity})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Transaction Type</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="add">Add Stock</option>
                <option value="borrow">Borrow Book</option>
              </select>
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                required
              />
            </div>
          </div>

          <button type="submit" className="primary-btn">
            Record Transaction
          </button>
        </form>
      </div>

      <div className="section-card">
        <h2>Transaction History</h2>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Transaction Type</th>
                <th>Quantity</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-message">
                    No transactions recorded.
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.bookTitle}</td>
                    <td>{transaction.type}</td>
                    <td>{transaction.quantity}</td>
                    <td>
                      {new Date(transaction.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Transactions;
