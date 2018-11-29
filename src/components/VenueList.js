import React, { Component } from 'react';
import ListItem from './ListItem.js';

export default class VenueList extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  //Handle User Click
  handleClick(brewery) {
    this.props.passClick(brewery);
  }


render(){
  return(
    <ol id = "venueList" >
      {
        this.props.breweries &&
          this.props.breweries.map((brewery) => (
            <ListItem
              key={brewery.venue.id}
              venue={brewery.venue}
              // infowindow={infowindow}
              // content={content}
              // whenSideBarBreweryClicked={whenSideBarBreweryClicked}
              passClick={this.handleClick}
            />
          ))
      }
    </ol>
  );
}
};

// export default VenueList;
