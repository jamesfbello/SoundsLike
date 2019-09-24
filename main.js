"use strict";

//set page ready function
$(document).ready(function() {
    watchSubmitForm();
    loadTopTracks();
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
  console.log('responseJson in display results',responseJson);
  $("#results-list").empty();
  const results = responseJson.Similar.Results
  results.forEach((result, idx) => {
    $("#results-list").append(`<br> <br>
    <section class="response-container">
        <div class="artist-name">
          <h3 class="artist-name-value-${idx}">${result.Name}</h3>
        </div>
        <div class="artist-bio">
          <p>${result.wTeaser}</p>
        </div>
        <div class="artist-wiki">
          <a href="${result.wURL}">Need more info? Check thier Wikipedia page!</a>
        </div>
        <div class="top-tracks-list">   
          <button class="load-tracks-button">Load top tracks!</button>
        </div>
    </section>`)
  })
  $("#results-list").removeClass("container-hidden");
}

//create event listeners for top tracks button
// function loadTopTracks() {
//   $(".load-tracks-button").submit(e => {
//     console.log("loadTopTracks works!");
//     e.preventDefault();
//     function getArtistNameVal() { 
//       console.log("getArtistNameVal works!");
//       return $('.artist-name-value').val(); 
//     };
//     let artistName = getArtistNameVal();
//     getRequestLastFM(artistName);
//     displayLastFmResults(responseJson);
//   });
// }
//working 2nd form
function loadTopTracks() {
  $("#results-list").on('click','button', e => {
    console.log("loadTopTracks works!");
    e.preventDefault();
    function getArtistNameVal() { 
      console.log("getArtistNameVal works!");
      console.log('artist name element', $('.artist-name-value-0').text())
      return $('.artist-name-value-0').text(); 
    };
    let artistName = getArtistNameVal();
    console.log('artistName in load top tracks',artistName)
    getRequestLastFM(artistName);
    // displayLastFmResults(responseJson);
  });
}



// set constants for LastFM API Key and URL endpoint
const lastFmAPIKey = "c84722b6685ae3659ba0e56fa2fc1d10";
const lastFmSearchURL = "http://ws.audioscrobbler.com/2.0/";


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
    method: "artist.gettoptracks",
    artist: artistName,
    autocorrect: 1,
    limit: 3,
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
  .then(responseJson => console.log('responseJson in getRequestLastFM',responseJson) || displayLastFmResults(responseJson))
  .catch(err => {
    console.log(err);
    alert("Something went wrong, try again!");
  });
 
}


//Display LastFM API results to DOM
function displayLastFmResults(responseJson) {
  console.log("displayResults works!");
  console.log(responseJson);
  $(".reset-artist").empty();
  const results = responseJson.toptracks.track
  for (let result of results) {
    $(".top-tracks-list").append(`
    <div class="reset-artist">
      <br> <br>
      <a href="${result.url}">${result.name}</a>
    <div>`);
  }
}



