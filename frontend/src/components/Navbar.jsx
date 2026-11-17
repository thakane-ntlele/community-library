
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="brand-icon">CL</span>
        <span>Community Library</span>
      </div>

      <div className="nav-links">
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/books">Books</NavLink>
        <NavLink to="/transactions">Transactions</NavLink>
        <NavLink to="/users">User Management</NavLink>
      </div>

      <button className="logout-btn" onClick={() => navigate("/login")}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
