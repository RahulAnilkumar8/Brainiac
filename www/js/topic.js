// get Courses PHP
var courses = [];
var email = "";
var i = 0;
function getCourses(){
    // get courses based on email
    xhr = new XMLHttpRequest();
    xhr.open("POST","http://innovatotech.com/checkCourses.php", false);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.onreadystatechange = function(){
        if(xhr.status == 200){
            var response = JSON.parse(xhr.responseText || "false");
            if(response){
                for(var i = 0; i < response.length; i++){
                    response[i][1] = parseInt(response[i][1])
                }
                courses = response.slice(0)
            }
        }
    };
    xhr.send('data="'+email+'"');
    
}

function onDeviceReady(){
    // information is passed through url
    var info = JSON.parse(decodeURI(location.search).substring(6));
    email = info.email ? info.email : 0 ;
    // the course number can be pased through search too
    courses = info.courses ? info.courses : []; 
    i = info.i ? info.i : 0 ;
    // get courses using PHP
    if( !email ){
        // no email defined ... you should login then
        location.href = "login.html";
    } else {
        
        if( !courses.length ){
            // get the courses, 
            getCourses();
            if(i >= courses.length){
                delete info.i;
                location.href = "fight.html?" + JSON.stringify(info);
            }
        }
    }
    $("label[for='topic'] span")[0].innerHTML = courses[i][0];
    document.getElementById("topic").addEventListener("keyup", function(e) {
        e.preventDefault();
        if (e.keyCode == 13){
            $(".next").click();
        }
    });
    $(".skip").click(function(){
        if(i == courses.length - 1){
            delete info.i;
            location.href = "fight.html?" + JSON.stringify(info);
        }
        i++;
        i = i % courses.length;
        $("label[for='topic'] span")[0].innerHTML = courses[i][0];
    });
    $(".next").click(function(){
        var info = {
            email: email,
            topic: document.getElementById("topic").value,
            course: courses[i][1],
            i: i
        };
        info = JSON.stringify(info);
        location.href = "chooseQuestion.html?"+info;
    });
}
