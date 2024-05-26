const bcrypt = require('bcryptjs');

const User = require('../models/users.model');

const getAllUsers = async (req, res, next)=>{

    try{
        const [result] = await User.selectAll();
        res.send(result);   
    }catch(err){
        next(err);
    }
}

const getUserById = async (req, res, next) =>{
    try {
        const [result] = await User.selectById(req.params.id);
        res.json(result);    
    }catch(err){ 
        next(err);
    }
}

const register = async (req, res, next) => {
   req.body.password = bcrypt.hashSync(req.body.password, 8);
    try{     
        const [result] = await User.insertUser(req.body);    
        res.json(result);
    }catch(err){
        next(err);
    }

}

const login = async (req, res, next) => {

        const {email, password} = req.body;
        //comparamos email
        const [users] = await User.selectByEmail(email);

        if (users.length===0){
            return res.status(401).json({error:'error en email y/o password'});
        }

        const user = users[0];

        console.log(user.password);

        //comparamos password
        const iguales = bcrypt.compareSync(password, user.password);
        if (!iguales){
            return res.status(401).json({error:'error en email y/o en password'});
        }

        //login correcto
        res.json({succes:'login correcto'});
}

module.exports = {
    getAllUsers, getUserById, register, login
}