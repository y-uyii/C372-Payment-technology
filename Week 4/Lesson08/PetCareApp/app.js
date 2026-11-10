const express = require('express');
const session = require('express-session');
const flash = require('./middleware/flash');
const pageRoutes = require('./routes/pageRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const petRoutes = require('./routes/petRoutes');
const journalRoutes = require('./routes/journalRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

const app = express();
const PORT = 3000;

// View Engine and Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: 'secret123',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

app.use(pageRoutes);
app.use(authRoutes);
app.use(adminRoutes);
app.use(petRoutes);
app.use(journalRoutes);
app.use(serviceRoutes);
app.use(paymentRoutes);
app.use(express.json());

app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`));
