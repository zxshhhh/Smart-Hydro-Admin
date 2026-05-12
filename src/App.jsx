import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Users from "./pages/users";
import Plants from "./pages/plants";
import MainLayout from "./layout/MainLayout";
import ProtectedRoute from "./components/protectedRoute";
import { useEffect } from "react";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
            <Route path="/plants" element={<ProtectedRoute><Plants /></ProtectedRoute>} />
          </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
