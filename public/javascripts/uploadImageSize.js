const uploadField = document.getElementById("image");  

uploadField.onchange = function() {
    if(this.files[0].size > 4194304){
       alert("Bildes izmērs ir par lielu. Maksimālais bildes izmērs ir līdz 4MB. Lūdzu, izvēlies mazāku attēlu.");
       this.value = "";
    };
};




