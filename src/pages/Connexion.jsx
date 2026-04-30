import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { supabase } from "../supabase/config";

const messageErreur = (err) => {
  const msg = (err?.message || "").toLowerCase();
  if (msg.includes("invalid login") || msg.includes("invalid_credentials"))
    return "EMAIL OU MOT DE PASSE INCORRECT";
  if (msg.includes("email not confirmed")) return "EMAIL NON CONFIRME";
  if (msg.includes("network")) return "PAS DE CONNEXION INTERNET";
  if (msg.includes("rate limit") || msg.includes("too many"))
    return "TROP DE TENTATIVES, REESSAYEZ PLUS TARD";
  return `ERREUR : ${err?.message || "INCONNUE"}`;
};

const Connexion = () => {
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [enCours, setEnCours] = useState(false);

  const gererConnexion = async (e) => {
    e.preventDefault();
    if (!email.trim() || !mdp) {
      toast.error("VEUILLEZ REMPLIR TOUS LES CHAMPS");
      return;
    }
    setEnCours(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: mdp,
      });
      if (error) throw error;
      toast.success("CONNEXION REUSSIE");
    } catch (error) {
      console.error("[Connexion] Supabase error:", error);
      toast.error(messageErreur(error));
    } finally {
      setEnCours(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        padding: "1rem",
      }}
    >
      <form
        onSubmit={gererConnexion}
        style={{
          border: "1px solid #000",
          padding: "2rem",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2 style={{ marginBottom: "1.5rem", textAlign: "center", letterSpacing: "1px" }}>
          CONNEXION
        </h2>
        <input
          type="email"
          placeholder="EMAIL"
          required
          value={email}
          autoComplete="email"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "1rem",
            border: "1px solid #000",
          }}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="MOT DE PASSE"
          required
          value={mdp}
          autoComplete="current-password"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "1rem",
            border: "1px solid #000",
          }}
          onChange={(e) => setMdp(e.target.value)}
        />
        <button
          type="submit"
          disabled={enCours}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            cursor: enCours ? "not-allowed" : "pointer",
            opacity: enCours ? 0.6 : 1,
          }}
        >
          {enCours ? "CONNEXION..." : "ENTRER"}
        </button>
        <p style={{ marginTop: "1rem", fontSize: "0.8rem", textAlign: "center" }}>
          PAS DE COMPTE ?{" "}
          <Link to="/inscription" style={{ color: "#000", fontWeight: "bold" }}>
            S'INSCRIRE
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Connexion;
