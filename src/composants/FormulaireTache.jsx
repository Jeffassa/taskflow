import { useState } from "react";
import { toast } from "react-toastify";

const valeursParDefaut = {
  titre: "",
  description: "",
  echeance: "",
  priorite: "moyenne",
};

const valeursDepuisTache = (tache) =>
  tache
    ? {
        titre: tache.titre || "",
        description: tache.description || "",
        echeance: tache.echeance || "",
        priorite: tache.priorite || "moyenne",
      }
    : valeursParDefaut;

const FormulaireTache = ({ tacheInitiale, onSoumettre, onAnnuler }) => {
  const [donnees, setDonnees] = useState(() => valeursDepuisTache(tacheInitiale));
  const [enCours, setEnCours] = useState(false);

  const gererChangement = (e) => {
    setDonnees((d) => ({ ...d, [e.target.name]: e.target.value }));
  };

  const gererSoumission = async (e) => {
    e.preventDefault();
    if (!donnees.titre.trim()) {
      toast.error("LE TITRE EST OBLIGATOIRE");
      return;
    }
    setEnCours(true);
    try {
      await onSoumettre(donnees);
      setDonnees(valeursParDefaut);
    } finally {
      setEnCours(false);
    }
  };

  return (
    <form
      onSubmit={gererSoumission}
      style={{
        border: "1px solid #000",
        padding: "1.5rem",
        marginBottom: "1.5rem",
        background: "#fff",
      }}
    >
      <h3 style={{ marginBottom: "1rem", letterSpacing: "1px" }}>
        {tacheInitiale ? "MODIFIER LA TACHE" : "NOUVELLE TACHE"}
      </h3>

      <input
        name="titre"
        value={donnees.titre}
        onChange={gererChangement}
        placeholder="TITRE *"
        required
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "0.75rem",
          border: "1px solid #000",
        }}
      />

      <textarea
        name="description"
        value={donnees.description}
        onChange={gererChangement}
        placeholder="DESCRIPTION"
        rows={3}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "0.75rem",
          border: "1px solid #000",
          resize: "vertical",
        }}
      />

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
        <input
          type="date"
          name="echeance"
          value={donnees.echeance}
          onChange={gererChangement}
          style={{ flex: "1 1 160px", padding: "10px", border: "1px solid #000" }}
        />
        <select
          name="priorite"
          value={donnees.priorite}
          onChange={gererChangement}
          style={{ flex: "1 1 160px", padding: "10px", border: "1px solid #000" }}
        >
          <option value="basse">PRIORITE BASSE</option>
          <option value="moyenne">PRIORITE MOYENNE</option>
          <option value="haute">PRIORITE HAUTE</option>
        </select>
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          type="submit"
          disabled={enCours}
          style={{
            flex: 1,
            padding: "10px",
            background: "#000",
            color: "#fff",
            border: "none",
            cursor: enCours ? "not-allowed" : "pointer",
            opacity: enCours ? 0.6 : 1,
          }}
        >
          {enCours ? "ENREGISTREMENT..." : tacheInitiale ? "ENREGISTRER" : "AJOUTER"}
        </button>
        {tacheInitiale && (
          <button
            type="button"
            onClick={onAnnuler}
            style={{
              flex: 1,
              padding: "10px",
              background: "#fff",
              color: "#000",
              border: "1px solid #000",
              cursor: "pointer",
            }}
          >
            ANNULER
          </button>
        )}
      </div>
    </form>
  );
};

export default FormulaireTache;
