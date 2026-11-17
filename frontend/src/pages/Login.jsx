
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [membershipId, setMembershipId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ membershipId })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      sessionStorage.setItem("libraryUser", JSON.stringify(result.user));
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">CL</div>
        <h1>Community Library</h1>
        <p>Sign in using your membership ID.</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Membership ID</label>
            <input
              type="text"
              value={membershipId}
              onChange={(e) => setMembershipId(e.target.value)}
              placeholder="Enter your membership ID"
              required
            />
          </div>

          <div className="demo-login-info">
            <strong>Demo Administrator Account</strong>
            <p>Membership ID: ADMIN001</p>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="primary-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
