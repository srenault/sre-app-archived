const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const cors = require('cors');

app.use(cors());

app.get('/api/finance/accounts', (req, res) => {
  const data = fs.readFileSync('responses/finance/accounts.json', { encoding: 'utf-8' });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

app.get('/api/finance/accounts/:accountId', (req, res) => {
  const data = fs.readFileSync('responses/finance/account.json', { encoding: 'utf-8' });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

app.get('/api/finance/analytics', (req, res) => {
  const data = fs.readFileSync('responses/finance/analytics.json', { encoding: 'utf-8' });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

app.get('/api/finance/analytics/period/:periodDate', (req, res) => {
  const data = fs.readFileSync('responses/finance/analyticsPeriod.json', { encoding: 'utf-8' });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

app.get('/api/releases', (req, res) => {
  const data = fs.readFileSync('responses/releases/index.json', { encoding: 'utf-8' });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

app.listen(port, () => console.log(`Mock server listening on port ${port}!`));
