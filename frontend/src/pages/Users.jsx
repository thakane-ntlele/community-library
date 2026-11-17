
import { useEffect, useState } from "react";

function Users() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    membershipId: "",
    role: "Member"
  });

  async function loadUsers() {
    try {
      const response = await fetch("http://localhost:5000/users");

      if (!response.ok) throw new Error("Could not load users");

      setUsers(await response.json());
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const url = editingUser
      ? `http://localhost:5000/users/${editingUser.id}`
      : "http://localhost:5000/users";

    try {
      const response = await fetch(url, {
        method: editingUser ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "User operation failed");
      }

      setEditingUser(null);
      setFormData({ name: "", membershipId: "", role: "Member" });
      await loadUsers();
    } catch (error) {
      alert(error.message);
    }
  }

  function editUser(user) {
    setEditingUser(user);
    setFormData({
      name: user.name,
      membershipId: user.membershipId,
      role: user.role
    });
  }

  async function deleteUser(id) {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/users/${id}`, {
        method: "DELETE"
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not delete user");
      }

      await loadUsers();
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h1>User Management</h1>
          <p>Manage library members and their roles.</p>
        </div>
      </div>

      <div className="form-card">
        <h2>{editingUser ? "Update User" : "Add New User"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Membership ID</label>
              <input
                name="membershipId"
                value={formData.membershipId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-btn">
              {editingUser ? "Save Changes" : "Add User"}
            </button>

            {editingUser && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setEditingUser(null);
                  setFormData({
                    name: "",
                    membershipId: "",
                    role: "Member"
                  });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="section-card">
        <h2>Registered Users</h2>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Membership ID</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-message">
                    No registered users.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.membershipId}</td>
                    <td>{user.role}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => editUser(user)}
                        >
                          Update
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => deleteUser(user.id)}
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
      </div>
    </div>
  );
}

export default Users;
