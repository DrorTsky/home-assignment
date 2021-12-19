import React, { Component } from "react";
import YoutubeUrlCard from "./YoutubeUrlCard";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

export default class UrlsDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleOnDragEnd = this.handleOnDragEnd.bind(this);
  }

  /**
   * updates dragged items indexes
   * @param  {[Object]} result result object
   */
  handleOnDragEnd(result) {
    if (!result.destination) return;

    const urls = Array.from(this.props.youtubeUrls);
    const [reorderedUrl] = urls.splice(result.source.index, 1);
    urls.splice(result.destination.index, 0, reorderedUrl);

    this.props.updateUrls(urls);
    this.props.updateUrlIndex(
      urls[result.destination.index].id,
      result.source.index,
      result.destination.index
    );
  }

  render() {
    return (
      <div style={{ paddingTop: "5px" }}>
        <Card>
          <CardContent
            variant="outlined"
            style={{
              overflow: "auto",
              height: "400px",
            }}
          >
            <DragDropContext onDragEnd={this.handleOnDragEnd}>
              <Droppable droppableId="urls">
                {(provided) => (
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{ listStyleType: "none" }}
                  >
                    {this.props.youtubeUrls.map((data, index) => {
                      return (
                        <Draggable
                          key={index}
                          draggableId={index + data.urlData.url}
                          index={index}
                        >
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <YoutubeUrlCard
                                key={data.id}
                                title={data.urlData.title}
                                duration={data.urlData.duration}
                              />
                            </li>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>
      </div>
    );
  }
}
