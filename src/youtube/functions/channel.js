// require node modules & files
const constants = require('../util/constants'),
    youtube = require('googleapis').google.youtube('v3');

/**
 * Gets information about a channel via its ID.\
 * A call to this method has a quota cost of 1 unit.
 * @param {string} channelId Channel ID
 * @return {object} Data object
 */
exports.channel = async (channelId) => {
    let { data } = await youtube.channels.list({
        part: 'snippet',
        key: process.env.YOUTUBE_API_KEY,
        id: channelId
    })

    if (data.error) return console.error('Error while trying to fetch channel:', data.error.message, data.error.code);
    if (data.pageInfo.totalResults < 1) return { error: { message: 'No channel was found with the ID:' + channelId, code: 404 } };
    let result = data.items[0];
    return await constants.FORMAT_DATA(result);
}

/**
 * Gets an array of video IDs from a channel.\
 * A call to this method has a quota cost of 100 units.
 * @param {string} channelId Channel ID
 * @param {number} maxResults Max number of results
 * @returns {string[]} IDs array
 */
exports.videos = async (channelId, maxResults = 100) => {
    let { data } = await youtube.search.list({
        part: 'snippet',
        key: process.env.YOUTUBE_API_KEY,
        channelId,
        maxResults
    })

    if (data.error) return console.error('Error while trying to fetch channel videos:', data.error.message, data.error.code);
    if (data.pageInfo?.totalResults < 1) return { error: { message: 'No videos were found on the requested channel. Channel ID:' + channelId, code: 404 } };
    let results = data.items.filter(i => i.id.kind === constants.KIND.VIDEO);
    return results.map(i => i.id.videoId);
}
