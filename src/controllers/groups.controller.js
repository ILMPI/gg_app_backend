const Group = require('../models/groups.model');

const getAllGroups = async (req, res, next) =>{
    try{
        const [result] = await Group.selectAll();
        res.send(result);   
    }catch(err){
        next(err);
    }
}

const getGroupById = async (req, res, next) =>{
    try {
        const [result] = await Group.selectById(req.params.id);
        res.json(result);    
    }catch(err){ 
        next(err);
    }
}

const getGroupsByCreatorId = async (req, res, next) =>{
    try {
        const [result] = await Group.selectByCreatorId(req.params.creator_id);
        res.json(result);    
    }catch(err){ 
        next(err);
    }
}

const createGroup = async (req, res, next) => {
    try{     
        const [result] = await Group.insertGroup(req.body);    
        res.json(result);
    }catch(err){
        next(err);
    }

}


module.exports ={
    getAllGroups, getGroupById, getGroupsByCreatorId, createGroup
}