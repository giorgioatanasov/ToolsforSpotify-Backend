const headers = {
  "Access-Control-Allow-Origin": process.env.DOMAIN,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
  "Access-Control-Allow-Credentials": true,
};

var SpotifyWebApi = require("spotify-web-api-node");
const redirectUri = process.env.DOMAIN;

var scopes = [
  "user-read-private",
  "user-read-email",
  "playlist-modify-private",
  "user-read-currently-playing",
  "user-read-playback-state",
  "playlist-modify-public",
  "playlist-read-collaborative",
];

// The API object we'll use to interact with the API
var spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: redirectUri,
});

const auth = async (event, context) => {
  var authorizeURL = spotifyApi.createAuthorizeURL(scopes, null, true);
  return {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    statusCode: 200,
    body: JSON.stringify(authorizeURL),
  };
};

const access = async (event, context) => {
  const { accessCode } = event.pathParameters;
  return spotifyApi
    .authorizationCodeGrant(accessCode)
    .then((data) => {
      return {
        headers: {
          "Access-Control-Allow-Origin": process.env.DOMAIN,
          "Access-Control-Allow-Credentials": true,
        },
        statusCode: 200,
        body: JSON.stringify({
          access_token: data.body["access_token"],
          refresh_token: data.body["refresh_token"],
        }),
      };
    })
    .catch((error) => {
      return {
        headers: {
          "Access-Control-Allow-Origin": process.env.DOMAIN,
          "Access-Control-Allow-Credentials": true,
        },
        error: JSON.stringify(error),
      };
    });
};

module.exports = { auth, access };
