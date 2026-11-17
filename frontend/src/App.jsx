
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users";
import Login from "./pages/Login";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/books" element={<Books />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
