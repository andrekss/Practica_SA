const express = require('express');
const app = express();
app.use(express.json());

const processed = [];
app.post('/finance/process', (req, res) => {
  const record = { ...req.body, processedAt: new Date().toISOString() };
  processed.push(record);
  return res.json({ status: 'accepted', record });
});

app.get('/finance/history', (_, res) => res.json({ items: processed }));
app.get('/health', (_, res) => res.json({ status: 'ok', service: 'finance-mock' }));
app.listen(3011, () => console.log('finance-mock running on 3011'));
