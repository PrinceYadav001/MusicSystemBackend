const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function registerUser(req ,res){
    const {username , email ,password , role} = req.body;

    const isUserAlreadyExists = await userModel.findOne({
       $or:[
        {username},
        {email},
       ]
    })
    if(isUserAlreadyExists){
        return res.status(409).json({
            Message:"User is already exist"
        })
    }

    const hash = await  bcrypt.hash(password , 10)

    const user  = await userModel.create({
        username,
        password:hash ,
        email,
        role,
    })

    const token = jwt.sign({
        id:user._id,
        role:user.role,
    } ,process.env.JWT_SECRET)

    res.cookie("token" , token);


    res.status(201).json({
        Message:"user registered successfully",
        user:{
            id :user._id,
            username: user.username,
            email:user.email ,
            role: user.role,
        }
    })     
}


async function loginUser(req , res){
    const { username, email , password } = req.body;

    const user = await userModel.findOne({
        $or:[
            {username},
            {email}
        ] 
    })
    if(!user){
        return res.status(401).json({
            message:"Invalid Credentials"
        })
    }

    const isPasswordVaild  = await bcrypt.compare(password , user.password);

    if(!isPasswordVaild){
        return res.status(401).json({
            message:"Invailid credentials"
        })
    }
    const token = jwt.sign({
        id: user._id,
        role:user.role,
    }, process.env.JWT_SECRET)

    res.cookie("token" ,token);

    res.status(200).json({
        message:"User logged in successfully",
        user:{
            id: user._id,
            username:user.username,
            email:user.email,
            role:user.role,
        }
    })

}


async function logoutUser(req ,res){
    res.clearCookie("token");
    res.status(200).json({
        message:"user is logout successfully"
    })
}

module.exports = {registerUser , loginUser , logoutUser};