// [Código 11] - server.js (sirviendo la carpeta uploads)
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./config/db');  // Importar el pool de conexiones

const app = express();
const PORT = process.env.PORT || 65002;

// Configurar para servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configurar almacenamiento de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${req.body.certificateId}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Middleware
app.use(express.static('frontend'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para subir el archivo PDF
app.post('/upload', upload.single('pdfFile'), async (req, res) => {
    const { certificateId, email } = req.body;
    const pdfUrl = path.join('uploads', req.file.filename);

    console.log('Solicitud recibida para subir un archivo PDF');
    console.log('certificateId:', certificateId);
    console.log('email:', email);
    console.log('pdfUrl:', pdfUrl);

    if (!certificateId || !email || !req.file) {
        console.error('Error: Todos los campos son obligatorios.');
        return res.status(400).send('Todos los campos son obligatorios.');
    }

    try {
        const [result] = await db.query(
            `INSERT INTO certificates (certificate_id, email, pdf_url) VALUES (?, ?, ?)`,
            [certificateId, email, pdfUrl]
        );
        console.log('Datos insertados correctamente en la base de datos');
        res.status(200).send(`Archivo subido y guardado correctamente. ID: ${certificateId}, Email: ${email}`);
    } catch (err) {
        if (err.fatal) {
            console.error('Conexión fatal, reintentando...');
        }
        console.error('Error guardando en la base de datos:', err);
        res.status(500).send('Error del servidor.');
    }
});

// Ruta para buscar el certificado por email
app.post('/search-certificate', async (req, res) => {
    const { email } = req.body;

    console.log('Búsqueda de certificado para el email:', email);

    try {
        const [rows] = await db.query(
            'SELECT pdf_url FROM certificates WHERE email = ?',
            [email]
        );

        if (rows.length > 0) {
            console.log('Certificado encontrado:', rows[0].pdf_url);
            res.json({ pdfUrl: rows[0].pdf_url });
        } else {
            console.log('No se encontró ningún certificado para el email:', email);
            res.status(404).json({ message: 'No se encontró ningún certificado para este email.' });
        }
    } catch (err) {
        console.error('Error al buscar en la base de datos:', err);
        res.status(500).json({ message: 'Error del servidor.' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
