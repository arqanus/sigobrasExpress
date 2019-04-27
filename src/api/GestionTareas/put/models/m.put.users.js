const pool = require('../../../../db/connection');
let userModel = {};

userModel.putMenusUsuarios = (data,callback)=>{
         
    pool.query('update menus set menus.data = ?', data,(error,res)=>{
        if(error) {
            callback(error);
        }else{
            console.log("affectedRows",res.affectedRows);
            callback(null,res.affectedRows);
        }
    })        
    
}

module.exports = userModel;