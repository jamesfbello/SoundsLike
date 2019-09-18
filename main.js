"use strict";

//set page ready function
$(document).ready(function() {
    watchSubmitForm();
  });


//create event listeners for form submission
function watchSubmitForm() {
    $("#search-artist").submit(e => {
      e.preventDefault();
      let searchArtist = $("#artist-name-input").val();
      let numResults = $("#number-input").val();
      getRequestTasteDive(searchArtist, numResults);
    });
  }


// set constants for API Key and URL endpoint
const tasteDiveAPIKey = "345800-SoundsLi-VA6UST61";
const tasteDiveSearchURL = "https://tastedive.com/api/";


//function to create string to use for URL based on params
function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    );
    return queryItems.join("&");
  }
 

//GET Request to TasteDiveAPI
function getRequestTasteDive (searchArtist, numResults) {
  const params = {
    q: searchArtist,
    type: "music",
    info: 1,
    limit: numResults,
    k: tasteDiveAPIKey
  };

  
  const tasteDiveQueryString = formatQueryParams(params);
  const url = tasteDiveSearchURL + "similar?" + tasteDiveQueryString;
  
  $.ajax({
    url: url,
    dataType: 'jsonp',
    success: displayResults
  })
}

//display request results to DOM
function displayResults(responseJson) {
  console.log('ZOMG!', responseJson)
  $("#results-list").empty();
  const results = responseJson.Similar.Results
  for (let result of results) {
    $("#results-list").append(`<br> <br>
    <div class="response-container">
        <div class="artist-name">
        <h3>${result.Name}</h3>
        </div>
        <div class="artist-bio">
        <p>${result.wTeaser}</p>
        </div>
        <div class="artist-wiki">
        <a href="${result.wURL}">Need more info? Check thier Wikipedia page!</a>
        </div>
        </div> 
    </div>`);
  }
  $("#results-list").removeClass("container-hidden");
}

//emptydiv for lastfm top tracks