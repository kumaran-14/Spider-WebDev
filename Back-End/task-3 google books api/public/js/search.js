const API_KEY = 'AIzaSyDCMDeGsqwztdwJRqTL20uS2cPe5H-svco'

//div containing input box
var searchDiv = el('.search-div')
//the loggedin username
const username = searchDiv.getAttribute('data-username')
// variable to represent search parameters such as all,title,author,isbn,subject
var checkedRadioVal = el('input[name="parameters"]:checked').value

//helper function to make code readable
function el(selector) {
  return document.querySelector(selector)
}

//helper function to make code readable
function elAll(selector) {
  return document.querySelectorAll(selector)
}

//update checkedRadioVal variable's value
function updateRadioVal(e){
	if(el('.search-parameters').contains(e.target)){
		checkedRadioVal = el('input[name="parameters"]:checked').value
	}
}

//function to display no book match
function renderNoMatchDiv(){
	var errorDiv = document.createElement('div')
	errorDiv.classList.add('error-div')
	errorDiv.innerHTML = `
	<p>No Match found. Looking for a book?</p>
	<ul class = 'err'>
	<li>Search by both title and author, and double-check the spelling.</li>
	<li>Try searching by ISBN, Subject or Publisher</li>
	</ul>`
 	searchDiv.append(errorDiv)
}

//funtion to remove previous elements like noMatchdiv and previous search results
function ifPresentRemoveEl(selector){
	if(document.querySelector(selector)){
		document.querySelector(selector).remove()
	}
}

//return encoded data which can be sent in post request
function parseIntoEncodedData(data){
	var urlEncodedData = "";
  var urlEncodedDataPairs = [];
  var name;
   // Turn the data object into an array of erl-encoded key-value pairs.
  for(name in data) {
    urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
  }
  // Combine the pairs into a single string and replace all %-encoded spaces to
  // the '+' character; matches the behaviour of browser form submissions.
  urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
  return urlEncodedData;
}

//display search results
function renderResultDiv(books){
	//add result div.
	var allResults = document.createElement('div')
	allResults.classList.add('all-results')
	var html = ""
	for(var i = 0; i< books.items.length; i++){
		//deliberately indented  innerHTML
		html += `<div class='each-result' data-id =${books.items[i].id}>`
			html += "<div class='result-image'>"
				//image rendering
				let url = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjj1mjnJUgXCLCf81uOvcdf2W4rkptMyCxPL4ipPmK_p1gW5CI"
				if ( books.items[i].volumeInfo.imageLinks){
					url = `${books.items[i].volumeInfo.imageLinks.smallThumbnail}`
				}
				html += "<img src ='"+ url+ "'>"
			html += "</div><!-- result-image -->"
			html += "<div class='result-content'>"
				html += "<p class ='book-name'>"
					html += "<strong><a href ='"+ books.items[i].volumeInfo.previewLink +"'>" + books.items[i].volumeInfo.title + "</a></strong>"
				html += "</p><!-- book-name -->"
				html += "<p class='author-name' style='font-size:13px;'>"
					html += "<span style='font-size:11px'>by </span>" + (books.items[i].volumeInfo.authors ? books.items[i].volumeInfo.authors:'Anonymous') + ""
				html += "</p><!-- author-name -->"
				html += "<p class='detail' style='font-size:12px;border-bottom:16px'>"
					html += "&ndash; " + (books.items[i].volumeInfo.publisher ? books.items[i].volumeInfo.publisher : 'Anonymous') + ", " + (books.items[i].volumeInfo.publishedDate ? books.items[i].volumeInfo.publishedDate : 'Anonymous') + ""
				html += "</p><!-- detail -->"
				html += "<button type='button' class='press shelfbutton'>Add to Shelf</button>&emsp;<i class='fas fa-heart press'></i>"
			html += "</div><!-- result-content -->"
			html += `<div class='status-rate'>
							  <div class="select">
							    <select name="status" id="status">
							    	<option value="0" selected>Set Book Status</option>
							      <option value="1" >Want to Read</option>
							      <option value="2">Currently Reading</option>
							      <option value="3">Finished Reading</option>
							    </select>
  							</div>
  							<div class="rating">
							    <label class="star unchecked" data-id ='0'></label>
									<label class="star unchecked" data-id ='1'></label>
									<label class="star unchecked" data-id ='2'></label>
									<label class="star unchecked" data-id ='3'></label>
									<label class="star unchecked" data-id ='4'></label>
								</div>
							</div><!-- status-rate -->`
		html += "</div><!-- each-result -->"
	}
	allResults.innerHTML = html
	searchDiv.append(allResults);
	//send ajax request to find already existing books and update corresponding result-div
}

//make ajax request to add book to user's book shelf
function ajaxAddBookToShelf(data){
	var xhr = new XMLHttpRequest
	let urlEncodedData = parseIntoEncodedData(data)

	xhr.onload = () => {
		if(xhr.status === 200){
			if(xhr.responseText.split(',')[0] == 'Error')
				alert(xhr.responseText)
			else console.log(xhr.responseText)
		}
	}

	let url = `http://localhost:3000/bookshelf/${username}/add`
	xhr.open('POST',url)
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(urlEncodedData)

	xhr.onerror = () => {
		alert('Book cannot be added to your Book Shelf')
	}
}

//make ajax request to delete book from user's book shelf
function ajaxRemoveBookFromShelf(data){
	var xhr = new XMLHttpRequest
	var urlEncodedData = parseIntoEncodedData(data)
	xhr.onload = () => {
		if(xhr.status === 200){
			if(xhr.responseText.split(',')[0] == 'Error')
				alert(xhr.responseText)
			else console.log(xhr.responseText)
		}
	}
	let url = `http://localhost:3000/bookshelf/${username}/remove`
	xhr.open('POST',url)
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(urlEncodedData)

	xhr.onerror = () => {
		alert('Book cannot be removed from your Book Shelf')
	}
}


//make ajax request to add book to user's favourites
function ajaxAddBookToFavourites(data){
	var xhr = new XMLHttpRequest
	var urlEncodedData = parseIntoEncodedData(data)
	xhr.onload = () => {
		if(xhr.status === 200){
			if(xhr.responseText.split(',')[0] == 'Error')
				alert(xhr.responseText)
			else console.log(xhr.responseText)
		}
	}
	let url = `http://localhost:3000/favourites/${username}/add`
	xhr.open('POST',url)
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(urlEncodedData)

	xhr.onerror = () => {
		alert('Book cannot be added to Favourites List')
	}
}

//make ajax request to delete book from user's favourites
function ajaxRemoveBookFromFavourites(data){
	var xhr = new XMLHttpRequest
	var urlEncodedData = parseIntoEncodedData(data)

	xhr.onload = () => {
		if(xhr.status === 200){
			if(xhr.responseText.split(',')[0] == 'Error')
				alert(xhr.responseText)
			else console.log(xhr.responseText)
		}
	}
	let url = `http://localhost:3000/favourites/${username}/remove`
	xhr.open('POST',url)
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(urlEncodedData)

	xhr.onerror = () => {
		alert('Book cannot be removed from Favourites List')
	}
}

//make ajax request to modify bookstatus
function ajaxModifyBookStatus(data){
	var xhr = new XMLHttpRequest
	var urlEncodedData = parseIntoEncodedData(data)

	xhr.onload = () => {
		if(xhr.status === 200){
			if(xhr.responseText.split(',')[0] == 'Error')
				alert(xhr.responseText)
			else console.log(xhr.responseText)
		}
	}
	let url = `http://localhost:3000/bookstatus/${username}/modify`
	xhr.open('POST',url)
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(urlEncodedData)

	xhr.onerror = () => {
		alert('Book status Cannot be Updated')
	}
}
//add activity
function ajaxAddActivity(data){
	var xhr = new XMLHttpRequest
	var urlEncodedData = parseIntoEncodedData(data)

	xhr.onload = () => {
		if(xhr.status === 200){
			if(xhr.responseText.split(',')[0] == 'Error')
				alert(xhr.responseText)
			else console.log(xhr.responseText)
		}
	}
	let url = `http://localhost:3000/profile/activity/${username}/add`
	xhr.open('POST',url)
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(urlEncodedData)

	xhr.onerror = () => {
		alert('Book status Cannot be Updated')
	}
}



//toggle functions
//change button text and make ajax request to add/delete book to shelf
function toggleBook(e){
	if(e.target.tagName !== 'BUTTON'){
		return
	}
	let text = e.target.textContent
	if (text == 'Add to Shelf'){
		text = 'Added to Shelf'
		//adhoc value inputs
		let id = e.target.parentNode.parentNode.getAttribute('data-id') //volume_id
		let status = e.target.parentNode.parentNode.children[2].children[0].children[0].value //read status
		let favourite = e.target.parentNode.children[4].classList.contains('love') ? true : false
		let rating = e.target.parentNode.parentNode.children[2].children[1].querySelectorAll('.checked').length
		ajaxAddBookToShelf({
			username:username,
			volume_id:id,
			favourite:favourite,
			status:status,
			rating:rating
		})
		ajaxAddActivity({
			username:username,
			volume_id:id,
			activity:`${username} added a book to his shelf.`
		})
	}else{
		text = 'Add to Shelf'
		//adhoc value inputs
		let id = e.target.parentNode.parentNode.getAttribute('data-id') //volume_id
		ajaxRemoveBookFromShelf({
			username:username,
			volume_id:id
		})
		ajaxAddActivity({
			username:username,
			volume_id:id,
			activity:`${username} removed a book to his shelf.`
		})
	}
	e.target.classList.toggle("added");
	e.target.textContent = text
}

//change heart color and make ajax request to add/remove book to favourites
function toggleLove(e){
	if(e.target.tagName !== 'I') return
	e.target.classList.toggle('love')
	let id = e.target.parentNode.parentNode.getAttribute('data-id') //volume_id
	if (e.target.classList.contains('love')){
		ajaxAddBookToFavourites({
			username:username,
			volume_id:id,
		})
		ajaxAddActivity({
			username:username,
			volume_id:id,
			activity:`${username} has marked a book as a favourite.`
		})
	}else{
		console.log('remove')
		ajaxRemoveBookFromFavourites({
			username:username,
			volume_id:id
		})
		ajaxAddActivity({
			username:username,
			volume_id:id,
			activity:`${username} removed a book from his favourites list.`
		})
	}
}

function toggleStatus(e){
	if(e.target.tagName !== 'SELECT') return
	let id = e.target.parentNode.parentNode.parentNode.getAttribute('data-id') //volume_id
	let status = e.target.value
	ajaxModifyBookStatus({
		username:username,
		volume_id:id,
		status:status
	})
	ajaxAddActivity({
		username:username,
		volume_id:id,
		activity:`${username} marked a book as '${e.target.options[status].text}'.`
	})
}
//modify rating
function toggleStar(e){
  if(e.target.tagName !== 'LABEL') return
  let num = e.target.getAttribute('data-id');
	let id = e.target.parentNode.parentNode.parentNode.getAttribute('data-id')
  Array.from(e.target.parentNode.children).forEach(element => {
    if(element.getAttribute('data-id') <= num){
    	if(element.classList.contains('unchecked')){
        element.classList.toggle('unchecked')
        element.classList.toggle('checked')
       }
    }else{
    	if(element.classList.contains('checked') || !element.classList.contains('unchecked')){
        element.classList.toggle('checked')
        element.classList.toggle('unchecked')
    	}
    }
  })
  ajaxAddActivity({
		username:username,
		volume_id:id,
		activity:`${username} has rated a book ${Number(num)+1}/5.`
		})
}

//ajax search
function ajaxSearch(event){
	event.preventDefault()
	let searchParameter = ''
	let url =''
	const query = el('#search-query').value
	let xhr = new XMLHttpRequest

	xhr.onload = () => {
		if(xhr.status == 200){
			const books = JSON.parse(xhr.responseText) 		// Basic Result Structure
			//removes previous result's elements					//.all-results
			ifPresentRemoveEl('.all-results')							//	if(books.items.length !== 0)
			ifPresentRemoveEl('.error-div')								//		each book, index in books.items
			//no book Match                               //			.each-result
			if (!books.items){														//				.result-image
				return renderNoMatchDiv()											//				img(src=url)
			}																							//				.result-content
			//books present                               //					p.book-name #{books.items[index].volumeInfo.title}
			if (books.items.length !== 0){								//					p.author-name #{books.items[index].volumeInfo.authors}
				 renderResultDiv(books)											//					p.detail &ndash; #{books.items[index].volumeInfo.publisher}, #{books.items[index].volumeInfo.publishedDate}
				 //toggle functions has built in ajax requests.
				 el('.all-results').addEventListener('click',toggleBook)
				 el('.all-results').addEventListener('click',toggleLove)
				 el('.all-results').addEventListener('change',toggleStatus)
				 el('.all-results').addEventListener('click',toggleStar)
			}
		}
	}
	if (checkedRadioVal !== 'all'){
		searchParameter = `+${checkedRadioVal}:${query}`
	}
	url = `https://www.googleapis.com/books/v1/volumes?q=${query}${searchParameter}&maxResults=25&key=${API_KEY}`
	xhr.open('GET',url)
	xhr.send()

	xhr.onerror = () => {
		ifPresentRemoveEl('.all-results')
		ifPresentRemoveEl('.error-div')
		console.log('Request Error!! Check Internet Connection')
		renderNoMatchDiv()
	}
}

el('.search-parameters').addEventListener('click',updateRadioVal)
el('#search-form').addEventListener('submit',ajaxSearch)

