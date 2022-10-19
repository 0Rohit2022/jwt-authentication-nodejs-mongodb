const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const PlaylistSchema = mongoose.Schema;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const schema = new PlaylistSchema({
    name:{
        type:String,
        required:true,
        minLength:3
    },
    email:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email id");
            }
        }
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
   password2:{
    type:String,
    required:true,
    minLength:6
   }, 
   tokens: [{
    token:{
        type:String,
        required:true,
    }
   }]
})

schema.methods.generateAuthToken = async function() {
    try{
        console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET)
        this.tokens= this.tokens.concat({token:token})
        await this.save();
        return token;

    }catch(err) {
        res.send(err);
        console.log(err);
    }
}


schema.pre('save', async function(next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,12);
        this.password2 = await bcrypt.hash(this.password2, 12);
    }
    next()
})






module.exports = mongoose.model('Passport',schema )