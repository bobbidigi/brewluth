import React, { Component } from 'react';

class SideBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      query: '',
    }
    // this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  //Handle User Input
  // handleChange(event) {
  //   this.props.onFilter(event.target.value);
  //   this.setState({ query: event.target.value })
  // }
  //Handle User Click
  handleClick(venue) {
    this.props.passClick(venue);
  }

  render() {
    // const query = this.state.query

    // let blahblah = query === 0;
    // const handler = blahblah
      // ? this.state.breweries
      // : this.props.searchVenue

    return (
      // <nav id='sidebar' className='col-xs-12 col-md-4 col-lg-5' tabIndex='1'
      //   aria-labelledby='listbox'>

       
        <ul id="sideBarContainer" >
          {this.props.breweries && this.props.breweries.map((venueItem) =>
            <li className='listItem' role='listitem' key={venueItem.venue.id}
              tabIndex='3'
              aria-labelledby='listitem'>
              <h4 id="siteTitle" onClick={() => this.handleClick(venueItem)}>
              {venueItem.venue.name}
              </h4>
              <p>{venueItem.venue.location.formattedAddress}</p>
            </li>)
          }
        </ul>


      // </nav>
  );
}
}

export default SideBar;