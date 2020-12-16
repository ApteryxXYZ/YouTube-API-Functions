// YouTube URL bases
exports.BASE_URL = {
    HOST: 'https://youtube.com/',
    VIDEO: 'https://youtube.com/watch?v=',
    VIDEO_SHORT: 'https://youtu.be/',
    CHANNEL: 'https://youtube.com/channel/'
}

// kinds of youtube content
exports.KIND = {
    VIDEO: 'youtube#video',
    CHANNEL: 'youtube#channel',
    PLAYLIST: 'youtube#playlist'
}

/**
 * Generates a nicely formatted object from raw data.
 * @param {object} raw Raw data from API
 * @returns {object} Data object
 */
exports.FORMAT_DATA = (raw = { id: 'none' }) => {
    if ([raw.kind, raw.id?.kind].includes(exports.KIND.VIDEO)) return {
        type: 'video', id: raw.kind === exports.KIND.VIDEO ? raw.id : raw.id.videoId,
        title: raw.snippet.title, description: raw.snippet.description,
        channel: { id: raw.snippet.channelId },
        category: { id: raw.snippet.categoryId },
        tags: raw.snippet.tags, publishedAt: new Date(raw.snippet.publishedAt),
        url: (short = false) => (short ? BASE_URL.VIDEO_SHORT : BASE_URL.VIDEO) + (raw.kind === KIND.VIDEO ? raw.id : raw.id.videoId),
        thumbnail: (type = 'high') => raw.snippet.thumbnails[type]
    };

    else if ([raw.kind, raw.id?.kind].includes(exports.KIND.CHANNEL)) return {
        type: 'channel', id: raw.kind === exports.KIND.CHANNEL ? raw.id : raw.id.chanenlId,
        title: raw.snippet.title, description: raw.snippet.description,
        createdAt: new Date(raw.snippet.publishedAt),
        avatar: (type = 'high') => raw.snippet.thumbnails[type]
    };

    else return raw;
}
