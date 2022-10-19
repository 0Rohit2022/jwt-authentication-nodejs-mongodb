const express = require('express');
const Router = express.Router();
const bcrypt = require('bcryptjs');
const server = require('../models/conne')
const auth = require('../middleware/auth')

Router.get('/', (req,res) => {
    res.render('welcome')
})
Router.get('/logout', auth, async(req,res) => {
    try {
        req.user.tokens =[]
        res.clearCookie('jwt');
        console.log("logout Successfully");
        await req.user.save();
        res.render('login');
    } catch (error) {
        res.status(500).send(error);
    }
})
Router.get('/layout', (req,res) => {
    res.render('layout')
})

Router.get('/dashboard',auth,  (req,res) => {
    server.find((err, docs) => {
        if(err){
            console.log(err);
        }
        console.log(docs);
        res.render('dashboard', {
            users:req.user
        })
    })
   
})
// Get method of login page
Router.get('/login', (req, res) => {
    res.render('login')  
})

// Post method of login
Router.post('/login', async(req,res) => {
    try{
        const email = req.body.email;
        const password  = req.body.password;

        const userData = await server.findOne({email:email});
        console.log(userData)


        const isMatch = await bcrypt.compare(password,userData.password);

        // Middleware code of token which is already we saw in the post code of register

        const token = await userData.generateAuthToken();
        console.log("The token part is " + token);


        res.cookie('jwt', token, {
            expires: new Date(Date.now() + 60000),
            httpOnly:true,
        })


        if(isMatch){
            res.status(201).render('welcome')
            console.log("Congratulations! Passwords are matched correctly")
        }

        else {
            res.send('Invalid Login Details');
        }


    }catch(err){
        res.status(400).send("Invalid Login Details");
    }
})

// Get method of register
Router.get('/register', (req, res) => {
    res.render('register')
})



// Register post requests
Router.post('/register', async(req,res) => {
    try{
      const password = req.body.password;
      const password2 = req.body.password2;

      if(password === password2){
        const users = new server({
            name:req.body.name,
            email:req.body.email,
            password:password,
            password2:password2,
        })
        console.log("The success part is " + users);
        
        // calling token function which is stored in the conne.js
        const token  = await users.generateAuthToken();
        console.log("The token part is " + token);


        res.cookie('jwt', token, {
            expires: new Date(Date.now() + 60000),
            httpOnly:true,
        })

        // Saving data in the database
        const userData = await users.save();
        res.render('login');
        // printing the data which is stored in the database.
        console.log(userData); 
      }
      else {
        res.send("Invalid Email. Login Failed!!!")
      }
    }catch(err){
        res.status(400).send(err);
    }
})

module.exports = Router;