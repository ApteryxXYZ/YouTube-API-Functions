// require node modules & files
const OAuth2 = require('googleapis').google.auth.OAuth2,
    readline = require('readline'),
    fs = require('fs'),
    path = require('path');

// define constants
const SCOPES = ['https://www.googleapis.com/auth/youtube.upload'],
    TOKEN_PATH = path.resolve('client_oauth_token.json');

/**
 * Create an OAuth2 client with the given credentials, and then
 * execute the given callback function.
 * @param {object} credentials Client credentials
 * @param {function} callback Callback function
 */
exports.authorise = (credentials, callback) => {
    let clientSecret = credentials.web.client_secret,
        clientId = credentials.web.client_id,
        redirectUrl = credentials.web.redirect_uris[0],
        oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) getNewToken(oauth2Client, callback);
        else {
            oauth2Client.credentials = JSON.parse(token);
            callback(oauth2Client);
        }
    })
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {OAuth2} oauth2Client OAuth2 client object
 * @param {function} callback Callback function
 */
const getNewToken = (oauth2Client, callback) => {
    let authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    })

    console.log('Authorise this app by visiting this url:', authUrl);
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    rl.question('Enter the code from that page here:', code => {
        rl.close();
        oauth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token.', err);
            else {
                oauth2Client.credentials = token;
                storeToken(token);
                callback(oauth2Client);
            }
        })
    })
}

/**
 * Store token to disk be used in later program executions.
 * @param {Object} token The token to store to disk.
 */
const storeToken = (token) => {
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) throw err;
        console.log('Token stored to ' + TOKEN_PATH);
    })
}