// on fight page, getStep(), use it to choose monster/boss img & hp, pass step along to map page (w/ changes)
//helper variables
var canvas, ctx;
var mapBG, locMarker, grid, info;
var path = ["DR 2 0", "DR 2 0", "UR 1 0", "DR 1 0", "DR 1 -1", "DR 1 -1", "DL 3 0", "UL 2 0", "UL 3 0", "DL 2 0", "DL 2 0", "DR 2 0", "DR 2 0", "UR 1 0", "DR 2 0"];
//helper function
function repeat(string, n){
    result = "";
    for(var i = 0; i < n; i++){
        result += string;
    }
    return result;
}

// on fight
var step = 0;
function preloader(){
    var n = 1;
    //console.log(n)
    loader = setInterval(function(){
        ctx.clearRect(0,0,canvas.width, canvas.height);
        ctx.font = "64px Georgia";
        ctx.textAlign = 'center';
        ctx.fillStyle = '#38B775';
        ctx.fillText("Loading"+repeat(".",n),canvas.width/2, canvas.height/2);
        n = n % 6 + 1;
    }, 100);
}
//Helper functions
function preload(){
    //get email from location.search
    //get continue for location.search
    info = JSON.parse(decodeURI(location.search).substring(1));
    
    
    //mistakes = [["Course", "Topic"], ["Course", "Topic"], ["Course", "Topic"], ["Course", "Topic"]];
    // should be maxed out at 4 since user always has 4 hp
    //set up canvas & preload images
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
	mapBG = new Image();
	locMarker = new Image();
	mapBG.src = "./assets/map.png";
	locMarker.src = "https://vincentdamerique.com/skin/frontend/minimalism/vincent/img/icons/location-pin-white.svg";
    preloader();
    
    
    mapBG.onload = function(){
        //stop animation
        clearInterval(loader);
        ctx.clearRect(0,0,canvas.width, canvas.height);
        
        //rotate (and scale) grid to make it isometric
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(1, 0.5);
        ctx.rotate(45 * Math.PI / 180);
        
        grid = new Grid();
        //getStep();
        
        
        // canvas.addEventListener("click", function(e){
            // followPath(step);
            // step++;
        // });
        
        var center = getCenter(info.step);
        grid.moveCenter(center[0],center[1],center[2]);
        if(info.next){
            
            followPath(info.step);
            info.step++;
            sendStep();
            //setTimeout(setUp, 5000);
        } else {
            setTimeout(setUp, 2000);
        }
        
        
    }
    
    
    
}

function drawGrid() {
	var xBound = Math.floor(grid.width / 2);
	var yBound = grid.height - 1 - xBound;
	//Draw Gridlines
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = "black";
	for (var i = 0; i <= grid.height / 2; i++) {
		// mid forward slashes
		ctx.moveTo(100 * (xBound - i) + 50, 100 * (yBound - i) + 50);
		ctx.lineTo(100 * (xBound - i) + 50, 100 * (-xBound - 1 - i) + 50);
		ctx.stroke();
		// mid back slashes
		ctx.moveTo(100 * (yBound - i) + 50, 100 * (xBound - i) + 50);
		ctx.lineTo(100 * (-xBound - 1 - i) + 50, 100 * (xBound - i) + 50);
		ctx.stroke();
	}
	for (var i = 1; i < grid.width; i++) {
		ctx.moveTo(100 * (xBound + i) + 50, 100 * (yBound - i) + 50);
		ctx.lineTo(100 * (xBound + i) + 50, 100 * (-xBound - 1 + i) + 50);
		ctx.stroke();

		ctx.moveTo(100 * (-xBound - i) - 50, 100 * (-yBound + i) - 50);
		ctx.lineTo(100 * (-xBound - i) - 50, 100 * (xBound + 1 - i) - 50);
		ctx.stroke();

		ctx.moveTo(100 * (yBound - i) + 50, 100 * (xBound + i) + 50);
		ctx.lineTo(100 * (-xBound - 1 + i) + 50, 100 * (xBound + i) + 50);
		ctx.stroke();

		ctx.moveTo(100 * (-yBound + i) - 50, 100 * (-xBound - i) - 50);
		ctx.lineTo(100 * (xBound + 1 - i) - 50, 100 * (-xBound - i) - 50);
		ctx.stroke();
	}
	ctx.closePath();
}

function drawBlock(x,y, h, color) {
    color = color ? color:"red";
	var x = x - grid.center[0];
	var y =  y - grid.center[1];
    x = x * 100 - 100 / 2 -25*h;
    y = -y * 100 - 100 / 2 -25*h 
    
    ctx.beginPath();
    ctx.arc(x + 50, y + 50, 25, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
	//ctx.fillRect(x,y, 100, 100);
}

function moveBackground(cropX, cropY) {
	cropX = -cropX;
	cropY = -cropY;	
		ctx.save();
        //center at [ - 2, -3]
		ctx.rotate(-45 * Math.PI / 180);
		ctx.scale(1, 2);
		ctx.translate(-500, -500);
		ctx.clearRect(0,0,canvas.width, canvas.height);
	ctx.drawImage(mapBG, (cropX + cropY) * (Math.sqrt(2) * 50) - (-2+1.225-0.075)*(Math.sqrt(2) * 50),
                         (cropX - cropY) * (50 / Math.sqrt(2)) - (-2+1.225+0.075)* (50 / Math.sqrt(2)),
                         mapBG.width*0.3075, mapBG.height*0.3075
                 );
    
		ctx.restore();
	    //drawGrid();
		drawLayer2();
		
}	

function followPath(i){
    //console.log(i);
	var move = path[i].split(" ");
	move[1] = parseInt(move[1]);
    move[2] = parseInt(move[2]);
	if(move[0] == "UR"){
		var j = 0;
		var anim = setInterval(function(){
				if (j == move[1]) {
					clearInterval(anim);
                    setTimeout(setUp, 2000);
				} else {
					grid.moveCenter(0, 1, move[2]);
					j++;
				}
				
			}, 100);
	}
	else if(move[0] == "UL"){
		var j = 0;
		var anim = setInterval(function(){
				if (j == move[1]) {
					clearInterval(anim);
                    setTimeout(setUp, 2000);
				} else {
					grid.moveCenter(-1, 0, move[2]);
					j++;
				}
				
			}, 100);
	}
	else if(move[0] == "DR"){
		var j = 0;
		var anim = setInterval(function(){
				if (j == move[1]) {
					clearInterval(anim);
                    setTimeout(setUp, 2000);
				} else {
					grid.moveCenter(1,0, move[2]);
					j++;
				}
				
			}, 100);
		
	}
	//BM
	else if(move[0] == "DL"){
		var j = 0;
		var anim = setInterval(function(){
				if (j == move[1]) {
					clearInterval(anim);
                    setTimeout(setUp, 2000);
				} else {
					grid.moveCenter(0,-1, move[2]);
					j++;
				}
				
			}, 100);
	}
    
}

function addImage(imageObj, x, y, width, height) {
    width = width?width:false;
    height = height?height:false;
    ctx.save();
    ctx.rotate(-45 * Math.PI / 180);
    ctx.scale(1, 2);
    ctx.translate(-500, -500);
    ctx.drawImage(imageObj, x - (width ? width : imageObj.width) / 2, y - (height ? height : imageObj.height), width ? width : imageObj.width, height ? height : imageObj.height);
    ctx.restore();
}

function distance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function drawLayer2(){
	/* for (loc in grid.locs) {
	var poses = []
	for (var i = 0; i < grid.poses.length; i++) {
		poses.push(grid.poses[i][0].toString() + " " + grid.poses[i][1].toString())
	}
	//check if interesting area is visible ... then highlight based on type
	if (poses.indexOf(loc) != -1) {
		switch (grid.locs[loc][0]) {
			case "monster":
				drawBlock(parseInt(loc.split(" ")[0]), parseInt(loc.split(" ")[1]), 0);
				break;
			case "loot":
				drawBlock(parseInt(loc.split(" ")[0]), parseInt(loc.split(" ")[1]),0 , "yellow");
				break;
			case "boss":
				drawBlock(parseInt(loc.split(" ")[0]), parseInt(loc.split(" ")[1]),0 , "#0f0");
				break;
		}
	} 
}*/
for(var i = 0; i <= path.length; i++){
    loc = getCenter(i);
    drawBlock(loc[0], loc[1], loc[2], "rgba(225,25,25,0.2)");
    // "rgba(8,59,106,0.3)"
}

//show center
  drawBlock(grid.center[0], grid.center[1], 0,"rgba(255,255,255,0.15)");
  addImage(locMarker, 500, 500, 96, 96);
}

function Grid() {
	this.locs = {
		"-1 1": ["loot"],
		"1 3": ["boss"],
		"12 -8": ["loot"],
	};
	this.poses = [];
	this.center = [0, 0];
	// number of half blocks up and across
	this.width = Math.floor(canvas.width / (100 * Math.sqrt(2)));
	this.height = Math.floor((2 * canvas.height) / (100 * Math.sqrt(2)));
	this.calcPoses = function() {
		// and all middle blocks to poses
		for (var i = Math.ceil(this.width / -2); i <= Math.floor(this.width / 2); i++) {
			for (var j = 1 - this.width - i; j <= this.width - 1 - i; j++) {
				this.poses.push([i + this.center[0], j + this.center[1]]);
			}
		}
		// add corner blocks
		for (var i = Math.floor(this.width / 2) + 1; i <= Math.floor(this.width) + this.width - 1; i++) {
			for (var j = i - this.width * 2 + 1; j <= -i + 6; j++) {
				this.poses.push([i + this.center[0], j + this.center[1]]);
				this.poses.push([-i + this.center[0], -j + this.center[1]]);
			}
		}
	};
	this.moveCenter = function(translateX, translateY, translateH) {
		this.center = [this.center[0] + translateX - 0.25*translateH, this.center[1] + translateY + 0.25*translateH];
		this.calcPoses();
		moveBackground(this.center[0], this.center[1]);
	};
	this.addLoc = function(loc, locType) {
		if (loc in this.locs) {
			if (this.locs[loc].indexOf(locType) == -1) {
				this.locs[loc].push(locType);
			} else {
				return "already in locs";
			}
		} else {
			this.locs[loc] = [locType];
		}
	};
	this.delLoc = function(loc) {
		delete this.locs[loc];
	};
}

function getCenter(step){
    center = [0,0,0];
    
    for(var i = 0; i < step; i++){
        var move = path[i].split(" ");
        move[1] = parseInt(move[1]);
        move[2] = parseInt(move[2]);
        center[2] += move[2]
        
        if(move[0] == "UR"){
            center[1] += move[1];
        }
        else if(move[0] == "UL"){
            center[0] -= move[1];
        }
        else if(move[0] == "DR"){
            center[0] += move[1];
            
        }
        else if(move[0] == "DL"){
            center[1] -= move[1];
            
        }
    }
    return center;
}

function sendStep(){
    // make call to server, get step & calculate position
    var data = {
        "email": info.email,
        "step": info.step
    };
    data = JSON.stringify(data);
    xhr = new XMLHttpRequest();
    xhr.open("POST","http://innovatotech.com/setStep.php", false);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    
    //get request w/ no params to get MySQL data
    xhr.onreadystatechange = function(){
        if(xhr.status == 200){
            var response = JSON.parse(xhr.responseText || "false");
            if(response){
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };
    xhr.send("data="+data);
}

function setUp(){
	var overlay = document.getElementById("overlay");
	if(info.next){
		overlay.children[1].innerHTML = "Huzzah!";
		overlay.children[2].innerHTML = "You conquered today's beast! <span></span> Keep up the good work. ";
		overlay.children[2].children[0].innerHTML = info.mistakes.length?"You should review these topics to stay sharp.":"You made no mistakes today. Congrats!";
	} else {
		overlay.children[1].innerHTML = "Oh Snap!";
		overlay.children[2].innerHTML = "You died but that's OK, the monsters were strong today. You can try again tomorrow. <span>Prepare yourself by studying these topics.</span>";
	}
	for(var i = 0; i < info.mistakes.length; i++){
        mistake = document.createElement("div");
		mistake.className = "topic";
        mistake.innerHTML = info.mistakes[i][0] + " &raquo " + info.mistakes[i][1];
        document.getElementById("review").appendChild(mistake);
            
	}
    overlay.style.opacity = "1";
	
}


/******************\
//direction schema
change h values +/- 1 
to move grid up or down
by 1
    ul(-1,0) ur(0,1)
     \       /
      \     /
	   \   /
        \ /
         x
        / \
       /   \
	  /     \
     /       \
    /         \
   dl(0,-1)  dr(1,0)
\*****************/

/*********************************************************\
================= Things to make and do ===================



- Add loot, monsters and bosses function to grid class

- replace "position" marker with animated character sprite
- fix click on grid block algorithm (corners are wrong)
========================== DONE ===========================
- position system to move around (from center)
- Add abililty to encode zones on grid areas
- Encode monsters, loot and boss onto map
- click on grid blocks
- add map background
- move grid center
- add ability to move up and down by n units
- encode end points on path (add ability to move blocks up / down n-blocks)
- create set monster list based on grid loc 

- get email & whether to increment
- get current step & save subsequent step
\*********************************************************/