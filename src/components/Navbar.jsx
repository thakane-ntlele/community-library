import { NavLink } from "react-router-dom";

function Navbar({ currentUser, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>Community Library</h2>
        <span>Library Management System</span>
      </div>

      <div className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/books"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Books
        </NavLink>

        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Transactions
        </NavLink>

        {currentUser?.role === "Admin" && (
          <NavLink
            to="/users"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Users
          </NavLink>
        )}
      </div>

      <div className="nav-user">
        <div>
          <strong>{currentUser?.name}</strong>
          <span className="role-badge">
            {currentUser?.role}
          </span>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;