const User = require('../models/m.del.Inicio');
function fechaLargaCorta(MyDate){

	var MyDateString;

	MyDate.setDate(MyDate.getDate() + 20);

	MyDateString = (MyDate.getFullYear()+'-'+('0' + (MyDate.getMonth()+1)).slice(-2)+'-'+('0' + MyDate.getDate()).slice(-2))
	
	return MyDateString
}


module.exports = function(app){
 app.delete('/delCronogramaitem',(req,res)=>{
		if(req.body.id_ficha==null||req.body.fecha==null){
			res.json(null)

		}else{
			User.delCronogramaitem(req.body.id_ficha,req.body.fecha,(err,data)=>{
				if(err) {res.status(204).json(err);}
				else{
					res.status(200).json(data);
				}
				
			})	
		}
		
		
	});	

}
