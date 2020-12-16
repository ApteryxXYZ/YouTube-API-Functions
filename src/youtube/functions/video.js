// require node modules & files
const constants = require('../util/constants'),
    youtube = require('googleapis').google.youtube('v3'),
    ytdl = require('ytdl-core'),
    path = require('path'),
    fs = require('fs');

/**
 * Gets information about a video via its ID.\
 * A call to this method has a quota cost of 1 unit.
 * @param {string} videoId Video ID
 * @return {object} Data object
 */
exports.video = async (videoId) => {
    let { data } = await youtube.videos.list({
        part: 'snippet',
        key: process.env.YOUTUBE_API_KEY,
        id: videoId
    })

    if (data.error) return console.error('Error while trying to fetch video:', data.error.message, data.error.code);
    if (data.pageInfo?.totalReults < 1) return { error: { message: 'No video was found with the requested ID. Video ID:' + videoId, code: 404 } };
    let result = data.items[0];
    return constants.FORMAT_DATA(result);
}

/**
 * Downloads a video and saves it to the 'videos' folder.\
 * A call to this method has a quota cost of 0 units.
 * @param {string} id Video ID
 * @returns {object} 'downloadStream' and 'filePath' within an object
 */
exports.download = (videoId) => {
    let file = path.resolve('videos', Date.now() + '-' + videoId + '.mp4'),
        url = constants.BASE_URL.VIDEO + videoId,
        download = ytdl(url).pipe(fs.createWriteStream(file));
    return { download, file };
}