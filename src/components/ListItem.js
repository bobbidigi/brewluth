import React, { Component } from 'react';

class ListItem extends Component {

  render() {
  	console.log(this.props.venue)
    return (
      <li
        className="listItem"
        // onClick={() => this.props.handleClick(this.props.venue)
        // onClick={() => this.props.whenSideBarBreweryClicked(this.props.venue)}>
        {...this.props}
        >

        <p onClick={() => this.props.handleClick(this.props.venue)}>{this.props.venue.name}</p>
      </li>
    );
  }

}

export default ListItem;
