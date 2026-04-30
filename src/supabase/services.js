import { supabase } from "./config";

const TABLE = "taches";

// Convertit une ligne Postgres (snake_case) en objet camelCase pour les composants.
const versTache = (row) => ({
  id: row.id,
  userId: row.user_id,
  titre: row.titre,
  description: row.description ?? "",
  echeance: row.echeance ?? "",
  priorite: row.priorite ?? "moyenne",
  termine: !!row.termine,
  creeLe: row.cree_le,
});

export const ajouterTache = async (userId, donnees) => {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      user_id: userId,
      titre: donnees.titre,
      description: donnees.description || "",
      echeance: donnees.echeance || "",
      priorite: donnees.priorite || "moyenne",
      termine: false,
    })
    .select()
    .single();
  if (error) throw error;
  return versTache(data);
};

export const recupererTaches = async (userId) => {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("user_id", userId)
    .order("cree_le", { ascending: false });
  if (error) throw error;
  return (data || []).map(versTache);
};

export const modifierTache = async (id, donnees) => {
  const payload = {};
  if (donnees.titre !== undefined) payload.titre = donnees.titre;
  if (donnees.description !== undefined) payload.description = donnees.description;
  if (donnees.echeance !== undefined) payload.echeance = donnees.echeance;
  if (donnees.priorite !== undefined) payload.priorite = donnees.priorite;
  const { error } = await supabase.from(TABLE).update(payload).eq("id", id);
  if (error) throw error;
};

export const supprimerTache = async (id) => {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
};

export const basculerStatutTache = async (id, statutActuel) => {
  const { error } = await supabase
    .from(TABLE)
    .update({ termine: !statutActuel })
    .eq("id", id);
  if (error) throw error;
};
