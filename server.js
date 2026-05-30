import express from 'express';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  { realtime: { transport: ws } }
);

// POST /api/waitlist – E-Mail eintragen
app.post('/api/waitlist', async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Ungültige E-Mail-Adresse' });
  }

  const { data, error } = await supabase
    .from('waitlist')
    .insert([{ email: email.toLowerCase().trim(), source: 'website' }])
    .select();

  if (error) {
    if (error.code === '23505') {
      return res.status(200).json({ success: true, message: 'Du bist bereits auf der Warteliste!' });
    }
    console.error('Supabase error:', error);
    return res.status(500).json({ error: 'Eintrag fehlgeschlagen. Bitte nochmal versuchen.' });
  }

  return res.status(200).json({ success: true, message: 'Erfolgreich eingetragen!' });
});

// GET /api/waitlist/count – Anzahl der Einträge
app.get('/api/waitlist/count', async (req, res) => {
  const { count, error } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true });

  if (error) return res.status(500).json({ error: error.message });
  return res.json({ count: count || 0 });
});

// SPA Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`TierTreu läuft auf Port ${PORT}`));
