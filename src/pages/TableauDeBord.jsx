import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import {
  recupererTaches,
  ajouterTache,
  modifierTache,
  supprimerTache,
  basculerStatutTache,
} from "../supabase/services";
import CarteTache from "../composants/CarteTache";
import FormulaireTache from "../composants/FormulaireTache";

const poidsPriorite = { haute: 3, moyenne: 2, basse: 1 };

const messageErreurDb = (err) => {
  const msg = (err?.message || "").toLowerCase();
  if (msg.includes("row-level security") || msg.includes("rls"))
    return "ACCES REFUSE (POLITIQUE RLS)";
  if (msg.includes("jwt") || msg.includes("session"))
    return "SESSION EXPIREE, RECONNECTEZ-VOUS";
  if (msg.includes("network") || msg.includes("fetch"))
    return "PAS DE CONNEXION INTERNET";
  if (msg.includes("does not exist") || msg.includes("relation"))
    return "TABLE 'taches' INTROUVABLE (SCHEMA NON APPLIQUE)";
  return `ERREUR : ${err?.message || "INCONNUE"}`;
};

const TableauDeBord = ({ utilisateur }) => {
  const [taches, setTaches] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [recherche, setRecherche] = useState("");
  const [filtre, setFiltre] = useState("toutes");
  const [tri, setTri] = useState("creation");
  const [tacheEnEdition, setTacheEnEdition] = useState(null);

  const rechargerTaches = async () => {
    if (!utilisateur) return;
    try {
      const data = await recupererTaches(utilisateur.id);
      setTaches(data);
    } catch (err) {
      console.error("[Supabase] recupererTaches:", err);
      toast.error(messageErreurDb(err));
    }
  };

  useEffect(() => {
    let annule = false;
    (async () => {
      if (!utilisateur) return;
      try {
        const data = await recupererTaches(utilisateur.id);
        if (!annule) setTaches(data);
      } catch (err) {
        console.error("[Supabase] recupererTaches:", err);
        if (!annule) toast.error(messageErreurDb(err));
      } finally {
        if (!annule) setChargement(false);
      }
    })();
    return () => {
      annule = true;
    };
  }, [utilisateur]);

  const gererSoumission = async (donnees) => {
    try {
      if (tacheEnEdition) {
        await modifierTache(tacheEnEdition.id, donnees);
        toast.success("TACHE MODIFIEE");
        setTacheEnEdition(null);
      } else {
        await ajouterTache(utilisateur.id, donnees);
        toast.success("TACHE AJOUTEE");
      }
      await rechargerTaches();
    } catch (err) {
      console.error("[Supabase] enregistrer tache:", err);
      toast.error(messageErreurDb(err));
    }
  };

  const gererSuppression = async (id) => {
    if (!window.confirm("Supprimer cette tache ?")) return;
    try {
      await supprimerTache(id);
      toast.success("TACHE SUPPRIMEE");
      await rechargerTaches();
    } catch (err) {
      console.error("[Supabase] supprimer tache:", err);
      toast.error(messageErreurDb(err));
    }
  };

  const gererBascule = async (id, statutActuel) => {
    try {
      await basculerStatutTache(id, statutActuel);
      await rechargerTaches();
    } catch (err) {
      console.error("[Supabase] basculer statut:", err);
      toast.error(messageErreurDb(err));
    }
  };

  const tachesAffichees = useMemo(() => {
    let liste = taches.filter((t) =>
      (t.titre || "").toLowerCase().includes(recherche.toLowerCase())
    );
    if (filtre === "en cours") liste = liste.filter((t) => !t.termine);
    if (filtre === "terminees") liste = liste.filter((t) => t.termine);

    if (tri === "echeance") {
      liste = [...liste].sort((a, b) => {
        if (!a.echeance) return 1;
        if (!b.echeance) return -1;
        return a.echeance.localeCompare(b.echeance);
      });
    } else if (tri === "priorite") {
      liste = [...liste].sort(
        (a, b) => (poidsPriorite[b.priorite] || 0) - (poidsPriorite[a.priorite] || 0)
      );
    }
    return liste;
  }, [taches, recherche, filtre, tri]);

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}>
      <FormulaireTache
        key={tacheEnEdition ? tacheEnEdition.id : "nouveau"}
        tacheInitiale={tacheEnEdition}
        onSoumettre={gererSoumission}
        onAnnuler={() => setTacheEnEdition(null)}
      />

      <input
        type="text"
        placeholder="Rechercher une tache..."
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          border: "1px solid #000",
          marginBottom: "1rem",
        }}
      />

      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        {[
          { v: "toutes", l: "TOUTES" },
          { v: "en cours", l: "EN COURS" },
          { v: "terminees", l: "TERMINEES" },
        ].map((f) => (
          <button
            key={f.v}
            onClick={() => setFiltre(f.v)}
            style={{
              backgroundColor: filtre === f.v ? "#000" : "#fff",
              color: filtre === f.v ? "#fff" : "#000",
              border: "1px solid #000",
              padding: "5px 15px",
              cursor: "pointer",
              fontSize: "0.8rem",
            }}
          >
            {f.l}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <label htmlFor="tri" style={{ fontSize: "0.8rem" }}>
          TRIER PAR :
        </label>
        <select
          id="tri"
          value={tri}
          onChange={(e) => setTri(e.target.value)}
          style={{ padding: "6px 10px", border: "1px solid #000" }}
        >
          <option value="creation">Date de création</option>
          <option value="echeance">Échéance</option>
          <option value="priorite">Priorité</option>
        </select>
      </div>

      {chargement ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>CHARGEMENT...</div>
      ) : tachesAffichees.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            border: "1px dashed #999",
            color: "#666",
          }}
        >
          AUCUNE TACHE A AFFICHER
        </div>
      ) : (
        tachesAffichees.map((t) => (
          <CarteTache
            key={t.id}
            tache={t}
            onSupprimer={gererSuppression}
            onBasculer={gererBascule}
            onModifier={(tache) => {
              setTacheEnEdition(tache);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        ))
      )}
    </div>
  );
};

export default TableauDeBord;
