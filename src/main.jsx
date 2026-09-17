import React from "react";
import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import App from "./App";
import Login from "./Login";
import Admin from "./Admin";

function AppPrincipal() {
  return (
    <BrowserRouter>

      <Routes>

        {/* SITE DOS CONVIDADOS */}
        <Route
          path="/"
          element={<App />}
        />

        {/* LOGIN DO CASAL */}
        <Route
          path="/admin"
          element={<Login />}
        />

        {/* PAINEL DO CASAL */}
        <Route
          path="/admin/painel"
          element={<Admin />}
        />

        {/* QUALQUER ENDEREÇO INVÁLIDO */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <AppPrincipal />
  </React.StrictMode>
);