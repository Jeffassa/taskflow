import { toast } from "react-toastify";
import { supabase } from "../supabase/config";

const Navigation = ({ utilisateur }) => {
  const gererDeconnexion = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("DECONNEXION REUSSIE");
    } catch {
      toast.error("ERREUR DE DECONNEXION");
    }
  };

  return (
    <nav
      style={{
        borderBottom: "1px solid #000",
        padding: "1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "0.5rem",
        backgroundColor: "#fff",
        color: "#000",
      }}
    >
      <h1 style={{ fontSize: "1.2rem", fontWeight: "bold", letterSpacing: "2px" }}>
        TASKFLOW
      </h1>
      {utilisateur && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.8rem", color: "#555" }}>{utilisateur.email}</span>
          <button
            onClick={gererDeconnexion}
            style={{
              background: "none",
              border: "1px solid #000",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            DECONNEXION
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
