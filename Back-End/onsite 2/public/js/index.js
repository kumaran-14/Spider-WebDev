var SpeechRecognition = webkitSpeechRecognition
var SpeechRecognitionEvent = webkitSpeechRecognitionEvent
var commands = ['draw circle','draw rectangle','draw square','right','left','up','down','red','blue','green']

var recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let listenButton = document.querySelector('#listen')
let commandText = document.querySelector('.command')
var myCanvas = document.querySelector('canvas')
const cx = myCanvas.getContext('2d')
let i=0,j=0

listenButton.onclick = function() {
  recognition.start();
  console.log('Speak now.');
}

recognition.onresult = function(event) {
  var last = event.results.length - 1;
  var result = event.results[last][0].transcript;
  switch(result){
    //for 'draw circle'
    case commands[0]:
      console.log('circle')

      cx.clearRect(0,0,500,500);
      cx.beginPath()
      cx.arc(200,200,50,0,7);
      cx.stroke()
      cx.closePath();
      break;
    //for 'draw rectangle'
    case commands[1]:
      console.log('rect')

      cx.clearRect(0,0,500,500);
      cx.beginPath()
      cx.rect(150,150,100,200)
      cx.stroke()
      cx.closePath();
      break;
    //for 'draw square'
    case commands[2]:
      console.log('square')

      cx.clearRect(0,0,500,500);
      cx.beginPath()
      cx.rect(150,150,100,100)
      cx.stroke()
      cx.closePath();
      break;
    //for 'move right'
    case commands[3]:
      console.log('right')

      cx.translate((i=i+20,i),j)
      break;
      //for 'move left'
    case commands[4]:
      console.log('left')
      cx.save()
      i=i-20
      cx.translate(i,j)
      break;
      //for 'move up'
    case commands[5]:
      console.log('up')

      cx.translate(i,(j=j-20,j))
      break;
    //for 'move down'
    case commands[6]:
      console.log('down')

      cx.translate(i,(j=j+20,j))
      break;
     //for 'move red'
    case commands[7]:
      console.log('red')

      cx.fillStyle = 'red'
      cx.fill()
      break;
    case commands[8]:
      console.log('blue')

      cx.fillStyle = 'blue'
      cx.fill()
      break;
    case commands[9]:
      console.log('green')

      cx.fillStyle = 'green'
      cx.fill()
      break;
  }
  commandText.textContent = '' + result + '';
}
recognition.onspeechend = function() {
  recognition.stop();
  console.log('stopped Listening')

}
recognition.onerror = function(event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}