// VARIABLES

const apiCall = new XMLHttpRequest(),
      apiKey = '690b2ae4036440e4bb69200a3701bf76',
      baseUrl = 'https://newsapi.org/v2/top-headlines?',
      mainContainer = document.getElementById('main'),
      popUp = document.getElementById('popUp'),
      popUpContainer = document.getElementById('popUpContainer'),
      popUpClose = document.getElementsByClassName('closePopUp')[0],
      articleLoad = document.getElementsByClassName('articleLoad'),
      search = document.getElementById('search'),
      searchButton = document.getElementById('search').getElementsByTagName('a')[0],
      searchInput = document.getElementById('search').getElementsByTagName('input')[0],
      source = document.getElementById('source'),
      sourceDropdown =  document.getElementById('source').getElementsByTagName('ul')[0];

let country = 'us',
    sources = '',
    sortBy = '',
    from = '',
    q = '',
    pageSize = '';

// Array of Sources
var  sourceList = [];

// Array of Unique Sources
var  sourceListUnique = [];
    
// Array of variables
var urlParameters = {
  country: country,
  sources: sources,
  sortBy: sortBy,
  from: from,
  q: q,
  pageSize: pageSize
}

// FUNCTIONS

// Get formatted list of urlParameters for API
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
  console.log(response);
  createArticleList(response);
  hideLoader();
  articleLoadClick(response);
  sourceAddDropdown(response);
}


// API Error
function handleError() {
  apiLoadError();
}


// Create Article List
function createArticleList(response){
  var article = response.articles;
  // Clear inner html
  mainContainer.innerHTML = '';
  // Loop through results
  for(let i = 0; i < article.length; i++) { 
    mainContainer.innerHTML += 
      `<article class="article" id="${i}">
          <section class="featuredImage">
            <img src="${article[i].urlToImage}" alt="" />
          </section>
          <section class="articleContent">
              <a href="#" class="articleLoad"><h3>${article[i].title}</h3></a>
              <h6>Lifestyle</h6> 
          </section>
          <section class="impressions">
            526
          </section>
          <div class="clearfix"></div>
        </article>`;
  }
  console.log();
}


// Hide Loading Pop Up
function hideLoader(){
  popUp.classList.add('hidden');
}


// API Load Error Message
function apiLoadError(){
  popUpContainer.innerHTML = 'Something went wrongzy';
  popUp.classList.remove('loader');
  popUp.classList.remove('hidden');
  popUp.classList.add('error');
}

// Article Load In Overlay
function articleLoadClick(response){
  var article = response.articles;
  for (let i = 0; i < articleLoad.length; i++) {
    articleLoad[i].addEventListener('click', function(){
      event.preventDefault();
      console.log('this is clicked' + i);
      popUp.classList.remove('loader');
      popUp.classList.remove('hidden');
      popUpContainer.innerHTML = 
        `
          <h1>${article[i].title}</h1>
          <p>
            ${article[i].description}
          </p>
          <a href="${article[i].url}" class="popUpAction" target="_blank">Read more from ${article[i].source.name}</a>
        `;
    });
  }
}

// Unique Array
Array.prototype.unique = function() {
  return this.filter(function (value, index, self) { 
    return self.indexOf(value) === index;
  });
}

// Populate Sources in domain
function sourceAddDropdown(response) {
  var article = response.articles;
  // Create array of all domain names
  for(let i = 0; i < article.length; i++) { 
    console.log(article[i].source.name);
    sourceList.push(article[i].source.name);
  }
  // Create array of all unique domain names
  sourceListUnique = sourceList.unique();
  // Render domains in drop down
  for(let i = 0; i < sourceListUnique.length; i++) { 
    sourceDropdown.innerHTML += `<li><a href="">${sourceListUnique[i]}</a></li>`
  }
    
}



// EVENTS

// Call API
callThatAPI();

// Close Pop Up
popUpClose.addEventListener('click', function(){
  event.preventDefault();
  popUp.classList.add('loader');
  popUp.classList.add('hidden');
  popUpContainer.innerHTML = '';
});

// Expand Search
searchInput.addEventListener('keyup', function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    searchButton.click();
  }
});

searchButton.addEventListener('click', function(){
  event.preventDefault();
  console.log('search button clicked');
  search.classList.toggle('active');
});


// REFERENCE
// https://newsapi.org/docs/endpoints/top-headlines


