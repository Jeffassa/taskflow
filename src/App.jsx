import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabase/config";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import TableauDeBord from "./pages/TableauDeBord";
import Navigation from "./composants/Navigation";

function App() {
  const [utilisateur, setUtilisateur] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    let monte = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!monte) return;
      setUtilisateur(session?.user ?? null);
      setChargement(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!monte) return;
      setUtilisateur(session?.user ?? null);
      setChargement(false);
    });

    return () => {
      monte = false;
      subscription.unsubscribe();
    };
  }, []);

  if (chargement) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          letterSpacing: "2px",
        }}
      >
        CHARGEMENT...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navigation utilisateur={utilisateur} />
      <Routes>
        <Route
          path="/connexion"
          element={!utilisateur ? <Connexion /> : <Navigate to="/" replace />}
        />
        <Route
          path="/inscription"
          element={!utilisateur ? <Inscription /> : <Navigate to="/" replace />}
        />
        <Route
          path="/"
          element={
            utilisateur ? (
              <TableauDeBord utilisateur={utilisateur} />
            ) : (
              <Navigate to="/connexion" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
