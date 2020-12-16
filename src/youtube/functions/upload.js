// require node modules & files
const { authorise } = require('./authorise'),
    constants = require('../util/constants'),
    { google } = require('googleapis'),
    youtube = google.youtube('v3'),
    OAuth2 = google.auth.OAuth2,
    path = require('path'),
    assert = require('assert'),
    fs = require('fs');

/**
 * Upload a video file to YouTube.
 * A call to this method has a quota cost of 1600 units.
 * @param {string} videoFilePath Video file path
 * @param {string} title Video title
 * @param {string} description Video description
 * @param {string[]} tags Video tags array
 * @param {boolean} deleteFile Delete videos file
 */
exports.upload = async (videoFilePath, title, description, tags, deleteFile) => {
    assert(fs.existsSync(videoFilePath));

    fs.readFile(path.resolve('client_secret.json'), (err, content) => {
        if (err) return console.error('Error loading credentials:', err);
        else authorise(JSON.parse(content), auth => uploadVideo(auth, videoFilePath, title, description, tags, deleteFile));
    })
}

/**
 * Upload a video file to YouTube
 * @param {OAuth2} auth Google account authorisation
 * @param {string} videoFilePath Video file path
 * @param {string} title Video title
 * @param {string} description Video description
 * @param {string[]} tags Video tags array
 * @param {boolean} deleteFile Delete videos file
 */
const uploadVideo = async (auth, videoFilePath, title, description = '', tags = [], deleteFile = false) => {
    console.log('Beginning upload of video...');
    var { data } = await youtube.videos.insert({
        auth,
        part: 'snippet,status',
        requestBody: {
            snippet: {
                title,
                description,
                tags,
                categoryId: 23, // comedy
                defaultLanguage: 'en',
                defaultAudioLanguage: 'en'
            },
            status: {
                privacyStatus: 'private'
            }
        },
        media: {
            body: fs.createReadStream(videoFilePath)
        }
    })

    if (data.error) return console.error('Error while trying to upload video:', data.error);
    data = Object.assign(constants.FORMAT_DATA(data), { file: { deleted: deleteFile === true ? true : false } });
    console.log('Video successfully uploaded. Video ID:' + data.id);
    if (deleteFile === true) fs.unlink(videoFilePath, err => {
        if (err) return console.error('Error while trying to delete video file:', err);
    })
    return data;
}