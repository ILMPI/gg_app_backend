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

const deleteUserById = async (req, res, next) =>{
    try{
        const {id}=req.params;
        const [result] = await User.deleteById(id);
        if (result.affectedRows===1){
            res.json({message:'Se ha borrado el usuario'});
        }else{
            res.status(404).json({message:'El usuario no existe'})
        }
    }catch(err){
        next(err);
    }
}

const register = async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const [result] = await User.insertUser({ ...req.body, password: hashedPassword });
        res.json(result);
    } catch (err) {
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
    getAllUsers, getUserById, register, login, deleteUserById
}