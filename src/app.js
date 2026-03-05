import express from "express";
import cors from "cors";
import tasksRouter from './routes/taskRoutes.js'
import usersRouter from './routes/userRoutes.js'
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

app.use('/tasks', tasksRouter);
app.use('/users', usersRouter);

// app.listen(port, ()=>{
//     console.log(`example app listening on port ${port}`);
    
// })