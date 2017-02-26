/*global alert*/
//to DO:
// get questions using PHP
// display all answer types

var stage, stagefight, swag;
var charImg, enemyImg;
var questions = [];
var current = 0;
var info;
var hair, body, pant;
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
//modify scale of canvas
var scale = 10;
//helper function
function checkIn(main, newArray) {
    var inArray = false;
    for(var i = 0; i < main.length; i++){
        if (main[i].length == newArray.length){
            inArray = true;
            for (var j = 0; j < newArray.length; j++) {
                if(main[i][j] != newArray[j]){
                    inArray = false;
                    break;
                }
            }
            if(inArray){
                break;
            }
        }
    }
    return inArray;
}

function battlespawn(){
    //get info from location.search
    info = JSON.parse(decodeURIComponent(location.search).substring(1));
    info.mistakes = [];
    // set up canvas
    stage = document.getElementById("stage");
    stagefight = stage.getContext('2d');
    //Preloading images prevents flashing problems
    charImg = new Image();
    enemyImg = new Image();
    getClothing();
   
    charImg.src = "assets/Full_Sprite.png";
    enemyImg.src = enemyselect();
    
    //aye
    var bsound = new Audio("assets/battlemusic.mp3");
    //bsound.play();
    
    
    getQuestions();
    
    current = 0;
    document.getElementById("lightbox").onmousedown = function(){
        location.hash = "";
    };
    document.getElementById("lightbox").children[1].onmousedown = function(e){
        e.stopPropagation();
    };


    
    showQuestion();
    draw(-120*scale, 250*scale);
    
    
}

function enemyselect(){
    info.step = 1;
    getStep()
    var monsters = ["assets/npc_1.png", "assets/npc_2.png", "assets/npc_3.png"];
    // indices of monsters which are extra strong
    var bosses = [2];
    HP = 4;
    if(bosses.indexOf(info.step) >= 0){
        EnemyHP = 8;
        info.boss = true;
    } else {
        EnemyHP = 4;
        info.boss = false;
    
    }
    
    //if it is a boss then get questions differently (send random = true to MySQL)
    return monsters[info.step % monsters.length];
    
}

function drawChar(imageObj, x, y, w, h){
    stagefight.drawImage(imageObj, x, y, w, h);
}

//mc = -120 --> 24; enemy 250 --> 180 
function draw(mc, enemy){
    if(mc < 24*scale){
        drawChar(charImg, mc, 20*scale, 120*scale, 150*scale);
        if(hair) drawChar(hair, mc, 20*scale, 120*scale, 150*scale);
        if(body) drawChar(body, mc, 20*scale, 120*scale, 150*scale);
        if(pant) drawChar(pant, mc, 20*scale, 120*scale, 150*scale);
        
        mc += 8*scale;
          
          swag = window.requestAnimationFrame(function(){
            setTimeout(function(){
              stagefight.clearRect(0,0, stage.width, stage.height);
              draw(mc, enemy);
            }, 100);
          });
    }
    else if(enemy > 180*scale){
        drawChar(charImg, 24*scale, 20*scale, 120*scale, 150*scale);
        if(hair) drawChar(hair, mc, 20*scale, 120*scale, 150*scale);
        if(body) drawChar(body, mc, 20*scale, 120*scale, 150*scale);
        if(pant) drawChar(pant, mc, 20*scale, 120*scale, 150*scale);        
        
        drawChar(enemyImg, enemy, 45*scale, 120*scale, 90*scale);
        enemy -= 10*scale; 
          
          swag = window.requestAnimationFrame(function(){
            setTimeout(function(){
              stagefight.clearRect(0,0, stage.width, stage.height);
              draw(mc, enemy);
            }, 100);
          });
        
    }
    else{
        if(swag <= 25){
            window.cancelAnimationFrame(swag);
        }
        
        //dirty fix
        stagefight.clearRect(0,0, stage.width, stage.height);
        drawChar(charImg, mc, 20*scale, 120*scale, 150*scale);
        if(hair) drawChar(hair, mc, 20*scale, 120*scale, 150*scale);
        if(body) drawChar(body, mc, 20*scale, 120*scale, 150*scale);
        if(pant) drawChar(pant, mc, 20*scale, 120*scale, 150*scale);
        drawChar(enemyImg, enemy, 45*scale, 120*scale, 90*scale);
        HealthMC(HP);
        HealthEnemy(EnemyHP);
    }

}

function getQuestions(){
    // if false, tell them to make more questions and send back to topic page
    // otherwise, set questions to be questions from PHP
    // get questions 
    xhr = new XMLHttpRequest();
    xhr.open("POST","http://innovatotech.com/chooseQuestion.php", false);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.onreadystatechange = function(){
        if(xhr.status == 200){
            //console.log(xhr.responseText)
            if(xhr.responseText && xhr.responseText == "not enough"){
                alert("Not Enough Questions. Please make some more or come back tomorrow");
                location.href = "topic.html?data="+JSON.stringify(info);
            }
            var response = JSON.parse(xhr.responseText || "false");
            if(response){
                if(response.length == 7){
                    info.boss = false;
                    EnemyHP = 4;
                }
                for(var i = 0; i < response.length; i++){
                    questions.push(response[i]);
                }
            }
            else{
                alert("network error");
            }
        }
    };
    //console.log('data='+JSON.stringify(info))
    xhr.send('data='+JSON.stringify(info));
}
function getClothing(){
    xhr = new XMLHttpRequest();
    xhr.open("POST","http://innovatotech.com/getClothing.php", false);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.onreadystatechange = function(){
        if(xhr.status == 200){
            //console.log(xhr.responseText)
            var response = JSON.parse(xhr.responseText || "false");
            if(response){
                    //console.log(response);
                    info.clothing = response.split(" ").map(function(x){return parseInt(x, 10);});
                    hair = info.clothing[0]?new Image():null;
                    body = info.clothing[1]?new Image():null;
                    pant = info.clothing[2]?new Image():null;
                    if(hair) hair.src = hairs[info.clothing[0] - 1];
                    if(body) body.src = bodies[info.clothing[1] - 1];
                    if(pant) pant.src = pants[info.clothing[2] - 1];
            }
            else{
                info.clothing = [0,0,0];
            }
        }
     };
    //console.log('data='+JSON.stringify(info))
    xhr.send('data="'+info.email+'"');
    //info.clothing = "2 4 0";
    
}
    
function getCourseName( i ){
    // if false, tell them to make more questions and send back to topic page
    // otherwise, set questions to be questions from PHP
    // get questions 
    xhr = new XMLHttpRequest();
    xhr.open("POST","http://innovatotech.com/getCourseName.php", false);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.onreadystatechange = function(){
        if(xhr.status == 200){
            //console.log(xhr.responseText)
            var response = JSON.parse(xhr.responseText || "false");
            questions[i].course = response?response:null;
        }
    };
    //console.log(questions)
    xhr.send('data="'+ questions[i].course_id +'"');
}

function shuffle(array){
    var temp = [];
    
    while(array.length){
        var i = Math.floor(Math.random()*array.length);
        temp.push(array[i]);
        array.splice(i,1);
    }
    return temp;
}

function HealthMC(HP){
    stagefight.font = "150px Lato";
    stagefight.fillStyle = "black";
    stagefight.fillText("Health: "+HP,55*scale,147*scale);
}

function HealthEnemy(EnemyHP){
    stagefight.font = "150px Lato";
    stagefight.fillStyle = "black";
    stagefight.fillText("Health: "+EnemyHP ,202*scale,147*scale);
}



function showQuestion(){
	getCourseName(current);
	question = questions[current];
    
	var zone = document.getElementById("response");
	zone.innerHTML = "";
	
	document.getElementById("course").innerHTML = question.course?question.course:"Unknown Course";
	document.getElementById("topic").innerHTML = question.topic?question.topic:"Unknown Topic";
	if(document.getElementById("question").childNodes.length == 2 || document.getElementById("question").childNodes.length == 5){
		var text = document.createTextNode(question.question);
		document.getElementById("question").appendChild(text);
	}
    else if(document.getElementById("question").children.length == 3) {
            document.getElementById("question").removeChild(document.getElementById("question").children[2])
            var text = document.createTextNode(question.question);
            document.getElementById("question").appendChild(text);
    } else{
       
		document.getElementById("question").childNodes[document.getElementById("question").childNodes.length - 1].nodeValue = question.question;
	}
	
	switch(question.type){
		  case "mc":
				zone.setAttribute("data-type", "mc");
				var buttons = [];
			  var indices = shuffle([0,1,2,3]);
			  for(var i = 0; i< 4; i++){
					buttons.push(document.createElement("button"));
					buttons[i].innerHTML = question[indices[i]?"option_"+(indices[i]).toString():"answer"];
					buttons[i].className = "options";
					buttons[i].onclick =function(){ checkAnswer(this);};
					zone.appendChild(buttons[i]);
				}
				break;
			
		  case "tf":
				zone.setAttribute("data-type", "tf");
			
				var buttons = [];
			  buttons.push(document.createElement("button"));
				buttons.push(document.createElement("button"));
				var i = shuffle([0,1]);
				
			  buttons[i[0]].innerHTML = question.answer;
			  buttons[i[0]].className = "options";
			  buttons[i[0]].onclick = function(){ checkAnswer(this);};
			  
			  buttons[i[1]].innerHTML = JSON.parse(JSON.parse(question.answer.toLowerCase())?"false":"true");
			  buttons[i[1]].className = "options";
			  buttons[i[1]].onclick = function(){ checkAnswer(this);};

				zone.appendChild(buttons[0]);
			  zone.appendChild(buttons[1]);
				break;
        case "img":
            document.getElementById("question").removeChild(
                document.getElementById("question").childNodes[document.getElementById("question").childNodes.length - 1]
                );
            var imgQuestion = document.createElement("img");
            imgQuestion.src = question.question;
            imgQuestion.onclick = function(){
                showLightbox(this);
            }
            document.getElementById("question").appendChild(imgQuestion);
            //fallthrough to term definition format;
        case "td":
		default:
				zone.setAttribute("data-type", "td");
			
				 var response = document.createElement("input");
			     response.className = "response";
				 response.placeholder = "Term ...";
                 
                 
			
				var button = document.createElement("button");
				button.innerHTML = "Fight!";
			    button.className = "attack";
				button.onclick = function(){ checkAnswer(this.parentNode.children[0]);};
                response.addEventListener("keyup", function(event) {
                     event.preventDefault();
                     if (event.keyCode == 13) {
                         button.click();
                     }
                });
			
				zone.appendChild(response);
				zone.appendChild(button);
	}
	
}

function checkAnswer(el){
	var question = questions[current];
	var zone = document.getElementById("response");
	// unnecessary ...  question variable hasn't changed
	//questionType = zone.getAttribute("data-type");
	var val = (question.type == "td" || question.type == "img")?el.value:el.innerHTML;
	if(val.toLowerCase() == question.answer.toLowerCase()){
		if(!el.classList.contains('correct')){
		el.classList.toggle("correct");
		}
        setTimeout(function(){
            EnemyHP--;
        
            
            if(EnemyHP > 0){
                flash(1);
                current++;
                showQuestion();
                
            }else{
                flash(1);
                draw(24*scale,180*scale);
                
                //alert("Victory! You have progressed!");
                //redirect to map page
                info.next = true;
                location.href = "map.html?"+JSON.stringify(info);
            }
        }, 1000);
		//Got it right stufts
		
		
		
		
	}
	else{
        if(question.topic && question.course && !checkIn(info.mistakes, [question.course, question.topic]) ){
            info.mistakes.push([question.course, question.topic]);
        }
		if(!el.classList.contains('wrong')){
			el.classList.toggle("wrong");
		}
		
		if(question.type == "mc" || question.type == "tf"){
			for(var i = 0; i < el.parentNode.children.length; i++){
				if(el.parentNode.children[i].innerHTML == question.answer){
					el.parentNode.children[i].classList.toggle("correct");
					setTimeout(function(){
                        HP--;        
                        if (HP > 0){
                            flash(0);
                            //draw(24*scale,180*scale);
                            current++; 
                            showQuestion();
                            
                        }else {
                            flash(0);
                            //draw(24*scale,180*scale);

                            //alert("OH NO you have fainted!");
                            //Redirect to map page
                            info.next = false;
                            location.href = "map.html?"+JSON.stringify(info);
                        }
                    }, 1000);
				}
			}
		} else
		{
            // replace delay, with click to continue
			setTimeout(function(){
				el.value = question.answer;
				el.classList.toggle("correct");
				setTimeout(function(){
                        HP--;        
                        if (HP > 0){
                            flash(0);
                            current++; 
                            showQuestion();
                            
                        }else {
                            flash(0);
                            alert("OH NO you have fainted!");
                            //Redirect to map page
                            info.next = false;
                            location.href = "map.html?"+JSON.stringify(info);
                        }
                    }, 1000);
			}, 1000);
			
		}
	}	
}

function getStep(){
    // make call to server, get step & calculate position
    //console.log(email);
    xhr = new XMLHttpRequest();
    xhr.open("POST","http://innovatotech.com/getStep.php", false);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    
    //get request w/ no params to get MySQL data
    xhr.onreadystatechange = function(){
        if(xhr.status == 200){
            //console.log(xhr.responseText);
            var response = JSON.parse(xhr.responseText || "false");
            if(response){
                info.step = response;
            } else {
                info.step = 0;
            }
        } else {
            info.step = 0;
        }
    };
    xhr.send('data="'+info.email+'"'); 

}


function flash(char){
	//saveState = document.createElement("canvas");
	//saveState.width = stage.width;
	//saveState.height = stage.height;
	//sSctx = saveState.getContext('2d');
	// save canvas drawing
	//sSctx.drawImage(stage, 0, 0);
		//buggy
		// timing should be fixed
	if(char){
		requestAnimationFrame(function(){ 
			slash([2800,150],[1600, 1350], 50, 9);
		});
	} else {
		requestAnimationFrame(function(){ 
			slash([240, 150],[1740,1350], 50, 9);
		});
	}
	
}
function slash(start, end, offset, i){
	dir = (start[1] > end[1])?"u":"d";
	dir += (start[0] > end[0])?"l":"r";
	
	stagefight.clearRect(0,0,stage.width,stage.height);
	//darken screen
	stagefight.fillStyle = "rgba(0,0,0,0.95)";
	stagefight.fillRect(0,0, stage.width,stage.height);
	//default offset to 50
	offset = offset?offset:50;
	// draw slash
	var width = Math.abs(start[0] - end[0]);
	var height = Math.abs(start[1] - end[1]);
	
	if(dir[0] == "d"){
	  end[1] -= (i*height)/10;
	} else {
		end[1] += (i*height)/10;
	}
	if(dir[1] == "l"){
		end[0] += (i*width)/10;
	} else {
		end[0] -= (i*width)/10;
	}
	
	var midPoint = [(start[0] + end[0])/2, (start[1] + end[1])/2];
	
  stagefight.beginPath();
	stagefight.moveTo(start[0],start[1]);
	if(dir == "dr" || dir == "ul"){
		stagefight.quadraticCurveTo(midPoint[0] + (width/height)*offset,
                                    midPoint[1] - (height/width)*offset,
                                    end[0], end[1]
                                   );

		stagefight.quadraticCurveTo(midPoint[0] - (width/height)*offset,
                                    midPoint[1] + (height/width)*offset,
                                    start[0],start[1]
                                   );
	} else {
		stagefight.quadraticCurveTo(midPoint[0] + (width/height)*offset,
                                    midPoint[1] + (height/width)*offset,
                                    end[0], end[1]
                                   );

		stagefight.quadraticCurveTo(midPoint[0] - (width/height)*offset,
                                    midPoint[1] - (height/width)*offset,
                                    start[0],start[1]
                                   );
	}
	stagefight.closePath();
	stagefight.fillStyle = "red";
	stagefight.fill();
	if(dir[0] == "d"){
	  end[1] += (i*height)/10;
	} else {
		end[1] -= (i*height)/10;
	}
	if(dir[1] == "l"){
		end[0] -= (i*width)/10;
	} else {
		end[0] += (i*width)/10;
	}
	
	if(i >= 0){ 
		setTimeout(function(){
			slash(start,end, offset, i - 1);
		}, 16.7);
	} else {
		//restore canvas drawing
        stagefight.clearRect(0,0,stage.width, stage.height);
		// stagefight.drawImage(saveState,0,0);
        draw(24*scale,180*scale);
	}
}
//
function showLightbox(){
	document.getElementById("lightbox").children[1].src = question.question;
    location.hash = "lightbox";
}

/************************************\
================TO DO=================
- replace delay on wrong answer 
  with click to continue
- add background to canvas
- replace health # w/ health bar
- add attack animations (on canvas)


\************************************/
/*
function flash(){
    var el = document.querySelector('.js-flash');
    el.classList.toggle('is-paused');
    //buggy change
    var delay = setTimeout(function(){
        el.classList.toggle('is-paused');
    }, 1000);    
}
function fight(){
    
    //alert("FIGHT");
 
    if(document.getElementById("userInput").value === questions[current].answer){
        
        flash();

        EnemyHP--;
    
        
        if(EnemyHP !== 0){
            draw(24*scale,180*scale);
            current++;
            shuffle();
            
        }else{
            draw(24*scale,180*scale);
            alert("Victory! You have progressed!");
            //redirect to map page
            info.next = true;
            location.href = "map.html?"+JSON.stringify(info);
        }
        
        
    }else{
        
        HP--;
        
        if (HP !== 0){
            draw(24*scale,180*scale);
            current++; 
            shuffle();
            
        }else {
            draw(24,180);
            alert("OH NO you have fainted!");
            //Redirect to map page
            info.next = false;
            location.href = "map.html?"+JSON.stringify(info);
        }
    }
} */
//bogus questions
/*questions = [
        {
        "question": "data:image/jpeg;base64,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",
        "type": "img",
        "answer": "Circuit Breaker and Fuse",
        "option1": null,
        "option2": null,
        "option3": null,
        topic: "Computer Parts",
        course: "TEJ",
    },{
        "question": "What is Parth's favorite color?",
        "type": "mc",
        "answer": "blue",
        "option1": "yellow",
        "option2":"red",
        "option3":"green",
        "topic": "All about Parth",
        "course": "Random"
    }, {
        "question": "Parth's Favourite Color is Blue",
        "type": "tf",
        "answer": "true",
        "option1": null,
        "option2":null,
        "option3":null,
        "topic": "All about Parth",
        "course": "random"
    }, {
        "question": "Parth's Favourite Color is _______.",
        "type": "td",
        "answer": "blue",
        "option1": null,
        "option2": null,
        "option3":null,
        "topic": "All about Parth", 
        "course": "Random"
    }, {
        "question": "How many feet do I have?",
        "type": "mc",
        "answer": "2",
        "option1": "4",
        "option2": "3",
        "option3": "none",
    },
    {
        "question": "How many feet do I have?",
        "type": "mc",
        "answer": "2",
        "option1": "4",
        "option2": "3",
        "option3": "none",
    },
    {
        "question": "How many feet do I have?",
        "type": "mc",
        "answer": "2",
        "option1": "4",
        "option2": "3",
        "option3": "none",
    },
    {
        "question": "How many feet do I have?",
        "type": "mc",
        "answer": "2",
        "option1": "4",
        "option2": "3",
        "option3": "none",
    }];*/