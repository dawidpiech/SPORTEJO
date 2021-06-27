import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Image from "./Image";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",

  background: isDragging ? "rgba(150, 28, 166, .6" : "#ffffff",

  margin: "4px",
  borderRadius: "10px",
  overflow: "hidden",
  padding: "5px",

  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "rgba(150, 28, 166, .2" : "rgba(55, 55, 55, .1)",
  display: "flex",
  overflow: "auto",
  padding: "8px",
  borderRadius: "20px",
  marginTop: "20px",
  height: "150px",
});

class MultipleImageViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: props.photos,
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      items: nextProps.photos,
    });
  }

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items,
    });
  }

  componentDidUpdate() {
    this.props.reorderPhotos(this.state.items);
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              {this.state.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      {
                        <Image
                          src={item.content}
                          id={item.id}
                          removeFile={this.props.removeFile}
                        ></Image>
                      }
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default MultipleImageViewer;
