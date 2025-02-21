const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.get("/users", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    console.error("Error en MySQL:", error);
    res.status(500).json({ error: "Error al conectar con la base de datos" });
  }
});

const VAPID_KEYS = {
  publicKey:
    "BI39-j-0GtG0e1iZy8IZIwyqfHluHBD9Rkzdvy7yqBpnwAXyFBN4u8z6Wj3TL5GQpbhsedV2S6jHi-Y1Q9HSZMM",
  privateKey: "-fLtSbyba-RrIEUlzotxlaMWChKTeeqvMNEcnFHF67o",
};

webpush.setVapidDetails(
  "mailto:jlopvil@gmail.com",
  VAPID_KEYS.publicKey,
  VAPID_KEYS.privateKey
);

let subscriptions = [];

app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
});

app.post("/sendNotification", (req, res) => {
  const notificationPayload = JSON.stringify({
    title: "¡Nueva Notificación!",
    body: "Este es un mensaje enviado desde el servidor.",
  });

  subscriptions.forEach((subscription) => {
    webpush
      .sendNotification(subscription, notificationPayload)
      .catch((err) => console.error(err));
  });

  res.status(200).json({ message: "Notificación enviada" });
});

app.listen(5000, () => console.log("Servidor corriendo en el puerto 5000"));
