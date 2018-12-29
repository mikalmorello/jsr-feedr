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
      sourceDropdown =  document.getElementById('source').getElementsByTagName('ul')[0],
      sourceLink =  document.getElementsByClassName('filterSource'),
      logo = document.getElementsByTagName('h1')[0],
      logoLink = logo.parentNode,
      loadMoreButton = document.getElementById('loadMoreButton');

let country = 'us',
    sources = '',
    sortBy = '',
    from = '',
    q = '',
    pageSize = '',
    page = 1;

let articleCount = 0;
let articleTotal = 0;

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
  pageSize: pageSize,
  page: page
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
  console.log ('url parameter is' + urlParameter);
  console.log('page inside getParameters call is' + page);
  return urlParameter;
}

// API Call
function callThatAPI(resultPage) {
  urlParameters.page = resultPage;
  console.log('page inside api call is' + resultPage);
  apiCall.open('GET', `${baseUrl}${getParameters()}&apiKey=${apiKey}`);
  apiCall.send();
  apiCall.onload = handleSuccess;
  apiCall.onerror = handleError; 
}


// API Success
function handleSuccess() {
  var response = JSON.parse(apiCall.responseText);
  console.log(response);
  console.log('result page is ' + page);
  createArticleList(response);
  hideLoader();
  sourceAddDropdown(response);
  filterArticles(response);
  showingTotalResults(response);
}


// API Error
function handleError() {
  apiLoadError();
}


// Create Article List
function createArticleList(response){
  var article = response.articles;
  // Clear inner html
  if(page === 1){
    mainContainer.innerHTML = '';
  }
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
  articleLoadClick(article);
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
function articleLoadClick(article){
  //var article = response.articles;
  for (let i = 0; i < articleLoad.length; i++) {
    articleLoad[i].addEventListener('click', function(){
      event.preventDefault();
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
    sourceList.push(article[i].source.name);
  }
  // Create array of all unique domain names
  sourceListUnique = sourceList.unique();
  // Render domains in drop down
  sourceDropdown.innerHTML += `<li><a class="filterSource" href="#">All</a></li>`
  for(let i = 0; i < sourceListUnique.length; i++) { 
    sourceDropdown.innerHTML += `<li><a class="filterSource" href="#">${sourceListUnique[i]}</a></li>`
  }
}


// Filter Articles based upon source

function filterArticles(response){
  // Define click event
  for (let i = 0; i < sourceLink.length; i++) {
    sourceLink[i].addEventListener('click', function(){
      event.preventDefault();
      let filterSource = sourceLink[i].innerHTML;
      if(filterSource == 'All'){
        callThatAPI(page);
      } else {
        // Filter Article list
        var article = response.articles;
        // Create Array from refined news list
        var filterArticle = [];
        // Clear inner html
        mainContainer.innerHTML = '';
        // Loop through results
        for(let i = 0; i < article.length; i++) { 
          if(article[i].source.name == filterSource){
            filterArticle.push(article[i]);
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
          }
          articleLoadClick(filterArticle);
      }
    });
  }
};

// Determine results from infinite load
function infiniteLoad(currentPage) {
  console.log(currentPage);
  page = currentPage + 1;
  console.log(page);
  return page;
}

//Determine Article Total
function showingTotalResults(response){
  articleCount += response.articles.length;
  console.log(articleCount);
  articleTotal = response.totalResults;
  console.log(articleTotal);
  if(articleCount === articleTotal){
    return true;
  } else {
    return false;
  }
}

// EVENTS

// Call API
callThatAPI(page);

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
  search.classList.toggle('active');
});

// Feedr Logo Click
logoLink.addEventListener('click', function(){
  event.preventDefault();
  page = 1;
  callThatAPI(page);
});

// Load More Button Click
loadMoreButton.addEventListener('click', function() {
  event.preventDefault();
  console.log('load more button clicked');
  console.log('article count now is ' + articleCount);
  console.log('article total now is ' + articleTotal);
  // Allow load more if results have not reached total
  if(articleCount != articleTotal){
    infiniteLoad(page);
    callThatAPI(page);
    return page;
  }
  console.log('page is' + page);
  
});

// REFERENCE
// https://newsapi.org/docs/endpoints/top-headlines


