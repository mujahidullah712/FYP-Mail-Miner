const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

// ✅ MOVE CORS TO TOP
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require("./routes/userRoutes");
const emailRoutes = require("./routes/emailRoutes");
const scenarioRoutes = require("./routes/scenarioRoutes");

app.use('/api/v1/auth', authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/emails", emailRoutes);
app.use("/api/v1/scenarios", scenarioRoutes);

// ✅ Serve static attachments
app.use("/uploads", express.static(path.join(__dirname, "uploads")));




app.get('/', (req, res) => {
  res.send('MailMiner API running');
});

module.exports = app;