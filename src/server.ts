import express from 'express';

const app = express();

app.get('/heartbeat', (_, res) => {
  res.json({ ok: true });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
})