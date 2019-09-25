"use strict";

//set page ready function
$(document).ready(function () {
  watchSubmitForm();
  loadTopTracks();
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

// set constants for TasteDive API Key and URL endpoint
const tasteDiveAPIKey = "345800-SoundsLi-VA6UST61";
const tasteDiveSearchURL = "https://tastedive.com/api/";

//function to create string to use for TasteDive API URL based on params
function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

//GET Request to TasteDiveAPI
function getRequestTasteDive(searchArtist, numResults) {
  const params = {
    q: searchArtist,
    type: "music",
    info: 1,
    limit: numResults,
    k: tasteDiveAPIKey
  };
  const tasteDiveQueryString = formatQueryParams(params);
  const url = tasteDiveSearchURL + "similar?" + tasteDiveQueryString;
  console.log('TasteDive API URL' , url);

  $.ajax({
    url: url,
    dataType: 'jsonp',
    success: displayResults
  });
}

//display TasteDive API request results to DOM
function displayResults(responseJson) {
  console.log('responseJson in display results',responseJson);
  $("#results-list").empty();
  const results = responseJson.Similar.Results
  for (let result of results) {
    $("#results-list").append(`
    <section class="response-container">
        <div class="artist-name">
          <h3 class="artist-name-value">${result.Name}</h3>
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
  }
  $("#results-list").removeClass("container-hidden");
}

//create event listeners for button click/2nd API activation
$('body').on('click', 'button.load-tracks-button', e => {
  e.preventDefault()
  const el = $(e.currentTarget)
  const artist = el.parents('.response-container')
    .find('.artist-name h3')
    .html()
  const target = el.parents('.top-tracks-list')
  loadTopTracks(artist, target)
})

// set constants for LastFM API Key and URL endpoint
const lastFmAPIKey = "c84722b6685ae3659ba0e56fa2fc1d10";
const lastFmSearchURL = "http://ws.audioscrobbler.com/2.0/";

//function to create string to use for LastFM URL based on params
function formatSecondQueryParams(params) {
  const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

//GET Request to LastFM API
function loadTopTracks(artist, target) {
  const params = {
    method: "artist.gettoptracks",
    artist: artist,
    autocorrect: 1,
    limit: 3,
    api_key: lastFmAPIKey,
    format: "json"
  };

  const lastFMQueryString = formatSecondQueryParams(params);
  const url = lastFmSearchURL + "?" + lastFMQueryString;
  console.log('LastFM API URL', url)

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    })
    .then(responseJson =>
      displayTopTracks(responseJson, target)
    )
    .catch(err => {
      alert("Something went wrong, try again!");
    });
}

//Display LastFM API results to DOM
function displayTopTracks(responseJson, target) {
  const results = responseJson.toptracks.track
  for (let result of results) {
    $(target).append(`
    <div class="reset-artist">
      <a href="${result.url}">${result.name}</a>
    <div>`);
  }
}