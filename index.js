const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcryptjs = require('bcryptjs');
const path = require('path');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'wbgvosinerwiabnwogibqfywivhgwiehqegubihknweg';

mongoose.connect("mongodb+srv://ankb223:rumni123@firstcluster.asqvg.mongodb.net/TheGenesisDB",{
    useNewurlParser: true,
    useunifiedTopology: true
})


const User = require('./model/verified_users');
const bcrypt = require('bcryptjs/dist/bcrypt');



const app = express();
app.use(bodyParser.json());
const PORT = 3000;


//app.use('/',express.)
app.use('/',express.static(path.join(__dirname,'static')));

app.listen(PORT,()=>{
    console.log("Express server is up");
});





app.post('/register', async (req,res)=>{

    console.log(req.body);
    
    const { username , password: plainTextPassword} = req.body;
    
    if(!username || typeof username !== 'string'){
        return res.json({status:'error ', error:'Invalid Username'})
    }

    if(!plainTextPassword || typeof plainTextPassword !== 'string'){
        return res.json({status:'error ', error:'Invalid Password'})
    }



    const password = await bcrypt.hash(plainTextPassword,10);

    try{ 
        const response = await User.create({
            username ,
            password
        })
        console.log('User created Succesfully: ',response)

    } catch(error){
            if(error.code === 11000){ 
                res.json({status : 'error' , error: ' Username already in use'})
            }
            else{
                throw error;
        }
    }

    res.json({status:'ok'});
    
})


app.post('/login' , async (req,res)=>{

    console.log(req.body);

    const { username , password : plainTextPassword } = req.body;

    const user = await User.findOne({username}).lean();

    if(!user){
        return res.json({status: 'error' , error : 'Invalid username/password'});
    }

    const passCheck = await bcrypt.compare(plainTextPassword,user.password);

    if(passCheck){

        const token = jwt.sign({

            id: user._id,
            username : user.username

        }, JWT_SECRET
        )

        return res.json({status:'ok',data : token});

    }

    res.json({status:'error', error: 'Invalid Username/Password'});



 

})


app.post('/change-pass', async (req,res)=>{

    const { username , email }= req.body;

    const user = await User.findOne({username}).lean();

    if(user){

        //get email id and email using nodemailer the link to reset  learn node mailer its downloaded but not in require() yet


        res.json({status:'ok'});
    }
    else{
        res.json({status:'error', error: 'Username unavailable in our records'});
    }




})

















