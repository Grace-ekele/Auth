const usermodel = require('../Model/model')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const mailSender = require('./email')



exports.newUser = async (req,res)=>{
    try{
        const {userName, email, password}= req.body

        // const checkEmail = await usermodel.findOne({email})
        // if(checkEmail){
        //     res.status(500).json({
        //         message:"email already exist."
        //     })
        // }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        const data ={
            userName,
            email,
            password:hash,
        }

        const createUser = new usermodel(data)
//generate a token
        
        const newToken = jwt.sign({
            userName,
            password
        },process.env.JWT_TOKEN,{expiresIn: "1d"})
        createUser.token =newToken

        const subject = 'KINDLY VERIFY'
        const link = `${req.protocol}://${req.get('host')}/api/verifyLink/${createUser._id}`
        const message = `welcome kindly use this link ${link} to verify your account`
        
        mailSender({
            email:createUser.email,
            subject,
            message
        })
        const create = await createUser.save()
        if(!create){
            res.status(400).json({
                message:"failed to create",
                error:  error.message
            })
            
        }else{
            res.status(201).json({
                message: 'user created sucessfuly',
                data : create
            })
        }

        
}catch(error){
    res.status(500).json({
        message : error.message
    })
  }
}


exports.verify = async (req,res)=>{
    try{
        const userverify = await usermodel.findByIdAndUpdate(req.params.id,{isVeryfied:true})
        if(!userverify){
            res.json('unable to verify this account')
        }else{
            res.json(`user ${userverify.email} has been verifed`)
        }
    }catch(error){
        res.json(error.message)
    }
    
}

exports.signIn = async (req,res)=>{
    try{
        const {userName, password} = req.body
        const check = await usermodel.findOne({userName:userName})
        if(!check){
            res.status(500).json({
                message:"wrong username."
            })
        }

        const isPassword = await bcrypt.compare(password, check.password)
        if(!isPassword){
            res.status(500).json({
                message:"wrong password."
            })
        }

        const createToken = jwt.sign({
            userName,
            password
        },process.env.JWT_TOKEN,{expiresIn: "1d"})
        check.token =createToken
         await check.save()
         res.status(201).json({
            message: 'login sucessfuly',
            data : check
        })
    }


    catch(error){
        res.status(500).json({
            message : error.message
        })
    }
};


exports.forgotPassword = async (req,res)=>{
   try {
    const {email} = req.body;

    const user = await usermodel.findOne({email})
    if(user){
        const subject = "forgot password";
        const link =`${req.protocol}://${req.get('host')}/api/reset-password/${user._id}`

        const message =`click the link ${link} to reset your password`;
        const data ={
            email:email,
            subject,
            message
        };
        mailSender(data)
        res.status(200).json({
            message:'check your registered email for your password reset link',
        });
    }else{
        res.status(404).json({
            message:'user not found'
        })
    }
   
   } catch (error) {
    res.status(500).json({
       message: error.message
    })
   }
}

exports.resetPassword = async (req,res)=>{
    try {
        const {id} = req.params;
        const {newpassword} = req.body;
        const salt = bcryptjs.genSaltSync(10);
        const hashespassword = bcryptjs.hashSync(newpassword,salt);
        const user = await usermodel.findByIdAndUpdate(id,{password:hashespassword})

        if(user){
            res.status(200).json({
                message:"password succesfully reset"
            });
        }else{
            res.status(500).json({
                message:'error changing password'
            })
        }

    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

exports.logout = async(req,res)=>{
    try {
        req.session.destroy((error)=>{
            if(error) throw error;
            res.status(200).json({
                message:'logout succesful'
            })
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

