"use strict";

//set page ready function
$(document).ready(function () {
  watchSubmitForm();
  loadTopTracks();
  startApp();
});

function startApp() {
	$('.start-button').click( e => {
		$('.intro').css('display', 'none');
    $("#form-container").removeClass("container-hidden");
  });
  }


//create event listeners for form submission
function watchSubmitForm() {
  $("#search-artist").submit(e => {
    e.preventDefault();
    let searchArtist = $("#artist-name-input").val();
    let numResults = $("#number-input").val();
    getRequestTasteDive(searchArtist, numResults);
  });
}

$("#submit-button").click(function() {
  $([document.documentElement, document.body]).animate({
      scrollTop: $("#results-list").offset().top
  }, 1000);
});

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
    success: function(data) {
      displayResults(data, searchArtist, numResults);
    }
  });
}

//display TasteDive API request results to DOM
function displayResults(responseJson,searchArtist,numResults) {
  console.log('responseJson in display results',responseJson);
  $("#results-list").empty();
  $("#results-list").append(`
    <h2>Here are ${numResults} artists similar to ${searchArtist}:</h2>`);
    console.log('# of Results:', numResults)
    console.log('Artist Searched:', searchArtist)
  const results = responseJson.Similar.Results
  for (let result of results) {
    $("#results-list").append(`
    <section class="response-container">
        <div class="artist-name">
        <a href="${result.wUrl}" target="blank"><h3 class="artist-name-value">${result.Name}</h3></a>
        </div>
        <div class="artist-bio">
          <p>${result.wTeaser}</p>
        </div>
        <div class="top-tracks-list">   
          <button class="load-tracks-button">Click here to check their top 3 songs!</button>
        </div>
    </section>`)
  }
  $("#results-list").removeClass("container-hidden");
}

//create event listeners for button click/2nd API activation
$('body').on('click', 'button.load-tracks-button', e => {
  e.preventDefault();
  const el = $(e.currentTarget);
  const artist = el.parents('.response-container')
    .find('.artist-name h3')
    .html();
  const target = el.parents('.top-tracks-list');
  loadTopTracks(artist, target);
  $(e.currentTarget).remove();
})

// set constants for LastFM API Key and URL endpoint
const lastFmAPIKey = "c84722b6685ae3659ba0e56fa2fc1d10";
const lastFmSearchURL = "https://ws.audioscrobbler.com/2.0/";

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
    $(target).append(`
    <h4>Here are 3 of their most popular songs:</h4>
    <p>Click below to listen and find more about the songs!<p>`)
  const results = responseJson.toptracks.track
  for (let result of results) {
    $(target).append(`
    <div class="artist-top-songs">
      <ul>
      <li><a href="${result.url}" target="blank">${result.name}</a></li>
      </ul>
    <div>`);
  }
}