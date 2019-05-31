let userModel = {};
userModel.Redondear =(data) =>{
    data = Math.round(data * 10000000000) / 10000000000
    data = Math.round(data * 10000) / 10000
    return data
}
userModel.formatoSoles = function formatoSoles(data){
    // console.log("formatoSoles",data);
    
    data = Number(data)
    data = userModel.Redondear(data)
    if(isNaN(data)||data ==0){
        data = "-"
    }
    if(data < 1){
        data = data.toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4
            }
        )
    }else{
        data = data.toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
            }
        )
    } 
    // console.log("termina");
    
    return data
}
userModel.formatoSolesPresicion = function formatoSoles(data){
    // console.log("formatoSoles",data);
    
    data = Number(data)
    data = userModel.Redondear(data)
    if(isNaN(data)||data ==0){
        data = "-"
    }else{
        data = data.toLocaleString('es-PE', {
            minimumFractionDigits: 3,
            maximumFractionDigits: 6
            }
        )
    }
       
    return data
}
userModel.formatoPorcentaje = function formatoSoles(data){
    // console.log("formatoSoles",data);
    
    data = Number(data)
    data = userModel.Redondear(data)
    if(isNaN(data)){
        data = 0
    }else{
        data = data.toFixed(2)
    }
       
    return Number(data)
}
userModel.rome = function rome(N,s,b,a,o,t){
    t=N/1e3|0;N%=1e3;
    for(s=b='',a=5;N;b++,a^=7)
      for(o=N%a,N=N/a^0;o--;)
        s='IVXLCDM'.charAt(o>2?b+N-(N&=~1)+(o=1):b)+s;
    return Array(t+1).join('M')+s;
}
userModel.monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio","Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"];
userModel.shortMonthNames = ["ene", "feb", "mar", "abr", "may", "jun","jul", "ago", "sep", "oct", "nov", "dic"];

userModel.weekDay = ["Do","Lu","Ma","Mi","Ju","Vi","Sa"]
userModel.ColoresRandom =function ColoresRandom() {

    function populate(a) {
      
      var hexValues = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e"];
      for ( var i = 0; i < 6; i++ ) {
        var x = Math.round( Math.random() * 14 );
        var y = hexValues[x];
        a += y;
      }
      return a;
    }
    
    var newColor1 = populate('#');
    var newColor2 = populate('#');
    var angle = Math.round( Math.random() * 360 );
    
    return "linear-gradient(" + angle + "deg, " + newColor1 + ", " + newColor2 + ")";
    
}
userModel.ColoresRandomRGB =function ColoresRandom() {
    function populate(a) {
        a+='('
        for ( var i = 0; i < 3; i++ ) {
            var x = Math.floor(Math.random() * (255 - 200 + 1) + 200)

            a += x
            if(i<2){
                a += ","
            }
        }
        a+=')'
        return a;
    }
    var newColor1 = populate('rgb');
    var newColor2 = populate('rgb');
    var angle = Math.round( Math.random() * 360 );
    return "linear-gradient(" + angle + "deg, " + newColor1 + ", " + newColor2 + ")";
}
userModel.fechaLargaCorta = (MyDate)=>{
	var MyDateString;
	MyDateString = (MyDate.getFullYear()+'-'+('0' + (MyDate.getMonth()+1)).slice(-2)+'-'+('0' + MyDate.getDate()).slice(-2))
	return MyDateString
}
userModel.fechaActual = ()=>{
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	if(dd<10) {
					dd = '0'+dd
	} 
	if(mm<10) {
					mm = '0'+mm
	} 
	return yyyy+"-"+mm;
}
module.exports = userModel;
