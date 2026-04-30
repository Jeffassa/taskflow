const couleursPriorite = {
  haute: "#000",
  moyenne: "#666",
  basse: "#bbb",
};

const formaterEcheance = (iso) => {
  if (!iso) return "Aucune";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR");
};

const CarteTache = ({ tache, onSupprimer, onBasculer, onModifier }) => {
  const couleur = couleursPriorite[tache.priorite] || "#bbb";

  return (
    <div
      style={{
        borderLeft: `4px solid ${couleur}`,
        border: "1px solid #000",
        borderLeftWidth: "4px",
        borderLeftColor: couleur,
        padding: "1rem",
        marginBottom: "1rem",
        backgroundColor: tache.termine ? "#f2f2f2" : "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        <h3
          style={{
            textDecoration: tache.termine ? "line-through" : "none",
            fontSize: "1rem",
            wordBreak: "break-word",
          }}
        >
          {tache.titre}
        </h3>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => onBasculer(tache.id, tache.termine)}
            title={tache.termine ? "Marquer en cours" : "Marquer terminée"}
            style={{ border: "none", background: "none", cursor: "pointer" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
          <button
            onClick={() => onModifier(tache)}
            title="Modifier"
            style={{ border: "none", background: "none", cursor: "pointer" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>
            </svg>
          </button>
          <button
            onClick={() => onSupprimer(tache.id)}
            title="Supprimer"
            style={{ border: "none", background: "none", cursor: "pointer" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>

      {tache.description && (
        <p style={{ fontSize: "0.9rem", color: "#333", marginTop: "0.5rem", whiteSpace: "pre-wrap" }}>
          {tache.description}
        </p>
      )}

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginTop: "0.75rem",
          fontSize: "0.75rem",
          color: "#555",
          flexWrap: "wrap",
        }}
      >
        <span>ÉCHÉANCE : {formaterEcheance(tache.echeance)}</span>
        <span style={{ textTransform: "uppercase" }}>
          PRIORITÉ : {tache.priorite || "moyenne"}
        </span>
        <span>{tache.termine ? "TERMINÉE" : "EN COURS"}</span>
      </div>
    </div>
  );
};

export default CarteTache;
