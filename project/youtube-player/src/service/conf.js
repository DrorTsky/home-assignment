export const BASE = "http://localhost:8000/api/youtubeUrls";

const API_KEY = "AIzaSyB4jCKF56zMO9XcrEr99P5uRnoVba8J8dU";
export const GET_YOUTUBE_VIDEO_DETAILS_API_CALL_START =
  "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=";
export const GET_YOUTUBE_VIDEO_DETAILS_API_CALL_END = `&key=${API_KEY}`;
