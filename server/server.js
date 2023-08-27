import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connect from './database/conn.js';
import router from './router/route.js';

//import express from 'express';

// const express = require('express');
const app = express();

/** middlewares */
app.use(express.json());
app.use(cors({
    origin:["https://logi-nexa-app-pvk4-p6j7sftil-gujaresri1113.vercel.app/"],
    methods:["POST","GET"],
    credentials:true
}));
app.use(morgan('tiny'));
app.disable('x-powered-by'); // less hackers know about our stack

const port = 8080;

app.get('/', (req, res) => {
    res.status(201).json("Home GET Request");
});

/** api routes */
app.use('/api', router);

/** start server only there is valid connection */
connect().then(() => {
    try {

        app.listen(port, () => {
            console.log(`Server connected to http://localhost:${port}`);
        })

    } catch (error) {
        console.log('Cannot connect check properly');
    }
}).catch(error =>{
    console.log(
        "Invalid database connection"
    );
})


