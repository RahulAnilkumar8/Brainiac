
var xhr, info;
function showInput(){
    // parse info
    info = JSON.parse(decodeURI(location.search).substring(1));
    form = document.getElementById("input");
    if(info.type == "mc"){
        document.getElementById("questionType").innerHTML = "Add a Multiple Choice Question";
        form.className = "mc";
        form.children[0].addEventListener("keyup", function(e) {
            e.preventDefault();
            if (e.keyCode == 13){
                form.children[1].focus();
            }
        });
        for(var i = 0; i < 4; i++){
            var input = document.createElement("input");
            input.type = "text";
            if(i == 0){
                input.name = "answer";
                input.placeholder = "What's the Answer ... ?";
                //input
            } else {
                input.name = "option";
                input.placeholder = "Another choice ... ?";
            }
                input.addEventListener("keyup", function(e) {
                    e.preventDefault();
                    if (e.keyCode == 13){
                        document.activeElement.blur();
                    }
            });
            form.appendChild(input);
        }
        return;
    } 
    else if (info.type == "td"){
        document.getElementById("questionType").innerHTML = "Add Term / Definition Question";
        form.className = "td";
        form.removeChild(form.children[0]);
        var definition = document.createElement("textarea");
        var input = document.createElement("input");
        
        definition.className = "def";
        definition.placeholder = "Definition ... ?";
        definition.addEventListener("keyup", function(e) {
            e.preventDefault();
            if (e.keyCode == 13){
                input.focus();
            }
        });
        
        
        input.type = "text";
        input.className = "term";
        input.name = "answer";
        input.placeholder = "Term... ?";
        input.addEventListener("keyup", function(e) {
            e.preventDefault();
            if (e.keyCode == 13){
                console.log("Input Pressed");
                input.blur();
            }
        });
        
        form.appendChild(definition);
        form.appendChild(input);
        return;
    } 
    else if (info.type == "img"){
        document.getElementById("questionType").innerHTML = "Add Image Question";
        form.removeChild(form.children[0]);
        
        var dropZone = document.createElement("div");
        var fileInput = document.createElement("input");
        var fileButton = document.createElement("label");
        var preview = document.createElement("img");
        var answer = document.createElement("input");
        
        dropZone.className = "dropZone";
        
        fileInput.type = "file";
        fileInput.id = "file";
        
        fileInput.onchange = function(){
            previewFile()
            };

        fileButton.id = "info";
        fileButton.setAttribute("for", "file");
        fileButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path></svg> Upload Question Image';
        
        preview.id = "preview";
        
        answer.type = "text";
        answer.placeholder = "Answer ... ?";
        answer.addEventListener("keyup", function(e) {
            e.preventDefault();
            if (e.keyCode == 13){
                console.log("Answer Pressed");
                answer.blur();
            }
        });
        
        form.appendChild(dropZone);
        dropZone.appendChild(fileInput);
        dropZone.appendChild(fileButton);
        dropZone.appendChild(preview)
        form.appendChild(answer);
        
        
    }
    else {
        info.type="tf";
        document.getElementById("questionType").innerHTML = "Add True / False Question";
        form.className = "tf";
        var truth = document.createElement("input");
        truth.type = "radio";
        truth.name = "tf";
        truth.id = "truth";
        
        var truthLB = document.createElement("label");
        truthLB.innerHTML = "True";
        truthLB.setAttribute("for", "truth");
        
        var fake = document.createElement("input");
        fake.type = "radio";
        fake.name = "tf";
        fake.id = "fake";
        
         var fakeLB = document.createElement("label");
        fakeLB.innerHTML = "False";
        fakeLB.setAttribute("for", "fake");
        
        form.appendChild(truth);
        form.appendChild(truthLB);
        form.appendChild(fake);
        form.appendChild(fakeLB);
    }
}

function getData(){
    // ensure there URL encode the string
    if(info.type == "mc"){
        info.question = form.children[0].value;
        info.answer = form.children[1].value;
        info.option1 = form.children[2].value;
        info.option2 = form.children[3].value;
        info.option3 = form.children[4].value;
    }
    else if(info.type == "tf"){
        info.question = form.children[0].value;
        info.answer = form.children[1].checked?"True":"False";
        info.option1 = null;
        info.option2 = null;
        info.option3 = null;
    }
    else if(info.type == "img"){
        info.answer = form.children[1].value;
        info.option1 = null;
        info.option2 = null;
        info.option3 = null;
    }
    else if(info.type == "td"){
        info.question = form.children[0].value;
        info.answer = form.children[1].value;
        info.option1 = null;
        info.option2 = null;
        info.option3 = null;
    }
    
    
}

function more(){
    document.getElementById("next").disabled = true;
    document.getElementById("next").innerHTML = "Saving ...";
    getData(); 
    data = encodeURIComponent(JSON.stringify(info));
    xhr = new XMLHttpRequest();
    xhr.open("POST","http://innovatotech.com/saveQuestion.php", false);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    //get request w/ no params to get MySQL data
    xhr.onreadystatechange = function(){
        if(xhr.status == 200){
            var response = JSON.parse(xhr.responseText || "false");
            if(response){
                delete info.question;
                delete info.answer; 
                delete info.option1;
                delete info.option2;
                delete info.option3;
                delete info.type;
                location.href = "chooseQuestion.html?" + JSON.stringify(info);
            } else {
                alert("Something went wrong ... try again in a little bit.");
                document.getElementById("next").disabled = false;
                document.getElementById("next").innerHTML = "Add another";
            }
        } else {
            alert("Something went wrong ... try again in a little bit. " + xhr.status);
            document.getElementById("next").disabled = false;
            document.getElementById("next").innerHTML = "Add another";
        }
    };
    console.log(data)
    xhr.send("data="+data);
    
}

function send(){
    getData();
    var data = info
    data = encodeURIComponent(JSON.stringify(data));
    xhr = new XMLHttpRequest();
    xhr.open("POST","http://innovatotech.com/saveQuestion.php", false);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    //get request w/ no params to get MySQL data
    xhr.onreadystatechange = function(){
        if(xhr.status == 200){
            var response = JSON.parse(xhr.responseText || "false");
            if(response){
                delete info.question;
                delete info.answer;
                delete info.option1;
                delete info.option2;
                delete info.option3;
                delete info.type;
                info.i++;
                location.href = 'topic.html?data='+ JSON.stringify(info);
            } else {
                alert("FAILURE");
                document.getElementById("done").disabled = false;
                document.getElementById("done").innerHTML = "Done";
            }
        } else {
            alert(xhr.status);
            document.getElementById("done").disabled = false;
            document.getElementById("done").innerHTML = "Done";
        }
    };
    xhr.send("data="+data);
}

// back button functionality
function back(){
    window.history.go(-1);
}

function getImg(input, output) {
  //input & output are element objects
  input = input.files[0]
  var reader  = new FileReader();

  reader.onload =  function () {
    info.question = reader.result;
    output.src = reader.result;
  };

  if(input) {
    reader.readAsDataURL(input);
  }
}

function previewFile() {
	var fileInput = document.getElementById("file").files[0];
document.getElementById("file").blur();	document.getElementById("info").className = "chosen";
	//console.log(fileInput.files);
	document.getElementById("info").innerHTML = decodeURI(escape(fileInput.name));
	var reader  = new FileReader();
	reader.onload = function(){
    document.getElementById("preview").src = reader.result;
		info.question = reader.result;
	}
	if (fileInput) {
    reader.readAsDataURL(fileInput);
  }
}