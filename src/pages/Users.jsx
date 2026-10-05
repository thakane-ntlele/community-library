import { useState } from "react";

const emptyUser = {
  name: "",
  membershipId: "",
  role: "Member",
  password: ""
};

function Users({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser
}) {
  const [formData, setFormData] =
    useState(emptyUser);

  const [editingId, setEditingId] =
    useState(null);

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData(emptyUser);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.membershipId.trim() ||
      !formData.password.trim()
    ) {
      setError("Please complete all fields.");
      return;
    }

    let result;

    if (editingId !== null) {
      result = onUpdateUser(
        editingId,
        formData
      );
    } else {
      result = onAddUser(formData);
    }

    if (!result.success) {
      setError(result.message);
      return;
    }

    resetForm();
  };

  const handleEdit = (user) => {
    setEditingId(user.id);

    setFormData({
      name: user.name,
      membershipId: user.membershipId,
      role: user.role,
      password: user.password
    });

    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (confirmed) {
      onDeleteUser(id);
    }
  };

  return (
    <main className="page-container">
      <div className="page-heading">
        <div>
          <h1>User Management</h1>
          <p>
            Manage library members and administrators.
          </p>
        </div>
      </div>

      <section className="content-card">
        <div className="section-heading">
          <div>
            <h2>
              {editingId !== null
                ? "Update User"
                : "Add New User"}
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
            <label htmlFor="user-name">
              Name
            </label>

            <input
              id="user-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="membership-id">
              Membership ID
            </label>

            <input
              id="membership-id"
              name="membershipId"
              type="text"
              value={formData.membershipId}
              onChange={handleChange}
              placeholder="Membership ID"
            />
          </div>

          <div className="form-group">
            <label htmlFor="user-role">
              Role
            </label>

            <select
              id="user-role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Member">
                Member
              </option>

              <option value="Librarian">
                Librarian
              </option>

              <option value="Admin">
                Admin
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="user-password">
              Password
            </label>

            <input
              id="user-password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="primary-button"
            >
              {editingId !== null
                ? "Update User"
                : "Add User"}
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
            <h2>Registered Users</h2>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="empty-state">
            No users have been registered.
          </div>
        ) : (
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
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.membershipId}</td>

                    <td>
                      <span className="role-badge">
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="edit-button"
                          onClick={() =>
                            handleEdit(user)
                          }
                        >
                          Update
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            handleDelete(user.id)
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

export default Users;