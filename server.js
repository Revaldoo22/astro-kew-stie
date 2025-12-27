import express from 'express';
import { handler as ssrHandler } from './dist/server/entry.mjs';

const PORT = 30069

const app = express();
// Change this based on your astro.config.mjs, `base` option.
// They should match. The default value is "/".
const base = '/';


app.use(base, express.static('dist/client/'));
app.use(ssrHandler);

// Middleware untuk menangani 404
app.use((req, res) => {
  res.status(404).redirect('/404');
});

// Middleware untuk menangani error
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).redirect('/500');
});

app.listen(PORT, () => {
    console.log("App Started on port", PORT)
});


