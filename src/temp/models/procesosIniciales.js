const pool = require('./connection');
let userModel = {};
function formatoPorcentaje(data){
    
    console.log("antes",data);
    
    data = Number(data)
    console.log("number",data);
    if(isNaN(data)){
        
        data=0
    }
    if(data < 1){
        data = data.toLocaleString('es-PE', {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4
          })
    }else{
        data = data.toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
    } 
    console.log("despues",data);

    return data
}

//ingresar


//usuarios

//obras


//sacar
//obras

//usuarios














module.exports = userModel;