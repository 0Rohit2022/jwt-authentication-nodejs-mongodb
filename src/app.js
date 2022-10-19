const express = require("express");
require('dotenv').config();
const Bodyparser = require('body-parser')


const cookieParser = require('cookie-parser');







// User Models
require('../db/server')
const app = express();
app.use(express.json()); 
app.use(cookieParser()) 
 


const PORT = process.env.PORT || 8000;

// Express EJS

app.set('view engine', 'ejs');

// Bodyparser
app.use(Bodyparser.urlencoded({extended:true}))




// Routes
const allrouters = require('../routers/routers')
app.use('/', allrouters);



app.listen(PORT , () => {
    console.log(`Server is running live on port no.${PORT}`);
})