// variables for canvas
var canvas = document.querySelector("#canvas");
var cx = canvas.getContext("2d");
var img = document.createElement("img");
img.src = "https://u.imageresize.org/502b2902-d401-485e-bf49-bc62b025a699.png";
// control variables
var isPaused = false;
var isFire_1 = false;
var isFire_2 = false;
var score_1 = 0;
var score_2 = 0;
var remChances_1 = 4;
var remChances_2 = 4;
var angle_1 = Math.PI / 2;
var angle_2 = Math.PI / 2;
var weapon_1 = "heaver";
var weapon_2 = "heaver";

// texts for display
function displayText() {
	// center text
	cx.font = "30px Courier New";
	cx.fillStyle = "#FF3D00";
	cx.textAlign = "center";
	cx.fillText("POCKET TANKS", canvas.width / 2, 50);

	cx.font = "10px Arial";
	cx.fillStyle = "#E1F5FE";
	cx.textAlign = "center";
	cx.fillText("(Use mouse to play)", canvas.width / 2, 70);

	//player1 info
	cx.font = "18px Verdana";
	cx.fillStyle = "#E0E0E0";
	cx.textAlign = "left";
	cx.fillText(`Player 1`, 20, 30);

	cx.font = "12px Verdana";
	cx.fillStyle = "#368cbf";
	cx.textAlign = "left";
	cx.fillText(`SCORE : ${score_1}`, 20, 55);

	cx.font = "12px Verdana";
	cx.fillStyle = "#f5df65";
	cx.fillText(`Chances : ${remChances_1 - 1}`, 20, 80);

	// Player_2 info

	cx.font = "18px Verdana";
	cx.fillStyle = "#E0E0E0";
	cx.textAlign = "right";
	cx.fillText(`Player 2`, canvas.width - 20, 30);

	cx.font = "12px Verdana";
	cx.fillStyle = "#368cbf";
	cx.textAlign = "right";
	cx.fillText(`SCORE : ${score_2}`, canvas.width - 20, 55);

	cx.font = "12px Verdana";
	cx.fillStyle = "#f5df65";
	cx.textAlign = "right";
	cx.fillText(`Chances : ${remChances_2 - 1}`, canvas.width - 20, 80);
}

// Weapon Selector
function changeWeapon() {
	if (document.getElementById("weapon-selector").value == "heaver") {
		weapon_1 = "heaver";
		weapon_2 = "heaver";
	}
	if (document.getElementById("weapon-selector").value == "hurler") {
		weapon_1 = "hurler";
		weapon_2 = "hurler";
	}
	if (document.getElementById("weapon-selector").value == "pitcher") {
		weapon_1 = "pitcher";
		weapon_2 = "pitcher";
	}
}
// click fire action
const fire = document.querySelector("#fire-weapon");
fire.addEventListener("click", function(e) {
	if (remChances_1 == 4) {
		isFire_1 = true;
		if (remChances_1 >= 1) {
			remChances_1--;
		}
		isFire_2 = false;
	} else if (isFire_1 && !isFire_2) {
		isFire_2 = true;
		if (remChances_2 >= 1) {
			remChances_2--;
		}
		isFire_1 = false;
	} else if (!isFire_1 && isFire_2) {
		isFire_1 = true;
		if (remChances_1 >= 1) {
			remChances_1--;
		}
		isFire_2 = false;
	}
});
//Slider for Angle
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value + "deg";

slider.oninput = function() {
	output.innerHTML = `${this.value}deg`;
	angle_1 = Math.PI * this.value / 180;
	angle_2 = Math.PI * this.value / 180;
};

//Restart, Pause ,Resume
const controlItems = document.querySelector("#control-items");
const pause = document.querySelector(".fa-pause-circle");
const redo = document.querySelector(".fa-redo");
let resume = null;
function restartGame() {
	document.location.reload(true);
}
controlItems.addEventListener("click", function(e) {
	if (e.target == pause && !resume) {
		resume = document.createElement("i");
		resume.className = "far fa-play-circle";
		resume.style.marginRight = 10 + "px";
		controlItems.insertBefore(resume, pause);
		isPaused = true;
	} else if (e.target == redo) {
		if (resume) {
			controlItems.removeChild(resume);
			resume = null;
			restartGame();
		} else {
			restartGame();
		}
	} else if (e.target == resume) {
		controlItems.removeChild(resume);
		resume = null;
		isPaused = false;
	}
});

//variables for projectile-one
var x_1;
var y_1;
var u_1 = 82;
var time_1 = 0.01;
var timeOfFlight_1 = 2 * u_1 * Math.sin(angle_1) / 10;
var hitMountain_1 = false;

// reset projectile two
function resetProjectileTwo() {
	x_1 = 0;
	y_1 = 0;
	u_1 = 82;
	time_1 = 0.01;
	timeOfFlight_1 = 2 * u_1 * Math.sin(angle_1) / 10;
	hitMountain_1 = false;
}

// For  Projectile Two
var x_2;
var y_2;
var u_2 = 82;
var time_2 = 0.1;
var timeOfFlight_2 = 2 * u_2 * Math.sin(angle_2) / 10;
var hitMountain_2 = false;

// resetProjectileOne
function resetProjectileOne() {
	x_2 = 0;
	y_2 = 0;
	u_2 = 82;
	time_2 = 0.1;
	timeOfFlight_2 = 2 * u_2 * Math.sin(angle_2) / 10;
	hitMountain_2 = false;
}
// for powerSelector
function changePower() {
	if (document.getElementById("power-selector").value == "weak") {
		u_1 = 50;
		u_2 = 50;
	}
	if (document.getElementById("power-selector").value == "normal") {
		u_1 = 70;
		u_2 = 70;
	}
	if (document.getElementById("power-selector").value == "strong") {
		u_1 = 85;
		u_2 = 85;
	}
}

// variables for mountain
const maxHeight = canvas.height - 100;
var maxSlope = 2.5; // horizontal pixel per vertical pixel
var slopeChange = 1.0;
var permanentSlope = 0;
var currentHeight = canvas.height - 100;
var slope = Math.random() * maxSlope * 2 - maxSlope;
var slopeArray = [];
for (let i = 0; i < 373; ++i) {
	slopeArray[i] = {
		x: Math.random() * slopeChange * 2 - slopeChange,
		y: 0
	};
}

// function for creating mountain
function drawMountain() {
	let i = 0;
	for (var x = 187; x < 560; x++) {
		currentHeight += slope;
		slope += slopeArray[i].x;

		if (slope > maxSlope) {
			slope = maxSlope;
		}
		if (slope < -maxSlope) {
			slope = -maxSlope;
		}

		if (currentHeight > maxHeight) {
			currentHeight = maxHeight;
			slope *= -1;
		}
		if (currentHeight < 150) {
			currentHeight = 150;
			slope *= -1;
		}
		if (x > 490 || x < 492) {
			permanentSlope = 170 / (maxHeight - currentHeight);
		}
		if (x > 492) {
			slope = permanentSlope;
		}

		slopeArray[i++].y = currentHeight;
		// drawing of mountains
		cx.beginPath();
		cx.moveTo(x, maxHeight);
		cx.lineTo(x, currentHeight);
		cx.strokeStyle = "#00C853";
		cx.stroke();
		cx.closePath();
	}
}

// draw ground for tanks
function drawGround() {
	cx.beginPath();
	cx.moveTo(0, maxHeight + 1);
	cx.lineTo(canvas.width, maxHeight + 1);
	cx.strokeStyle = "#00C853";
	cx.stroke();
	cx.closePath();
}
// for image sprites -tank
//function drawTank(){
//}
// for image sprites - blast
//function drawBlast(){
//}

//Calculate projectile position for tank one
function calcPositionOne() {
	x_1 = u_1 * Math.cos(angle_1) * time_1;
	y_1 = -(u_1 * Math.sin(angle_1) * time_1 - 0.5 * 10 * time_1 * time_1);
}

// Draw Projectile-one
function drawProjectileOne() {
	calcPositionOne();
	for (let i = 0; i < slopeArray.length; ++i) {
		if (120 + x_1 >= 187 && 120 + x_1 < 560) {
			let index = 120 + x_1 - 187;
			if (y_1 + 320 > slopeArray[Math.floor(index)].y) {
				hitMountain_1 = true;
			}
		}
	}
	if (!hitMountain_1) {
		time_1 += 0.1;

		if (weapon_1 == "hurler") {
			cx.beginPath();
			cx.arc(120 + x_1, 320 + y_1, 12, 0, 7);
			cx.fillStyle = "#FFFF00";
			cx.fill();
			cx.closePath();
			cx.beginPath();
			cx.arc(120 + x_1, 320 + y_1, 8, 0, 7);
			cx.fillStyle = "#1A237E";
			cx.fill();
			cx.closePath();
			cx.beginPath();
			cx.arc(120 + x_1, 320 + y_1, 4, 0, 7);
			cx.fillStyle = "#D50000";
			cx.fill();
			cx.closePath();
		} else if (weapon_1 == "pitcher") {
			cx.beginPath();
			cx.arc(120 + x_1, 320 + y_1, 8, 0, 7);
			cx.fillStyle = "#1A237E";
			cx.fill();
			cx.closePath();
			cx.beginPath();
			cx.arc(120 + x_1, 320 + y_1, 4, 0, 7);
			cx.fillStyle = "#D50000";
			cx.fill();
			cx.closePath();
		} else {
			cx.beginPath();
			cx.arc(120 + x_1, 320 + y_1, 4, 0, 7);
			cx.fillStyle = "#D50000";
			cx.fill();
			cx.closePath();
		}
	}
	if (120 + x_1 > 611 && 120 + x_1 < 661 && 320 + y_1 > 307) {
		if (weapon_1 == "hurler") {
			score_1 += 1500;
		} else if (weapon_1 == "pitcher") {
			score_1 += 1000;
		} else {
			score_1 += 500;
		}
	}
}
// For tank-two
function calcPositionTwo() {
	x_2 = -u_2 * Math.cos(angle_2) * time_2;
	y_2 = -(u_2 * Math.sin(angle_2) * time_2 - 0.5 * 10 * time_2 * time_2);
}

// Draw Projectile-two
function drawProjectileTwo() {
	calcPositionTwo();
	for (let i = 0; i < slopeArray.length; ++i) {
		if (621 + x_2 >= 187 && 621 + x_2 < 560) {
			let index = 621 + x_2 - 187;
			if (y_2 + 320 > slopeArray[Math.floor(index)].y) {
				hitMountain_2 = true;
			}
		}
	}
	if (!hitMountain_2) {
		time_2 += 0.1;
		if (weapon_2 == "hurler") {
			cx.beginPath();
			cx.arc(621 + x_2, 320 + y_2, 12, 0, 7);
			cx.fillStyle = "#FFFF00";
			cx.fill();
			cx.closePath();
			cx.beginPath();
			cx.arc(621 + x_2, 320 + y_2, 8, 0, 7);
			cx.fillStyle = "#1A237E";
			cx.fill();
			cx.closePath();
			cx.beginPath();
			cx.arc(621 + x_2, 320 + y_2, 4, 0, 7);
			cx.fillStyle = "#D50000";
			cx.fill();
			cx.closePath();
		} else if (weapon_2 == "pitcher") {
			cx.beginPath();
			cx.arc(621 + x_2, 320 + y_2, 8, 0, 7);
			cx.fillStyle = "#1A237E";
			cx.fill();
			cx.closePath();
			cx.beginPath();
			cx.arc(621 + x_2, 320 + y_2, 4, 0, 7);
			cx.fillStyle = "#D50000";
			cx.fill();
			cx.closePath();
		} else {
			cx.beginPath();
			cx.arc(621 + x_2, 320 + y_2, 4, 0, 7);
			cx.fillStyle = "#D50000";
			cx.fill();
			cx.closePath();
		}
	}
	if (621 + x_2 > 72 && 621 + x_2 < 142 && 320 + y_2 > 307) {
		if (weapon_2 == "hurler") {
			score_2 += 1500;
		} else if (weapon_2 == "pitcher") {
			score_2 += 1000;
		} else {
			score_2 += 500;
		}
	}
}

// Drawing actual game
function drawGame() {
	if (!isPaused) {
		cx.clearRect(0, 0, canvas.width, canvas.height);
		displayText();

		//Projectile one
		if (isFire_1 && remChances_1 >= 1) {
			if (time_1 < timeOfFlight_1) {
				drawProjectileOne();
			}
			if (time_1 > timeOfFlight_1 || hitMountain_1) {
				resetProjectileOne();
			}
		}
		//Projectile 2
		if (isFire_2 && remChances_2 >= 1) {
			if (time_2 < timeOfFlight_2) {
				drawProjectileTwo();
			}
			if (time_2 > timeOfFlight_2 || hitMountain_2) {
				resetProjectileTwo();
			}
		}
		drawMountain();
		drawGround();
		//drawTank()
		if (remChances_1 == 0 && remChances_2 == 0) {
			if (score_1 > score_2) {
				cx.font = "bold 34px Times New Roman";
				cx.fillStyle = "#FBC02D";
				cx.textAlign = "center";
				cx.fillText("PLAYER 1 WINS !!", canvas.width / 2, 150);

				cx.font = "14px Verdana";
				cx.fillStyle = "#E0E0E0";
				cx.textAlign = "center";
				cx.fillText(`(Click Retry to Play Again)`, canvas.width / 2, 180);
			} else if (score_1 == score_2) {
				cx.font = "bold 34px Times New Roman";
				cx.fillStyle = "#FBC02D";
				cx.textAlign = "center";
				cx.fillText("GAME TIED !!", canvas.width / 2, 150);

				cx.font = "14px Verdana";
				cx.fillStyle = "#E0E0E0";
				cx.textAlign = "center";
				cx.fillText(`(Click Retry to Play Again)`, canvas.width / 2, 180);
			} else {
				cx.font = "bold 34px Times New Roman";
				cx.fillStyle = "#FBC02D";
				cx.textAlign = "center";
				cx.fillText("PLAYER 2 WINS !!", canvas.width / 2, 150);

				cx.font = "14px Verdana";
				cx.fillStyle = "#E0E0E0";
				cx.textAlign = "center";
				cx.fillText(`(Click Retry to Play Again)`, canvas.width / 2, 180);
			}
		}
	}
	window.requestAnimationFrame(drawGame);
}
drawGame();