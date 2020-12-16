# YouTube API Functions

'YouTube API Functions' is a project with a handful of YouTube API related functions, listed below.\
This is from another project I started which I couldn't finish due to limitations of the YouTube API regarding uploading from an unverified Google API project.\
I might turn this into a proper node module someday.

## Functions

### Video

Gets information about a video via its ID.\
Usage: `video(<videoId>)`

### Download

Downloads a video and saves it to the 'videos' folder.\
Usage: `download(<videoId>)`

### Channel

Gets information about a channel via its ID.\
Usage: `channel(<channelId>)`

### Videos

Gets an array of video IDs from a channel.\
Usage: `videos(<channelId>, <maxResults>)`

### Upload

Upload a video file to YouTube.\
Usage: `upload(<videoFilePath>, <title>, <description>, <tags>, <deleteFile>)`

## Example

Full example can be found in the `src/index.js` file.

```js
// example usage
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
```

## Modules

### [GoogleAPIs](https://npmjs.com/package/googleapis)
Official client library for Googles APIs, including YouTube.

### [YTDL-Core](https://npmjs.com/package/ytdl-core)
Used within the `download` function to download a video via it's URL.

### [DotEnv](https://npmjs.com/package/dotenv)
Loads environment variables from .env file.

## Setup

**1.** Login to or create a Google Developer account [here](https://developers.google.com/).\
**2.** Go [here](https://console.developers.google.com/project) and choose/create a project.\
**3.** Click on 'ENABLE APIS AND SERVICES' and enable 'YouTube Data API v3'.\
**4.** On the left click 'Credentials' and then 'CREATE CREDENTIALS'.\
**5.** Click 'API key' and copy the key into the .env file as `YOUTUBE_API_KEY=<key>`.\
**6.** Now click on 'CREATE CREDENTIALS' again and select 'OAuth client ID', you may be asked to configure yout consent screen.\
&nbsp;&nbsp;&nbsp;&nbsp;Consent Screen:\
&nbsp;&nbsp;&nbsp;&nbsp;**6.1.** Click 'External' and then 'Create'.\
&nbsp;&nbsp;&nbsp;&nbsp;**6.2.** Choose a name, user support email and developer content information then click 'SAVE AND CONTINUE'.\
&nbsp;&nbsp;&nbsp;&nbsp;**6.3.** On the SCOPES section, click 'ADD OR REMOVE SCOPES' and click the one which scope is '.../auth/youtube.upload' then click 'UPDATE' and then 'SAVE AND CONTINUE'.\
&nbsp;&nbsp;&nbsp;&nbsp;**6.5.** On the TEST USERS section, click 'ADD USERS' and type in test user emails and finally click 'SAVE AND CONTINUE' and go back to step 6.
**7.** Select 'Web application' as the application type.\
**8.** Click 'ADD URI' and input at least one URL to redirect to, then click 'CREATE'.\
**9.** On the credentials page, next to the newly made OAuth2 client click the download button.\
**10.** Move the downloaded JSON into your apps root directory and rename it to 'client_secret.json'.\
