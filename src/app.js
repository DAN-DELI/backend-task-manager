import express from "express";
import cors from "cors";
import taskRoutes from './routes/taskRoutes.js'
import userRoutes from './routes/userRoutes.js'
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
const port = 3000;

app.get('/', (req, res) =>{
    res
        .status(200)
        .json({
            msn : "Hola mundo"
        });
});

app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);

process.on('uncaughtException', (err) => {
    console.error('❌ SE DETECTÓ UN ERROR CRÍTICO:', err.message);
    // No dejamos que se cierre
});

// 2. Intentamos encender el servidor con un capturador de errores
const server = app.listen(port, () => {
    console.log(`🚀 Servidor en: http://localhost:${port}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ El puerto ${port} ya está siendo usado por otro programa.`);
    } else {
        console.error('❌ Error al iniciar:', err);
    }
});

// El intervalo para asegurar que el event loop tenga trabajo
setInterval(() => {}, 10000);