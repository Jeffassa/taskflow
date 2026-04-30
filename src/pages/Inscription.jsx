import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { supabase } from "../supabase/config";

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const messageErreur = (err) => {
  const msg = (err?.message || "").toLowerCase();
  if (msg.includes("already registered") || msg.includes("already exists"))
    return "CET EMAIL EST DEJA UTILISE";
  if (msg.includes("invalid email")) return "EMAIL INVALIDE";
  if (msg.includes("password") && msg.includes("6")) return "MOT DE PASSE TROP COURT (MIN 6)";
  if (msg.includes("weak")) return "MOT DE PASSE TROP FAIBLE";
  if (msg.includes("network")) return "PAS DE CONNEXION INTERNET";
  if (msg.includes("rate limit") || msg.includes("too many"))
    return "TROP DE TENTATIVES, REESSAYEZ PLUS TARD";
  return `ERREUR : ${err?.message || "INCONNUE"}`;
};

const Inscription = () => {
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [enCours, setEnCours] = useState(false);

  const gererInscription = async (e) => {
    e.preventDefault();
    if (!REGEX_EMAIL.test(email.trim())) {
      toast.error("EMAIL INVALIDE");
      return;
    }
    if (mdp.length < 6) {
      toast.error("MOT DE PASSE : MIN 6 CARACTERES");
      return;
    }
    if (mdp !== confirmation) {
      toast.error("LES MOTS DE PASSE NE CORRESPONDENT PAS");
      return;
    }
    setEnCours(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: mdp,
      });
      if (error) throw error;
      if (data?.user && !data.session) {
        toast.info("VERIFIEZ VOTRE EMAIL POUR CONFIRMER LE COMPTE");
      } else {
        toast.success("COMPTE CREE");
      }
    } catch (error) {
      console.error("[Inscription] Supabase error:", error);
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
        onSubmit={gererInscription}
        style={{
          border: "1px solid #000",
          padding: "2rem",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2 style={{ marginBottom: "1.5rem", textAlign: "center", letterSpacing: "1px" }}>
          INSCRIPTION
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
          placeholder="MOT DE PASSE (MIN 6)"
          required
          value={mdp}
          autoComplete="new-password"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "1rem",
            border: "1px solid #000",
          }}
          onChange={(e) => setMdp(e.target.value)}
        />
        <input
          type="password"
          placeholder="CONFIRMER LE MOT DE PASSE"
          required
          value={confirmation}
          autoComplete="new-password"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "1.5rem",
            border: "1px solid #000",
          }}
          onChange={(e) => setConfirmation(e.target.value)}
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
          {enCours ? "CREATION..." : "CREER MON COMPTE"}
        </button>
        <p style={{ marginTop: "1rem", fontSize: "0.8rem", textAlign: "center" }}>
          DEJA UN COMPTE ?{" "}
          <Link to="/connexion" style={{ color: "#000", fontWeight: "bold" }}>
            SE CONNECTER
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Inscription;
