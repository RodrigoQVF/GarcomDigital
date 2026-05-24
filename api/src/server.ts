import express from 'express';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'tomando rindo' });
});

app.listen(PORT, '0.0.0.0', () => {});