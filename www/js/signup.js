var student = {
    "name": "",
    "email": "",
    "pass": "",
    "courses": [],
    "char":{
        hair: 0,
        body: 0,
        pants: 0
    }
};
var hairs = [
    "http://s20.postimg.org/fq87fkwv1/Beard.png",
    "http://s20.postimg.org/8e2ra1en1/Bearded_Top_Hat.png",
    "http://s20.postimg.org/43sos6yxp/Top_Hat.png",
    "http://s20.postimg.org/jmq4pb78d/Spiky.png",
    "http://s20.postimg.org/5wvlgik4d/Basic.png"
];
var bodies = [
    "http://s20.postimg.org/c965clxst/Blue_Coat.png",
    "http://s20.postimg.org/mlsfyorbx/Green_Tee.png",
    "http://s20.postimg.org/qm46oo76l/Green_Coat.png",
    "http://s20.postimg.org/xhof7s1nh/Red_Tee.png",
    "http://s20.postimg.org/cuzpmgi8t/Red_Coat.png"
    
];
var pants = [
    "http://s20.postimg.org/kauduigkd/Dark_Pants.png",
    "http://s20.postimg.org/4f5jr7pzx/Blue_Jeans.png",
    "http://s20.postimg.org/oswomlwm5/Green_Jeans.png",
    "http://s20.postimg.org/3lxjcc9ct/Purple_Swag.png",
    "http://s20.postimg.org/7ecgebzh9/Gold_Swag.png"
];
var charMax = {
    "hair": 6,
    "body": 6,
    "pants": 6
};
var viewStyles, revStyles, xhr;
function addList(){
    var list = document.getElementById("courses");
    var course = document.getElementById("CourseAdd").value;
    if (course && student.courses.indexOf(course) == -1) {
        student.courses.push(course);
        var entry = document.createElement('li');
        var revEntry = document.createElement('li');

        var del = document.createElement("button");
        del.setAttribute("class", "remove");
        del.onclick = function() {
            // same content other than button tag? Deleted.
            var course = this.parentNode.innerHTML.slice(0, -32);
            this.parentNode.parentNode.removeChild(this.parentNode);
            for (var i = 0; i < $("#revCourses")[0].children.length; i++) {
                if ($("#revCourses li")[i].innerHTML == course) {
                    $("#revCourses")[0].removeChild($("#revCourses li")[i]);
                    student.courses.splice(i,1);
                    break;
                }
            }
        };

        entry.innerHTML = course;
        revEntry.innerHTML = course;

        entry.appendChild(del);
        list.appendChild(entry);
        $("#revCourses")[0].appendChild(revEntry);
    }

}
function modChar(val){
    if (val[val.length - 1] == "R") {
        student.char[val.slice(0, -1)] += 1;
    } else {
        student.char[val.slice(0, -1)] -= 1;
    }
    // cycle instead of infinite increase
    if(student.char[val.slice(0, -1)] == charMax[val.slice(0, -1)]){
        student.char[val.slice(0, -1)] = 0;
    }
    else if(student.char[val.slice(0, -1)] < 0){
        student.char[val.slice(0, -1)] += 6;
    }
    addStyles(viewStyles);
    addStyles(revStyles);
}
function getInfo() {
    // change data in review tab based on info, courses, & character.
    // after next step pressed, elements are added to Review tab
    // and onchange triggers added.
    $("#revName")[0].innerHTML = $("input:not(.tab-radio)")[0].value;
    student.name = $("input:not(.tab-radio)")[0].value;
    $("#revEmail")[0].innerHTML = $("input:not(.tab-radio)")[1].value;
    student.email = $("input:not(.tab-radio)")[1].value.toLowerCase();
    $("#revPass")[0].innerHTML = new Array($("input:not(.tab-radio)")[2].value.length + 1).join("*");
    student.pass = $("input:not(.tab-radio)")[2].value;

}
function toggleLogo() {
    if ($("input[type='radio']")[0].checked === true) {
        $(".logo").removeClass("logoOff");
    } else {
        $(".logo").addClass("logoOff");
    }
}
function addImage(canvas, src) {
	var ctx = canvas.getContext('2d');
	var imageObj = new Image();
	imageObj.onload = function() {
        // add it to the canvas
        ctx.drawImage(imageObj, 0, 0, 580, 650);
    };
	imageObj.src = src;
	
}
function addStyles(canvas){
    var ctx = canvas.getContext('2d');
	ctx.clearRect(0,0,580,650);
	addImage(canvas, "http://s20.postimage.org/fnobsqt7h/Full_Sprite.png");
    if(student.char.pants > 0){
		addImage(canvas, pants[student.char.pants - 1]);
	}
	if(student.char.body > 0){
		addImage(canvas, bodies[student.char.body - 1]);
	}
    if(student.char.hair > 0){
		addImage(canvas, hairs[student.char.hair - 1]);
	}
}
function nextStep(currentStep) {
    if (currentStep == 1) {
        $(".error")[0].innerHTML = '';
        // validate data exists for signup
        var good = true;
        for (var x = 0; x < 3; x++) {
            if (!$("input:not(.tab-radio)")[x].value) {
                addError($("input:not(.tab-radio)")[x].placeholder, 0, true);
                good = false;
            }

        }
        //validate if email exists in signup
        if (good && $("input:not(.tab-radio)")[1].value.search(/^[a-z0-9](\.?[a-z0-9_-]){0,}@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/g) < 0) {
            $("input:not(.tab-radio)")[1].value = "";
            addError('Email', 0, true);
            good = false;
        }
        if (!good) {
            return;
        }
        if(checkEmail($("input:not(.tab-radio)")[1].value)){
          $("input:not(.tab-radio)")[1].value = "";
          //alert("This email is already taken. Try another one.");
          addError('Email', 0, false);
          return;
        }
    }
    if (currentStep == 2) {
        $(".error")[1].innerHTML = '';
        if ($('#courses li').length === 0) {
            addError("Courses", 1, true);
            return;
        }
    }
    // don't continue if nothing is filled in ... 
    for (i = 0; i < currentStep; i++) {
        $(".tabs .tab .tab-label:eq(" + i + ")").addClass("passed");
    }
    $(".tabs .tab .tab-radio")[i].disabled = false;
    $(".tabs .tab .tab-radio")[i].checked = true;
    toggleLogo();
    if (i == 3) {
        getInfo();

        for (var i = 0; i < 3; i++) {
            $("input:not(.tab-radio)").slice(0, 3)[i].onchange = getInfo();
        }
    }
}
function addError(type, page, mess) {
    var message = document.createElement("div");
    message.setAttribute("class", "message");
    if(mess){
      message.innerHTML = "Please define your " + type + " before continuing.";
    }else{
      message.innerHTML = "That " + type + " is already taken. Try another one.";
    }
    var del = document.createElement("button");
    del.setAttribute("class", "remove");
    del.onclick = function() {
        this.parentNode.parentNode.removeChild(this.parentNode);
    };
    message.appendChild(del);
    $(".error")[page].appendChild(message);
}
function save(){
    //disallow double tapping
    $(".next")[3].disabled = true;
    $(".next")[3].innerHTML = "Signing Up ...";
    var data = JSON.stringify(student);
    xhr = new XMLHttpRequest();
    xhr.open("POST","http://innovatotech.com/portSignup.php", false);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    //get request w/ no params to get MySQL data
    xhr.onreadystatechange = function(){
        if(xhr.status == 200){
            var response = JSON.parse(xhr.responseText || "false");
            if(response){
                var info = {email: JSON.parse(data).email};
                info = JSON.stringify(info);
                location.href = 'topic.html?data='+ info;
                // change location to add questions ...
            }
        } else {
            alert("Sign Up Failed ... Try again");
            $(".next")[3].disabled = false;
            $(".next")[3].innerHTML = "Sign Up";
        }
    };
    xhr.send("data="+data);
}
function onDeviceReady(){
    viewStyles = document.getElementById("char");
    revStyles = document.getElementById("revChar");
    $('input[type="radio"]').change(function(){
        toggleLogo();
    });
    $(".left, .right").click(function(){
        modChar(this.value);
    });
    addStyles(viewStyles);
    addStyles(revStyles);
    for(var i = 0; i < 4; i++){
        $("input:not([type='radio'])")[i].addEventListener("keyup", function(e) {
        e.preventDefault();
        if (e.keyCode == 13){
            enterKey(document.activeElement.placeholder);
        }
    });
    }
}
function checkEmail(email){
    xhr = new XMLHttpRequest();
    xhr.open("POST","http://innovatotech.com/checkEmail.php", false);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    //get request w/ no params to get MySQL data
    xhr.send('data="'+email+'"');
    if(xhr.status == 200){
            var response = JSON.parse(xhr.responseText || "false");
            return response;
        } else {
           return true;
        }
}
function enterKey(name){
    console.log("Entered " + name)
    if(name == "Name"){
        $("input:not([type='radio'])")[1].focus();
    }
    else if(name == "Email"){
        $("input:not([type='radio'])")[2].focus();
    }
    else if(name == "Password"){
        nextStep(1);
    } 
    else if(name == "New Course...") {
        document.activeElement.blur();
        addList();
        $("input:not([type='radio'])")[3].value = "";
    }
}