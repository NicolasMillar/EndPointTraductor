require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

//coneccion a la base de datos;
const pgp = require('pg-promise')();
const connectionString = process.env.DB_URL; // Utiliza la variable de entorno DB_URL
const db = pgp(connectionString);

app.use(express.json());

// Rutas de API

    //Endpoint que retorna todos los idiomas a los que se puede traducir
    app.get('/idiomas', async (req, res) => {
        try {
            const idiomas = await db.any('SELECT * FROM idiomas');
            res.json(idiomas);
        } catch (error) {
            console.error('Error al obtener los datos de la tabla "idiomas":', error);
            res.status(500).json({ error: 'Ocurrió un error al obtener los datos de la tabla "idiomas"' });
        }
    });
    
    //Endpoint que busca la traduccion segun el idioma y la palabra de origen
    app.get('/buscar', async(req, res) => {
        const { id_idioma, origen } = req.query;
        try {
            if (id_idioma && origen) {
                const query = `
                    SELECT * FROM traduccion
                    WHERE id_idioma = $1 AND origen = $2`;
                
                const idiomas = await db.any(query, [id_idioma, origen]);
                res.json(idiomas);
            } 
        } catch (error) {
            console.error('Error al obtener los datos de la tabla "traduccion":', error);
            res.status(500).json({ error: 'Ocurrió un error al obtener los datos de la tabla "traduccion"' });
        }
    });

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
