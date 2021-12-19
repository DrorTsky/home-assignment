import axios from "axios";
import {
  BASE,
  GET_YOUTUBE_VIDEO_DETAILS_API_CALL_END,
  GET_YOUTUBE_VIDEO_DETAILS_API_CALL_START,
} from "./conf";

class youtubeUrlService {
  async getAllYoutubeUrls(token) {
    let response = await axios.get(BASE + `/${token}`, {
      responseType: "json",
    });
    return response.data;
  }

  async addYoutubeUrl(url) {
    try {
      // gets video data
      let videoId = this.youtube_parser(url);

      let youtubeApiUrl =
        GET_YOUTUBE_VIDEO_DETAILS_API_CALL_START +
        videoId +
        GET_YOUTUBE_VIDEO_DETAILS_API_CALL_END;

      let youtubeApiResponse = await axios.get(youtubeApiUrl);

      // reshape response
      let duration = this.convertISO8601ToSeconds(
        youtubeApiResponse.data.items[0].contentDetails.duration
      );

      let title = youtubeApiResponse.data.items[0].snippet.title;

      let data = {
        url: url,
        title: title,
        duration: duration,
      };

      //saves new data in "DB"
      let response = await axios.post(BASE, { urlData: data });
      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateYoutubeUrlIndex(url_id, prevIndex, newIndex) {
    try {
      let body = { prevIndex: prevIndex, newIndex: newIndex };
      const response = await axios.put(BASE + `/${url_id}`, body);
      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  deleteUrl(url_id) {
    return axios
      .delete(
        BASE + `/${url_id}`,
        {
          header: "Access-Control-Allow-Origin",
        },
        {
          responseType: "json",
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  }

  createUrlObject(url) {
    let id = this.youtube_parser(url);
    let apiUrl =
      GET_YOUTUBE_VIDEO_DETAILS_API_CALL_START +
      id +
      GET_YOUTUBE_VIDEO_DETAILS_API_CALL_END;
  }

  convertISO8601ToSeconds(input) {
    var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
    var hours = 0,
      minutes = 0,
      seconds = 0,
      totalseconds;

    if (reptms.test(input)) {
      var matches = reptms.exec(input);
      if (matches[1]) hours = Number(matches[1]);
      if (matches[2]) minutes = Number(matches[2]);
      if (matches[3]) seconds = Number(matches[3]);
      totalseconds = `${hours}:${minutes}:${seconds}`;
    }

    return totalseconds;
  }

  youtube_parser(url) {
    var regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return match && match[7].length == 11 ? match[7] : false;
  }
}

export default new youtubeUrlService();
