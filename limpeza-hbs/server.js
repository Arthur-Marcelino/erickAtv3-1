// server.js  (ESM)
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { create } from 'express-handlebars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const DATA_PATH = path.join(__dirname, 'data', 'sample-data.json');

// Handlebars engine
const hbs = create({
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials')
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

function readData() {
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
}

function writeData(d) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(d, null, 2));
}

// Home
app.get('/', (req, res) => {
  res.render('index', { title: 'Painel - Limpeza de Casas', year: new Date().getFullYear() });
});

/* ===================== COMPANIES ===================== */

app.get('/companies', (req, res) => {
  const d = readData();
  res.render('companies', { title: 'Empresas', companies: d.companies, year: new Date().getFullYear() });
});

app.post('/companies', (req, res) => {
  const d = readData();
  const { id, name, contact, notes } = req.body;

  if (id) {
    const idx = d.companies.findIndex(c => c.id === id);
    if (idx >= 0) d.companies[idx] = { id, name, contact, notes };
  } else {
    const nid = 'c' + (d.companies.length + 1);
    d.companies.push({ id: nid, name, contact, notes });
  }

  writeData(d);
  res.redirect('/companies');
});

app.get('/companies/:id', (req, res) => {
  const d = readData();
  const selectedCompany = d.companies.find(c => c.id === req.params.id);
  res.render('companies', { title: 'Detalhes', selectedCompany, companies: d.companies, year: new Date().getFullYear() });
});

app.get('/companies/edit/:id', (req, res) => {
  const d = readData();
  const editCompany = d.companies.find(c => c.id === req.params.id);
  res.render('companies', { title: 'Editar Empresa', editCompany, companies: d.companies, year: new Date().getFullYear() });
});

app.post('/companies/delete/:id', (req, res) => {
  const d = readData();
  d.companies = d.companies.filter(c => c.id !== req.params.id);
  writeData(d);
  res.redirect('/companies');
});

/* ===================== HOUSES ===================== */

app.get('/houses', (req, res) => {
  const d = readData();
  res.render('houses', { title: 'Casas', houses: d.houses, year: new Date().getFullYear() });
});

app.post('/houses', (req, res) => {
  const d = readData();
  const { id, address, city, size, companyId } = req.body;

  if (id) {
    const idx = d.houses.findIndex(h => h.id === id);
    if (idx >= 0) d.houses[idx] = { id, address, city, size: Number(size), companyId };
  } else {
    const nid = 'h' + (d.houses.length + 1);
    d.houses.push({ id: nid, address, city, size: Number(size), companyId });
  }

  writeData(d);
  res.redirect('/houses');
});

app.get('/houses/:id', (req, res) => {
  const d = readData();
  const selectedHouse = d.houses.find(h => h.id === req.params.id);
  res.render('houses', { title: 'Detalhes', selectedHouse, houses: d.houses, year: new Date().getFullYear() });
});

app.get('/houses/edit/:id', (req, res) => {
  const d = readData();
  const editHouse = d.houses.find(h => h.id === req.params.id);
  res.render('houses', { title: 'Editar Casa', editHouse, houses: d.houses, year: new Date().getFullYear() });
});

app.post('/houses/delete/:id', (req, res) => {
  const d = readData();
  d.houses = d.houses.filter(h => h.id !== req.params.id);
  writeData(d);
  res.redirect('/houses');
});

/* ===================== EMPLOYEES ===================== */

app.get('/employees', (req, res) => {
  const d = readData();
  res.render('employees', { title: 'Funcionários', employees: d.employees, year: new Date().getFullYear() });
});

app.post('/employees', (req, res) => {
  const d = readData();
  const { id, name, phone, specialty } = req.body;

  if (id) {
    const idx = d.employees.findIndex(e => e.id === id);
    if (idx >= 0) d.employees[idx] = { id, name, phone, specialty };
  } else {
    const nid = 'e' + (d.employees.length + 1);
    d.employees.push({ id: nid, name, phone, specialty });
  }

  writeData(d);
  res.redirect('/employees');
});

app.get('/employees/:id', (req, res) => {
  const d = readData();
  const selectedEmployee = d.employees.find(e => e.id === req.params.id);
  res.render('employees', { title: 'Detalhes', selectedEmployee, employees: d.employees, year: new Date().getFullYear() });
});

app.get('/employees/edit/:id', (req, res) => {
  const d = readData();
  const editEmployee = d.employees.find(e => e.id === req.params.id);
  res.render('employees', { title: 'Editar Funcionário', editEmployee, employees: d.employees, year: new Date().getFullYear() });
});

app.post('/employees/delete/:id', (req, res) => {
  const d = readData();
  d.employees = d.employees.filter(e => e.id !== req.params.id);
  writeData(d);
  res.redirect('/employees');
});

/* ===================== SERVER ===================== */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});