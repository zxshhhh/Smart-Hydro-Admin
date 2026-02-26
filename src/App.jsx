import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Analytics from "./pages/analytics";
import Users from "./pages/users";
import Plants from "./pages/plants";
import Settings from "./pages/settings";
import PrivateRoute from "./components/privateroute";
import MainLayout from "./layout/MainLayout";
import { useEffect } from "react";
import { initializeUsers } from "./services/userService";
import { initializePlants } from "./services/plantService";
import { startSimulation } from "./services/simulationService";
import { startIoTSimulation } from "./services/iotSimulationService";

function App() {
  useEffect(() => {
    initializeUsers();
    initializePlants();
    startSimulation();
    startIoTSimulation();
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/users" element={<Users />} />
            <Route path="/plants" element={<Plants />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
