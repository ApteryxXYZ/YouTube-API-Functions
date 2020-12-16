require('dotenv').config();

// require constants and functions from files
const constants = require('./youtube/util/constants'),
    youtube = Object.assign({},
        require('./youtube/functions/channel'),
        require('./youtube/functions/upload'),
        require('./youtube/functions/video')
    );

// example usage
const start = async (channelId, videoId) => {
    // returns an object containing channel information
    let channel = await youtube.channel(channelId);

    // returns an array of 100 video IDs from a channel
    let videos = await youtube.videos(channel.id, 100);

    // returns an object containing video information
    let video = await youtube.video(videoId);

    // downloads a video via it's ID
    let { download, file } = youtube.download(video.id);

    // when download is finsihed...
    download.on('finish', async () => {

        // upload a video to youtube
        // if no oauth is set, you will be asked to authorise your google account
        await youtube.upload(file, 'Title', 'Description', ['tag1', 'tag2', 'tag3'], false);
    })
}

start();