// VARIABLES

const apiCall = new XMLHttpRequest(),
      apiKey = '690b2ae4036440e4bb69200a3701bf76',
      baseUrl = 'https://newsapi.org/v2/top-headlines?';

let country = 'us',
    sources = '',
    sortBy = '',
    from = '',
    q = '',
    pageSize = '';
    
// Array of variables
var urlParameters = {
  country: country,
  sources: sources,
  sortBy: sortBy,
  from: from,
  q: q,
  pageSize: pageSize
}

console.log(urlParameters);

// FUNCTIONS

// List of urlParameters
function getParameters() {
  let urlParameter = '';
  let count = 0;
  Object.keys(urlParameters).forEach(function(parameter) {
    count++;
    if(urlParameters[parameter] != ''){
      if(count === 1){
        urlParameter += `${parameter}=${urlParameters[parameter]}`;
        return urlParameter;
      } else {
        urlParameter += `&${parameter}=${urlParameters[parameter]}`;
        return urlParameter;
      }

    }
  })
  console.log (urlParameter);
  return urlParameter;
}

// API Call
function callThatAPI() {
  apiCall.open('GET', `${baseUrl}${getParameters()}&apiKey=${apiKey}`);
  apiCall.send();
  apiCall.onload = handleSuccess;
  apiCall.onerror = handleError; 
}

// API Success
function handleSuccess() {
  var response = JSON.parse(apiCall.responseText);
  console.log('working');
  console.log(response);
}

// API Error
function handleError() {
  console.log('oops');
}


callThatAPI();


// REFERENCE
// https://newsapi.org/docs/endpoints/top-headlines