const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express')
const app = express()
const mongoose = require("mongoose");
const cors = require("cors");

const PORT = 3004

const url =
  "mongodb+srv://oscpalma_db_user:soyLaPass123456@cluster0.a60lnid.mongodb.net/ms-shipping?retryWrites=true&w=majority&appName=Cluster0"

mongoose
  .connect(url)
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(PORT, () => console.log(`App listen at http://localhost:${PORT} 💻`));
  })
  .catch((error) => console.error("Error al conectar a MongoDB:", error));


// Middleware
app.use(express.json());
app.use(cors());

// Rutas
const enviosRouter = require("./src/routes/envios.router");

app.use("/api/shipping", enviosRouter);

app.get('/', (req, res) => {
  res.json({ 
    message: "Microservicio de Shipping (Express) operando correctamente 🚚" 
  });
});