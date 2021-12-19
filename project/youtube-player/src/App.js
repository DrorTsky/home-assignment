import "./App.css";
import Grid from "@material-ui/core/Grid";
import UrlForm from "./UrlForm";
import UrlsDisplay from "./UrlsDisplay";
import ReactPlayer from "react-player";
import youtubeUrlService from "./service/youtubeUrlService";

import React, { Component } from "react";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      youtubeUrls: [],
      token: -1,
      currentUrl: "broken url",
      isReady: false,
    };

    this.addUrlToList = this.addUrlToList.bind(this);
    this.playNextVideo = this.playNextVideo.bind(this);
    this.updateUrls = this.updateUrls.bind(this);
    this.getUrls = this.getUrls.bind(this);
    this.addNewUrlToDb = this.addNewUrlToDb.bind(this);
    this.deleteUrlFromDb = this.deleteUrlFromDb.bind(this);
    this.updateUrlIndex = this.updateUrlIndex.bind(this);
  }

  /**
   * adds the new url object to existing list
   * @param  {[object]} newUrl new url object
   */
  async addUrlToList(newUrl) {
    if (ReactPlayer.canPlay(newUrl)) {
      let response = await this.addNewUrlToDb(newUrl);
      if (!this.state.isReady) {
        this.setState(() => ({
          isReady: true,
          currentUrl: response,
        }));
      }
    }
  }

  /**
   * removes finished video and if there are
   * videos left to play, sets the right parameters
   */
  async playNextVideo() {
    let firstUrlObject = this.state.youtubeUrls[0];
    if (
      this.state.currentUrl.id !== firstUrlObject.id &&
      this.state.youtubeUrls.length > 1
    ) {
      this.setState({
        currentUrl: firstUrlObject,
      });
    } else {
      await this.deleteUrl(firstUrlObject.id);
      let amountOfVideos = this.state.youtubeUrls.length;
      if (amountOfVideos == 0) {
        this.setState(() => ({
          isReady: false,
        }));
      } else {
        this.setState(() => ({
          currentUrl: this.state.youtubeUrls[0],
        }));
      }
    }
  }

  /**
   * deletes url from db
   * @param  {[int]} id new url object
   */
  async deleteUrl(id) {
    await this.deleteUrlFromDb(id);
    await this.getUrls();
  }

  async componentDidMount() {
    try {
      await this.getUrls();
      let amountOfVideos = this.state.youtubeUrls?.length;
      if (amountOfVideos > 0) {
        this.setState(() => ({
          isReady: true,
          currentUrl: this.state.youtubeUrls[0],
        }));
      }
    } catch (error) {
      console.log("no urls");
    }
  }

  /**
   * gets all url objects from server
   * and sets the state list
   */
  async getUrls() {
    try {
      let response = await youtubeUrlService.getAllYoutubeUrls(
        this.state.token
      );
      this.setState({
        token: response.token,
        youtubeUrls: [...response.data],
      });
    } catch (error) {
      this.setState({
        youtubeUrls: [],
      });
    }
  }

  /**
   * updates the index of the dragged url object
   * item
   * @param  {[int]} id url object id
   * @param  {[int]} prevIndex previous item index in list
   * @param {[int]} newIndex new item index in list
   */
  async updateUrlIndex(id, prevIndex, newIndex) {
    try {
      let response = await youtubeUrlService.updateYoutubeUrlIndex(
        id,
        prevIndex,
        newIndex
      );

      this.setState({
        youtubeUrls: response.data.data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * adds new youtube video link to server and state
   * @param  {[string]} url youtube video url like
   */
  async addNewUrlToDb(url) {
    try {
      let response = await youtubeUrlService.addYoutubeUrl(url);
      let newUrlObject = response.data;
      this.setState((prevState) => ({
        youtubeUrls: [...prevState.youtubeUrls, newUrlObject],
      }));
      return newUrlObject;
    } catch (error) {
      console.log("failed to add");
    }
  }

  /**
   * invokes server delete api
   * @param  {[int]} id item object id
   */
  async deleteUrlFromDb(id) {
    try {
      await youtubeUrlService.deleteUrl(id);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * updates state youtube urls
   * @param  {[Array]} newUrls list of url objects
   */
  updateUrls(newUrls) {
    this.setState(() => ({
      youtubeUrls: [...newUrls],
    }));
  }

  render() {
    return (
      <Grid
        container
        spacing={3}
        layout={"row"}
        spacing={8}
        className="display"
      >
        <Grid item xs={6}>
          <UrlForm addUrl={this.addUrlToList} />
          <UrlsDisplay
            youtubeUrls={this.state.youtubeUrls}
            updateUrls={this.updateUrls}
            updateUrlIndex={this.updateUrlIndex}
          />
        </Grid>
        <Grid item xs={6}>
          <ReactPlayer
            controls
            playing={this.state.isReady}
            url={this.state.currentUrl?.urlData?.url}
            onEnded={this.playNextVideo}
            onReady={this.isReady}
          />
        </Grid>
      </Grid>
    );
  }
}
