
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");
const  p = document.createElement('p');
const div = document.querySelector(".clock-timer");



var timer = [0,0,0,0];
var interval;
var timerRunning = false;

// Add leading zero to numbers 9 or below (purely for aesthetics):
function leadingZero(time) {
    
    if (time <= 9) {
        
        time = "0" + time;
    }
    
    return time;
}

// Run a standard minute/second/hundredths timer:
function runTimer() {
    
    let currentTime = leadingZero(timer[0]) + ":" + leadingZero(timer[1]) + ":" + leadingZero(timer[2]);
    
    theTimer.innerHTML = currentTime;
    timer[3]++;
    
    timer[0] = Math.floor((timer[3]/100)/60);
    timer[1] = Math.floor((timer[3]/100) - (timer[0] * 60));
    timer[2] = Math.floor(timer[3] - (timer[1] * 100) - (timer[0] * 6000));
}

// Match the text entered with the provided text on the page:
function spellCheck() {
    
    let textEntered = testArea.value;
    let originTextMatch = originText.substring(0, textEntered.length);
  var length=textEntered.length;

    
    if(textEntered == originText) {
        
        clearInterval(interval);
          this.removeEventListener('keypress',disable);
        var typeSpeed= Math.floor(length/(timer[0]*60 + timer[1]));
         p.innerHTML='Your typing speed is '+ typeSpeed+' characters per second.';
      div.appendChild(p);
        
    } else {
        
        if(textEntered  == originTextMatch) {
          this.removeEventListener('keypress',disable);
          var remaining =originText.slice(length);
          var newhtml='<span class="highlight-green">'+originTextMatch+'</span>' + remaining;
          document.querySelector("#origin-text p").innerHTML=newhtml;
          
          
        } else { this.addEventListener('keypress',disable);   
              
                    var remaining2 =originText.slice(length);
          var newhtml2='<span class="highlight-green">'+originTextMatch.slice(0,length-1)+'</span><span class="highlight-red">'+originTextMatch.slice(length-1,length)+'</span>' + remaining2;
          document.querySelector("#origin-text p").innerHTML=newhtml2;          
                       
           
        }
    }
    
}

// Start the timer:
function start() {
    
    let textEnteredLength = testArea.value.length;
    
    if (textEnteredLength === 0 && !timerRunning ){
        
        timerRunning = true;
        interval = setInterval(runTimer, 10);
    }
    
    
}

// Reset everything:
function reset() {
    
    clearInterval(interval);
    interval = null;
    timer = [0,0,0,0];
    timerRunning = false;
    testArea.value = "";
    theTimer.innerHTML = "00:00:00";
    document.querySelector("#origin-text p").innerHTML="First of all things, nothing is a burden as long as you love it. We at Spider believe strongly in this principle. And we obviously would expect the same from our future members. So, feel relaxed and be cheerful while solving the tasks we will be giving during the course of our inductions process, as the main aim is not to see who finishes first, but to find who has travelled the farthest. Let's begin our journey."; 
  if(div.children.length > 2) {
    div.removeChild(p);}
 
   
}
//Call back function
function disable(e){
  e.preventDefault();
}
// Event listeners for keyboard input and the reset button:
testArea.addEventListener("keypress", start, false);
testArea.addEventListener("keyup", spellCheck, false );
resetButton.addEventListener("click", reset, false);

var typeSpeed= Math.floor(testArea.value.length/(timer[0]*60 + timer[2]));
