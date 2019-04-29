let userModel = {};
userModel.formatoSoles = function formatoSoles(data){
    // console.log("formatoSoles",data);
    
    data = Number(data)
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
userModel.rome = function rome(N,s,b,a,o,t){
    t=N/1e3|0;N%=1e3;
    for(s=b='',a=5;N;b++,a^=7)
      for(o=N%a,N=N/a^0;o--;)
        s='IVXLCDM'.charAt(o>2?b+N-(N&=~1)+(o=1):b)+s;
    return Array(t+1).join('M')+s;
}
userModel.monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
"Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"
];
module.exports = userModel;
