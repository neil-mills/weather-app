import React, { Component } from 'react';
import Loading from '../Loading/Loading';
import Forecast from '../Forecast/Forecast';
import { getCurrentPosition, getCurrentLocation, getForecast } from '../../utils/api';  

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            locations: [],
            forecast: {},
            loading: true
        }
        this.getForecast = this.getForecast.bind(this);
        this.defaultLocation = { name: 'London', latitude: 51.5287718, longitude: -0.2416812 }; 
    }
    componentDidMount() {
        const localStorageLocations = localStorage.getItem('locations');

        if(localStorageLocations) {
            this.setState({
                locations: JSON.parse(localStorageLocations)
            });
        }

        if(navigator.geolocation) {
            getCurrentPosition()
            .then(({ latitude, longitude }) => {
                getCurrentLocation( { latitude, longitude })
                .then((response) => {
                    const place = response.data.results.filter((result) => result.types.includes('postal_town'));
                    this.getForecast(place[0].formatted_address)
                })
            })
            .catch((err) => this.getForecast(this.defaultLocation.name)) //coords not returned or location fetch rejected in browser
        } else {
            //get forecast for default location
            this.getForecast(this.defaultLocation.name, false);
        }
    }

    componentWillUpdate(newProps, newState) {
        localStorage.setItem('locations', JSON.stringify(newState.locations));
    }

    getForecast(location, saveLocation=true) {
        getForecast(location)
        .then((response) => {
            const forecast = response.data;
            const locations = [...this.state.locations];
            let newLocation = true;
            for (let location of locations) {
                if (location.name === forecast.location.name) {
                  newLocation = false;
                  break;
                }
            }
            if(saveLocation && newLocation) {
                locations.push({
                    name: forecast.location.name,
                    latitude: forecast.location.lat,
                    longitude: forecast.location.lon
                });
            }
            this.setState({
                forecast,
                locations,
                loading: false
            });
        })
    }

    changeForecastDay(day) {
        
    }

    render() {
        return (
            <div>
                { this.state.loading ?
                    <Loading/>
                    :
                    <Forecast forecast={this.state.forecast} />
                }
            </div>
        )
    }
}