
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import RutaProtegida from "./components/RutaProtegida";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <RutaProtegida>
                <Dashboard />
              </RutaProtegida>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
