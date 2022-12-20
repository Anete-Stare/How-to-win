const e = require("connect-flash");

const uploadField = document.getElementById("image");  

uploadField.onchange = function() {
    if(this.files[0].size > 2097152){
       alert("File is too big!");
       this.value = "";
    };
};


