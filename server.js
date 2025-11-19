const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(express.json());

const upload = multer({ dest: "uploads/" });
let transporter;

// Show loaded environment vars
console.log("USERNAME_EMAIL:", process.env.USERNAME_EMAIL);
console.log("PWD_EMAIL:", process.env.PWD_EMAIL);


app.post("/send-email", upload.single("file"), async (req, res) => {
  try {
    const { from, to, subject, body } = req.body;

    const attachments = req.file
      ? [{ filename: req.file.originalname, path: req.file.path }]
      : [];

    console.log("Enviando correo de:", from, "a:", to);
    const resposne = await transporter.sendMail({
      from,
      to,
      subject,
      text: body,
      attachments
    });

    console.log("Correo enviado:", resposne.messageId);

    res.json({ message: "Correo enviado" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Error enviando correo" });
  }
});

app.get("/", (req, res) => {
  res.send("API de envío de correos funcionando");
});

app.listen(3434, () => {
  transporter = nodemailer.createTransport({
    host: "smtp.dreamhost.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.USERNAME_EMAIL,
      pass: process.env.PWD_EMAIL
    },
    connectionTimeout: 50000, // 10 segundos máximo para conectar
    greetingTimeout: 30000,    // 5 segundos para esperar el saludo
    // 👆 FIN DE LA SOLUCIÓN 👆

    debug: true,
    logger: true
  });

  // Verify transporter
  transporter.verify((error) => {
    if (error) {
      console.error("❌ Error verificando transporte:", error);
    } else {
      console.log("✅ Transporte SMTP listo");
    }
  });
  console.log("API lista en puerto 3434")
});
