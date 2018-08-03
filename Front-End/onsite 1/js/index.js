const text = document.querySelector('.text')
const container = document.querySelector(".container");
const magnet_one = document.querySelector(".magnet-1");
const magnet_two = document.querySelector(".magnet-2");

function animate(e) {
	if (e.target.parentNode.classList.contains("click-1") || e.target.parentNode.classList.contains("click-2")){
		let animateDiv = e.target.parentNode.parentNode;
		animateDiv.classList.toggle('rotate-on')
		magnet_one.classList.toggle('move-left');
		magnet_two.classList.toggle('move-right');
		if(text.innerHTML == "Magnets Attract Each Other"){text.textContent = "Magnets Repel Each Other"}
		else {text.textContent = "Magnets Attract Each Other"}
 	}
	else {
		return;
	}
}
container.addEventListener("click", animate);