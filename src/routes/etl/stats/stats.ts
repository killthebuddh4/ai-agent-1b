import { supabase } from "../../../lib/supabase.js";

export const stats = async () => {
  const count = await supabase
    .from("files")
    .select("id", { count: "exact", head: true });

  return {
    numFilesLoaded: count.count,
  };
};
