const express = require('express');
const fs = require('fs');
const csvWriter = require('csv-writer').createObjectCsvWriter;
const csvParser = require('csv-parser');

const app = express();
const PORT = process.env.PORT || 9000;
const CSV_FILE_PATH = './gatos.csv';

let currentId = 0;

// Middleware
app.use(express.json());

// Configurar el escritor de CSV
const writer = csvWriter({
    path: CSV_FILE_PATH,
    header: [
        { id: 'id', title: 'ID' },
        { id: 'name', title: 'Name' },
        { id: 'image', title: 'Image' },
        { id: 'description', title: 'Description' },
        { id: 'gender', title: 'Gender' },
        { id: 'observations', title: 'Observations' },
    ],
    append: true,
});

// Inicializar el ID leyendo el archivo CSV
const initializeId = () => {
    if (!fs.existsSync(CSV_FILE_PATH)) return;

    fs.createReadStream(CSV_FILE_PATH)
        .pipe(csvParser())
        .on('data', (row) => {
            const id = parseInt(row.ID, 10);
            if (id > currentId) currentId = id;
        })
        .on('end', () => {
            console.log(`ID inicializado. Próximo ID: ${currentId + 1}`);
        });
};

// Función para leer todos los gatos del CSV
const readGatos = () => {
    return new Promise((resolve, reject) => {
        const gatos = [];
        fs.createReadStream(CSV_FILE_PATH)
            .pipe(csvParser())
            .on('data', (row) => gatos.push(row))
            .on('end', () => resolve(gatos))
            .on('error', (error) => reject(error));
    });
};

// POST: Crear un nuevo gato
app.post('/api/gatos', async (req, res) => {
    const { name, image, description, gender, observations } = req.body;

    if (!name || !image || !description || !gender || !observations) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    currentId += 1;
    const newGato = { id: currentId, name, image, description, gender, observations };

    try {
        await writer.writeRecords([newGato]);
        res.status(201).json({ message: 'Gato creado exitosamente.', gato: newGato });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el gato.' });
    }
});

// GET: Obtener todos los gatos
app.get('/api/gatos', async (req, res) => {
    try {
        const gatos = await readGatos();
        res.json(gatos);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer los datos.' });
    }
});

// GET: Obtener un gato por ID
app.get('/api/gatos/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const gatos = await readGatos();
        const gato = gatos.find((g) => parseInt(g.ID, 10) === id);
        if (!gato) return res.status(404).json({ error: 'Gato no encontrado.' });
        res.json(gato);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el gato.' });
    }
});

// PUT: Actualizar un gato por ID
app.put('/api/gatos/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { name, image, description, gender, observations } = req.body;

    try {
        const gatos = await readGatos();
        const index = gatos.findIndex((g) => parseInt(g.ID, 10) === id);
        if (index === -1) return res.status(404).json({ error: 'Gato no encontrado.' });

        gatos[index] = { ID: id.toString(), Name: name, Image: image, Description: description, Gender: gender, Observations: observations };

        const csvWriterUpdate = csvWriter({
            path: CSV_FILE_PATH,
            header: [
                { id: 'ID', title: 'ID' },
                { id: 'Name', title: 'Name' },
                { id: 'Image', title: 'Image' },
                { id: 'Description', title: 'Description' },
                { id: 'Gender', title: 'Gender' },
                { id: 'Observations', title: 'Observations' },
            ],
        });

        await csvWriterUpdate.writeRecords(gatos);
        res.json({ message: 'Gato actualizado exitosamente.', gato: gatos[index] });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el gato.' });
    }
});

// DELETE: Eliminar un gato por ID
app.delete('/api/gatos/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
        const gatos = await readGatos();
        const newGatos = gatos.filter((g) => parseInt(g.ID, 10) !== id);

        const csvWriterUpdate = csvWriter({
            path: CSV_FILE_PATH,
            header: [
                { id: 'ID', title: 'ID' },
                { id: 'Name', title: 'Name' },
                { id: 'Image', title: 'Image' },
                { id: 'Description', title: 'Description' },
                { id: 'Gender', title: 'Gender' },
                { id: 'Observations', title: 'Observations' },
            ],
        });

        await csvWriterUpdate.writeRecords(newGatos);
        res.json({ message: `Gato con ID ${id} eliminado exitosamente.` });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el gato.' });
    }
});

// Iniciar el servidor y cargar el ID inicial
app.listen(PORT, () => {
    initializeId();
    console.log(`API de gatos corriendo en http://localhost:${PORT}`);
});
