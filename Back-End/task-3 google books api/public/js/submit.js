function getEl(selector) {
  return document.querySelector(selector)
}
// real time username availability
function validateUsername() {
  var request = new XMLHttpRequest();
  const username = getEl('#username').value
  var resultEl = getEl('.result')
  let state;
  request.open('GET', '/user/validateusername/' + username, true);
  request.onreadystatechange = function() {
    if (request.status == 200 && request.readyState == 4) {
      state = JSON.parse(request.responseText)
      if (username == '' || !state) {
        resultEl.style.color = '#ef3030'
        resultEl.textContent = '*username already taken'
      } else {
        resultEl.style.color = '#4cea5c'
        resultEl.textContent = '*available'
      }
    }
  };
  request.send();
}
