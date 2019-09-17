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


// set constants for API Key and URL endpoint
const tasteDiveAPIKey = "345800-SoundsLi-VA6UST61";
const tasteDiveSearchURL = "https://tastedive.com/api/";


//function to create string to use for URL based on params
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

//display request results to DOM
function displayResults(responseJson) {
  console.log("displayResult function works");
  $("#results-list").empty();
  for (let i = 0; i < responseJson.data.length; i++) {
    $("#results-list").append(`<br> <br>
    <div class="response-container">
        <div class="artist-name">
        <h3>${responseJson.Results[i].Name}</h3>
        </div>
        <div class="artist-bio">
        <p>${responseJson.Results[i].wTeaser}</p>
        </div>
        <div class="artist-wiki">
        <a href="${responseJson.Results[i].wURL}">Need more info? Check thier Wiikipedia page!</a>
        </div>
        </div> 
    </div>`);
  }
  $("#results-list").removeClass("hidden");
}