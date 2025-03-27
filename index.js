require("dotenv").config();
const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);
app.use(bodyParser.json());
app.use(express.json());

// const VAPID_KEYS = {
//   publicKey:
//     "BI39-j-0GtG0e1iZy8IZIwyqfHluHBD9Rkzdvy7yqBpnwAXyFBN4u8z6Wj3TL5GQpbhsedV2S6jHi-Y1Q9HSZMM",
//   privateKey: "-fLtSbyba-RrIEUlzotxlaMWChKTeeqvMNEcnFHF67o",
// };

webpush.setVapidDetails(
  "mailto:jlopvil@gmail.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
