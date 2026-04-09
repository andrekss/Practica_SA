const express = require('express');
const app = express();
app.use(express.json());

const tokens = {
  'token-admin': { active: true, userId: '11111111-1111-1111-1111-111111111111', username: 'admin', expiresInHours: 12 },
  'token-approver': { active: true, userId: '22222222-2222-2222-2222-222222222222', username: 'approver1', expiresInHours: 12 },
  'token-viewer': { active: true, userId: '33333333-3333-3333-3333-333333333333', username: 'viewer1', expiresInHours: 12 }
};

app.post('/oauth/introspect', (req, res) => {
  const token = req.body?.token;
  const data = tokens[token];
  if (!data) return res.json({ active: false });
  return res.json(data);
});

app.get('/health', (_, res) => res.json({ status: 'ok', service: 'oauth-mock' }));
app.listen(3010, () => console.log('oauth-mock running on 3010'));
