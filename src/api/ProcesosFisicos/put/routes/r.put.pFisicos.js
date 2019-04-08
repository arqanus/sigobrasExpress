const User = require('../models/m.put.pFisicos');
var formidable = require('formidable');    
// var util = require('util');
var fs = require('fs');
// var path = require('path');

function fecha(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }

  return mm + '-' + dd + '-' + yyyy;
}
function datetime(){
  var today = new Date();
  var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
  var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
  return date+'_'+time;
}

module.exports = function(app){
 
	app.put('/putPrioridad',(req,res)=>{	
    console.log(req.body);
    		
		User.putPrioridad(req.body.id_partida,req.body.prioridad,(err,data)=>{							
			if(err){ res.status(204).json(err);}
			else{
        User.getPrioridad(req.body.id_partida,(err,prioridad)=>{							
          if(err){ res.status(204).json(err);}
          else{
            res.json(prioridad)
          }
        })
			}
		})
})
  
}