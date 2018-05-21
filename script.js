var client_id = 'dee577bccb43478eb8a0ecb07622f8c8';
var redirect_uri = 'https://musicmaster-spotify55.surge.sh/callback';
var scope = 'user-read-private user-read-email';
var encodeScope = encodeURIComponent(scope);
var state = 'asdf'

var authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}&scope=${encodeScope}&state=${state}`;

window.location = authorizeUrl;