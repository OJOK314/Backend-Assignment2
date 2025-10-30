const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();
app.use(express.json());
app.use(cors());

// Load swagger.yaml
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => res.send('Welcome to the User Management API!'));

// CRUD routes (simple mock data)
let users = [
  { id: 1, name: 'Alfred' },
  { id: 2, name: 'Chris' },
];

app.get('/users', (req, res) => res.json(users));
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send('User not found');
  res.json(user);
});
app.post('/users', (req, res) => {
  const newUser = { id: users.length + 1, name: req.body.name };
  users.push(newUser);
  res.status(201).json(newUser);
});
app.put('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send('User not found');
  user.name = req.body.name;
  res.json(user);
});
app.delete('/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send('User not found');
  const deleted = users.splice(index, 1);
  res.json(deleted);
});

const PORT = 1000;
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}/api-docs`)
);
