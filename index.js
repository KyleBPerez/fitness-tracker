// create the express server here
require('dotenv').config

const { PORT = 3000 } = process.env;

const express = require('express');
const app = express();

const morgan = require('morgan');

app.use(morgan('dev'));

const cors = require('cors');

app.use(cors());
app.use(express.json());

const apiRouter = require('./api');
app.use('/api', apiRouter);

const { client } = require('./db');

app.get('/',(req,res,next)=>{
    res.status(404).send('PAGE NOT FOUND')
})
app.use((error,req,res,next)=>{
    res.status(500).send(error);
})
app.listen(PORT), () => {
    client.connect();
    console.log("Server is up on: ", PORT)
}