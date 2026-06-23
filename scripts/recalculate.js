import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY); // Note: Anon key cannot do this if RLS blocks updates. But let's check.

async function forceRecalculate() {
  console.log("Forcing recalculation...");
  const { data, error } = await supabase.from('jogos').update({ status: 'PENDING_RECALC' }).eq('status', 'FINISHED').select('id');
  
  if (error) {
    console.error("Error setting PENDING_RECALC:", error.message);
    return;
  }
  
  console.log(`Updated ${data?.length || 0} games to PENDING_RECALC`);
  
  const { data: data2, error: error2 } = await supabase.from('jogos').update({ status: 'FINISHED' }).eq('status', 'PENDING_RECALC').select('id');
  if (error2) {
    console.error("Error setting FINISHED:", error2.message);
    return;
  }
  
  console.log(`Updated ${data2?.length || 0} games back to FINISHED. Recalculation complete!`);
}

forceRecalculate();
