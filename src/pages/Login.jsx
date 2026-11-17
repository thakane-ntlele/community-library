import { useState } from "react";

function Login({ onLogin }) {
  const [membershipId, setMembershipId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!membershipId.trim() || !password.trim()) {
      setError("Please enter your membership ID and password.");
      return;
    }

    const result = onLogin(
      membershipId.trim(),
      password
    );

    if (!result.success) {
      setError(result.message);
      return;
    }

    setError("");
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>Community Library</h1>
          <p>Library Management System</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="form-card"
        >
          <h2>Login</h2>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="membershipId">
              Membership ID
            </label>

            <input
              id="membershipId"
              type="text"
              value={membershipId}
              onChange={(event) =>
                setMembershipId(event.target.value)
              }
              placeholder="Enter membership ID"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="primary-button"
          >
            Login
          </button>
        </form>

        <div className="demo-login">
          <strong>Demo Admin Account</strong>
          <p>Membership ID: ADMIN001</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </main>
  );
}

export default Login;