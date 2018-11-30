import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import SideBar from './components/SideBar.js';
import Map from './components/Map.js';

class App extends Component {
  // state = {
  //   super(props);
  //   breweries: [],
  //   markers: [],
  //   infowindow: [],
  //   content: []
  // }

  constructor(props) {
    super(props);
    this.state = {
      breweries: [],
      query: '',
      searchVenue: [],
      markers: [],
      infoWindow: null,
      map: null,
      hasError: false,
    };
    // this.handleInputChange = this.handleInputChange.bind(this);
    // this.mapError = this.mapError.bind(this)
  }



  // Get venue data from Foursquare when component mounts
  componentDidMount() {
    this.getVenues()

    // Alerts user if there are any issues loading the  Google Maps API
    window.gm_authFailure = () => {
      alert(
        "This page didn't load Google Maps correctly. See the JavaScript console for technical details."
      )
    }
  }

  loadMap = () => {
    const googleMapsKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    loadScript(`https://maps.googleapis.com/maps/api/js?v=3.exp&key=${googleMapsKey}&callback=initMap`)
    window.initMap = this.initMap;
  }

  // whenSideBarBreweryClicked = (breweryListItem) => {
  //   console.log(breweryListItem.id)
  //   const markers = this.state.markers;
  //   const content = `
  //   <h4>${breweryListItem.name}</h4 <br>
  //   <p>${breweryListItem.location.formattedAddress[0]}</p>
  //   <p>${breweryListItem.location.formattedAddress[1]}</p>
  //   `;

  //   this.setState({ content: content });

  //   markers.map(marker => {
  //     if (marker.id === breweryListItem.id) {
  //       window.infowindow.setContent(this.state.content);
  //       // window.google.maps.infowindow.open(this.map, marker);
  //       console.log(marker.id);
  //       marker.isOpen = true;
  //       // infowindow.open(marker);
  //       marker.setAnimation(window.google.maps.Animation.BOUNCE);
  //       setTimeout(function(){ marker.setAnimation(null); }, 750);
  //     } else {
  //       marker.setAnimation(null);
  //       console.log("not a match")
  //     }
  //   })
  // }

  // Data needed when using Foursquare API
  getVenues = () => {
    const foursquareClientId = process.env.REACT_APP_FOURSQUARE_CLIENT_ID;
    const foursquareClientSecret = process.env.REACT_APP_FOURSQUARE_CLIENT_SECRET;
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: `${foursquareClientId}`,
      client_secret: `${foursquareClientSecret}`,
      query: "breweries",
      near: "Duluth, Minnesota",
      v: "20181811"
    }

    // Get data from Foursquare and add venues (breweries) to state
    axios.get(endPoint + new URLSearchParams(parameters))
    .then(res => {
      this.setState({
        breweries: res.data.response.groups[0].items
      }, this.loadMap());
      console.log(res);
    })
    .catch((err) => {
      console.log(`Error in Axios get attempt: ${err}`);
      alert("There was an error fetching venue data; please see the JavaScript console for technical details.")
    })
  }

  // Initialize the map per Google Maps JavaScript API
  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 46.785039, lng: -92.107418},
      zoom: 13.5
    });

    // Create infowindow outside of loop
    let infowindow = new window.google.maps.InfoWindow({
      content: '',
      map: map,
      venue: '',
    });
    this.setState({
      infoWindow: infowindow
    });

    // Map through breweries in state and add a marker for each venue
    this.state.breweries.map(stateBreweries => {
      const position = {
        lat: stateBreweries.venue.location.lat,
        lng: stateBreweries.venue.location.lng
      }
      const animation = window.google.maps.Animation.DROP
      const title = stateBreweries.venue.name
      const id = stateBreweries.venue.id
      const content = `
      <h4>${stateBreweries.venue.name}</h4 <br>
      <p>${stateBreweries.venue.location.formattedAddress[0]}</p>
      <p>${stateBreweries.venue.location.formattedAddress[1]}</p>
      `

      const marker = new window.google.maps.Marker({
      position: position,
      map: map,
      title: title,
      id: id,
      isOpen: false,
      animation: animation
    })

    this.setState(() => this.state.markers.push(marker));
    
    // Update content of and open an info window when marker clicked
    // * Adds click event listener to markers
      marker.addListener("click", () => {
      // // * Resets info window content when marker is clicked
      this.setState({ content: content });
      // // * Sets info window content based on state
      infowindow.setContent(this.state.content);
      // * Opens info window on marker when clicked
      marker.isOpen = true;
      if(marker.isOpen){
        infowindow.open(map, marker);
      }
      
      // * Markers bounce once when clicked
      if (marker.title === stateBreweries.venue.name) {
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(function(){ marker.setAnimation(null); }, 750);
      }
      window.setTimeout(() => {
        marker.setAnimation(null);
      }, 3000);
    });

  });
};


  openInfoWindow = (marker, venue) => {

    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(window.google.maps.Animation.BOUNCE);
    } setTimeout(() => {
      marker.setAnimation(null, 1500)
    });

    this.state.infoWindow.setContent(`<h4>${venue.venue.name}</h4>${venue.venue.location.formattedAddress}<p></p>`);
    this.state.infoWindow.open(this.state.map, marker);
  };

  //Open Infowindows onClick of List Item
  handleClick = brewery => {
    console.log(brewery);
    this.state.markers.forEach(mapMarker => {
      if (mapMarker.id === brewery.venue.id) {
        console.log(mapMarker, brewery);
        this.openInfoWindow(mapMarker, brewery);
      }
    });
  }


  render() {
    return (
      <div className="App">
      <main id="main">
        <SideBar 
        {...this.state} 
        // whenSideBarBreweryClicked={this.whenSideBarBreweryClicked} 
        passClick={this.handleClick}
        />
        <Map {...this.state} />
      </main>
    </div>

    );
  }
}

  // Code to load Google Maps without using any external components
  const loadScript = (source) => {
  const firstScriptTag = window.document.getElementsByTagName("script")[0];
  const script = window.document.createElement("script");
  script.src = source;
  script.async = true;
  script.defer = true;
  firstScriptTag.parentNode.insertBefore(script, firstScriptTag)
}

export default App;
