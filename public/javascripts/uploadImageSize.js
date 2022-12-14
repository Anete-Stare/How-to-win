const uploadField = document.getElementById("image");  

uploadField.onchange = function() {
    if(this.files[0].size > 1048576){
       alert("File is too big!");
       this.value = "";
    };
};