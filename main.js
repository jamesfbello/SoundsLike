"use strict";

//set page ready function
$(document).ready(function() {
    watchSubmitForm();
  });


//create event listeners for form submission
function watchSubmitForm() {
    console.log("watchSumbitForm works!");
    $("#search-artist").submit(e => {
      e.preventDefault();
      let searchArtist = $("#artist-name-input").val();
      let numResults = $("#number-input").val();
      getRequestTasteDive(searchArtist, numResults);
    });
  }


// set constants for TasteDive API Key and URL endpoint
const tasteDiveAPIKey = "345800-SoundsLi-VA6UST61";
const tasteDiveSearchURL = "https://tastedive.com/api/";


//function to create string to use for TasteDive API URL based on params
function formatQueryParams(params) {
    console.log("formatQueryParams function works!");
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    );
    return queryItems.join("&");
  }
 

//GET Request to TasteDiveAPI
function getRequestTasteDive (searchArtist, numResults) {
  console.log("getRequestTasteDive works!");
  const params = {
    q: searchArtist,
    type: "music",
    info: 1,
    limit: numResults,
    k: tasteDiveAPIKey
  };

  
  const tasteDiveQueryString = formatQueryParams(params);
  const url = tasteDiveSearchURL + "similar?" + tasteDiveQueryString;
  console.log(url)

  
  $.ajax({
    url: url,
    dataType: 'jsonp',
    success: displayResults
  });
}

//display TasteDive API request results to DOM
function displayResults(responseJson) {
  console.log("displayResults works!");
  console.log(responseJson);
  $("#results-list").empty();
  const results = responseJson.Similar.Results
  for (let result of results) {
    $("#results-list").append(`<br> <br>
    <div class="response-container">
        <div class="artist-name">
        <h3 class="artist-name-value">${result.Name}</h3>
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

// set constants for LastFM API Key and URL endpoint
const lastFmAPIKey = "c84722b6685ae3659ba0e56fa2fc1d10";
const lastFmSearchURL = "http://ws.audioscrobbler.com/2.0/";


function getArtistNameVal() { 
  console.log("getArtistNameVal works!");
  return $('.artist-name-value').val(); 
} 

let getArtistName = getArtistNameVal();



//function to create string to use for LastFM URL based on params
function formatSecondQueryParams(params) {
    console.log("formatSecondQueryParams works!");
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    );
    return queryItems.join("&");
  }

//GET Request to LastFM API
function getRequestLastFM (artistName) {
  console.log("getRequestLastFM works!")
  const params = {
    method: "searchArtist.gettoptracks",
    artist: artistName,
    autocorrect: 1,
    limit: 5,
    api_key: lastFmAPIKey,
    format: "json"
  };

  
  const tasteDiveQueryString = formatSecondQueryParams(params);
  const url = lastFmSearchURL + "?" + tasteDiveQueryString;
  console.log(url);
  
  
  fetch(url)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
  })
  .then(responseJson => displayResults(responseJson))
  .catch(err => {
    console.log(err);
    alert("Something went wrong, try again!");
  });
 
}

//Display LastFM API results to DOM
 



