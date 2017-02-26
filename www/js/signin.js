var xhr;
function check(){
            document.body.children[4].disabled = true;
            document.body.children[4].innerHTML = "Logging In ...";
            var data = {
                "email":document.body.children[2].value.toLowerCase(),
                "pass":document.body.children[3].value
            };
            data = JSON.stringify(data);
            xhr = new XMLHttpRequest();
            xhr.open("POST","http://innovatotech.com/testSignin.php", false);
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            //get request w/ no params to get MySQL data
            xhr.onreadystatechange = function(){
                if(xhr.status == 200){
                    var response = JSON.parse(xhr.responseText || "false");
                    if(response){
                        var info = {email: JSON.parse(data).email};
                        info = JSON.stringify(info);
                        location.href = 'topic.html?data='+ info;
                    } else {
                        alert("Couldn't Find that Email/Password Combination ... ");
                        document.body.children[4].disabled = false;
                        document.body.children[4].innerHTML = "Log In";
                    }
                } else {
                    alert("Network Error " + xhr.status + " Please try again later.");
                    document.body.children[4].disabled = false;
                    document.body.children[4].innerHTML = "Log In";
                }
            };
            xhr.send("data="+data);
}
function onDeviceReady(){
    document.body.children[2].addEventListener("keyup", function(e) {
        e.preventDefault();
        if (e.keyCode == 13){
            document.body.children[3].focus();
        }
    });
    document.body.children[3].addEventListener("keyup", function(e) {
        e.preventDefault();
        if (e.keyCode == 13){
            check();
        }
    });
}
