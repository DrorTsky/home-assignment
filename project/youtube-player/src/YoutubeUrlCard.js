import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";

export default class YoutubeUrlCard extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const display = {
      display: "flex",
      justifyContent: "center",
    };

    return (
      <div style={{ paddingTop: "20px" }}>
        <Card variant="outlined" style={display}>
          <h3>
            {this.props.title} {this.props.duration}
          </h3>
        </Card>
      </div>
    );
  }
}
