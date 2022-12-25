const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer')

const homeRouters =require('./routers/homerouters');

const port = process.env.port | 3000;
const app = express();


// db conn 
mongoose.connect('mongodb+srv://Bhagaban:L2vSe5ZRZjoVfhOA@cluster0.ojbuh.mongodb.net/fuerte').then(()=>{
    console.log('The connection is sucesssfully')
}).catch((error)=>
console.log('The connection is fales'))

app.use(multer().any())
app.set('view engine','ejs')
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/',homeRouters)

app.listen(port,()=>{
    console.log(`The server is running port https://${port}`);
})