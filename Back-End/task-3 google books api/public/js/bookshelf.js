const allResultsDiv = el('.all-results')
const eachResultArray = Array.from(elAll('.each-result'))
//helper function to make code readable
function el(selector) {
  return document.querySelector(selector)
}

//helper function to make code readable
function elAll(selector) {
  return document.querySelectorAll(selector)
}

//toggle Functions
//for love
function toggleLove(el){
	el.classList.toggle('love')
}

//for status
function toggleStatus(el,statusVal){
	el.selectedIndex = statusVal
}

//for rating
function toggleRating(el,ratingVal){
	Array.from(el.children).forEach( star => {
		let starRating = star.getAttribute('data-id')
		if( starRating < ratingVal){
			star.classList.toggle('unchecked')
			star.classList.toggle('checked')
		}
	})
}
eachResultArray.forEach( resultDiv => {
let volume_id = resultDiv.getAttribute('data-id')
let favBool = resultDiv.querySelector('i').getAttribute('data-favourite')
let bookStatus = resultDiv.querySelector('select').getAttribute('data-status')
let bookRating = resultDiv.querySelector('.rating').getAttribute('data-rating')

if(favBool === 'true') toggleLove(resultDiv.querySelector('i'))
if(bookStatus != 0) toggleStatus(resultDiv.querySelector('select'),bookStatus)
if(bookRating != 0) toggleRating(resultDiv.querySelector('.rating'),bookRating)

})