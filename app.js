var access_token = window.location.hash.split('&')[0].split('=')[1];
var spotifyAlbumsURL = 'https://api.spotify.com/v1/tracks/2TpxZ7JUBn3uw46aR7qd6V';
window.history.pushState({}, null, '/');
var baseUrl = 'https://api.spotify.com/';
var artistFullNname = document.getElementById('artist_full_name');
var artistFollowers = document.getElementById('artist_followers');
var artistImage = document.getElementById('artist_image');
var artistLink = document.getElementById('artist_link');
var relatedArtistList = document.getElementById('related_artists_list');
var topTracksList = document.getElementById('top_tracks_list');

function request(method, url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.onload = resolve;
    xhr.onerror = reject;
    xhr.send();
  })
}

var seedArtistData = function () {
  var seedArtistID = '4dpARuHxo51G3z768sgnrY';
  var seedArtistUrl = baseUrl + 'v1/artists/4dpARuHxo51G3z768sgnrY';

  request('GET', seedArtistUrl)
    .then(function (e) {
      var data = JSON.parse(e.target.response);
      insertArtistToDOM(data);
    }).catch(function (err) {
      console.log(err);
    })

  getRelatedArtists(seedArtistID);
  getTopTracks(seedArtistID);
}

function getRelatedArtists(artistId) {
  var relatedArtistsUrl = baseUrl + 'v1/artists/' + artistId + '/related-artists';
  request('GET', relatedArtistsUrl)
    .then(function (e) {
      var data = JSON.parse(e.target.response).artists;
      insertRelatedArtistsToDOM(data);
    }).catch(function (err) {
      relatedArtistList.innerHTML = 'Sorry, No Related Artists Found';
      console.log(err);
    });
}

function getTopTracks(artistId) {
  var topTracksUrl = baseUrl + 'v1/artists/' + artistId + '/top-tracks?country=US';
  request('GET', topTracksUrl)
    .then(function (e) {

      var data = JSON.parse(e.target.response).tracks;
      insertTopTracksToDOM(data)
    }).catch(function (err) {
      console.log(err);
    })
}

function insertArtistToDOM(data) {
  artistFullNname.innerHTML = 'Full Name: ' + data.name;
  artistFollowers.innerHTML = 'Total Followers: ' + data.followers.total;
  artistImage.setAttribute('src', data.images[1].url);
  artist_link.href = data.external_urls.spotify;
}

function insertRelatedArtistsToDOM(data) {
  while (relatedArtistList.firstChild) {
    relatedArtistList.removeChild(relatedArtistList.firstChild);
  }

  var list = document.createElement('ul');
  list.style.listStyleType = 'none';
  data.forEach(function (artist) {
    var name = document.createElement('li');
    var thumbnail = document.createElement('img');
    var seeBtn = document.createElement('button');
    seeBtn.classList.add('artist_btn')
    seeBtn.type = 'button';
    seeBtn.innerHTML = 'See Artist';
    seeBtn.href = '#';
    seeBtn.onclick = switchArtist(artist.id);
    thumbnail.setAttribute('src', artist.images[2].url);
    name.appendChild(document.createTextNode(artist.name));
    list.appendChild(name);
    list.appendChild(thumbnail);
    list.appendChild(seeBtn);
    return list;
  });
  relatedArtistList.appendChild(list);
}

function insertTopTracksToDOM(data) {
  while (topTracksList.firstChild) {
    topTracksList.removeChild(topTracksList.firstChild);
  }

  var list = document.createElement('ul');
  list.style.listStyleType = 'none';
  data.forEach(function (artist) {
    var trackName = document.createElement('li');
    trackName.appendChild(document.createTextNode(artist.name));

    // Trying to use iframe but it's unstable
    // if (artist.id) {
    //   var preview = document.createElement('iframe');

    //   setTimeout(function() {
    //     preview.height = '80px';
    //     preview.width = '300px';
    //      preview.allow = 'encrypted-media';
    //     preview.src = 'https://open.spotify.com/embed?uri=spotify:track:' + artist.id;
    //     console.log(artist.id);
    //   }, 50)
    // }

    //Using HTML <audio> tag instead seems to be more stable
    var preview = document.createElement('audio');
    preview.controls = 'controls';
    var source = document.createElement('source');
    source.setAttribute('src', artist.preview_url)
    preview.appendChild(source);

    list.appendChild(trackName);
    list.appendChild(preview);
    return list
  })
  topTracksList.appendChild(list);
}

function switchArtist(artistId) {
  return function () {
    var artistUrl = baseUrl + 'v1/artists/' + artistId;
    request('GET', artistUrl)
      .then(function (e) {
        var data = JSON.parse(e.target.response);
        insertArtistToDOM(data);
      }).catch(function (err) {
        console.log(err);
      })
    getRelatedArtists(artistId);
    getTopTracks(artistId);
  }
}

seedArtistData();