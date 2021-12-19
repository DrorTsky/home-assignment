import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export default class UrlForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      youtubeUrl: "",
    };

    this.onChangeFormInput = this.onChangeFormInput.bind(this);
    this.addNewUrl = this.addNewUrl.bind(this);
  }

  onChangeFormInput(event) {
    event.preventDefault();
    const {
      target: { name, value },
    } = event;
    this.setState({ [name]: value });
  }

  /**
   * adds new url
   */
  addNewUrl() {
    this.props.addUrl(this.state.youtubeUrl);
  }

  render() {
    const formDisplay = {
      display: "flex",
      justifyContent: "space-between",
    };

    const inputStyle = {
      paddingRight: "10px",
    };

    return (
      <div>
        <form autoComplete="off" style={formDisplay}>
          <TextField
            id="standard-basic"
            label="Video URL"
            variant="outlined"
            name="youtubeUrl"
            fullWidth
            style={inputStyle}
            onChange={this.onChangeFormInput}
          />
          <Button variant="outlined" onClick={this.addNewUrl}>
            Submit
          </Button>
        </form>
      </div>
    );
  }
}
