import React, { Component } from 'react';
import Loading from '../Loading/Loading';
import Header from '../Header/Header';
import Nav from '../Nav/Nav';
import Forecast from '../Forecast/Forecast';
import { getCurrentPosition, getCurrentLocation, getForecast, getHourlyForecast } from '../../utils/api';  
import { Route } from 'react-router-dom';
import '../../svg/cloud.svg';
import '../../svg/heavy-rain.svg';
import '../../svg/rain.svg';
import '../../svg/showers.svg';
import '../../svg/snow.svg';
import '../../svg/sun-cloud.svg';
import '../../svg/sun-rain.svg';
import '../../svg/sunny.svg';
import '../../svg/thunder.svg';
import icons from '../../utils/icons';
import './app.scss';

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            locations: [],
            forecast: {},
            currentForecast: {},
            hourlyForecast: {},
            currentLocation: null,
            loading: true
        }
        this.getForecast = this.getForecast.bind(this);
        this.updateForecastDay = this.updateForecastDay.bind(this);
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

    getIcon(code) {
        const forecastIcon = icons.data.filter((icon) => icon.code === code)
        if(forecastIcon) return forecastIcon[0];
        return false;
    }

    getForecast(location, saveLocation=true) {
        getForecast(location)
        .then((response) => {
            const forecast = response.data;
            const currentForecast = forecast.forecast.forecastday[0];
            const currentLocation = forecast.location.name;
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
                currentForecast,
                currentLocation,
                locations,
                loading: false
            });
           // getHourlyForecast(currentLocation,12);
        })
    }

    updateForecastDay(day) {
        const currentForecast = this.state.forecast.forecast.forecastday[day];
        this.setState({ currentForecast });
    }

    render() {
        const { match, location } = this.props;
        return (
            <div>
                <Nav
                    locations={this.state.locations}
                    getForecast={this.getForecast}
                    className="off-canvas"
                    role="navigation"
                />
                <main className="main" role="main">
                <Header/>
                    { this.state.loading ?
                        <Loading/>
                        :
                        <Forecast
                            currentForecast={this.state.currentForecast}
                            forecast={this.state.forecast}
                            updateForecastDay={this.updateForecastDay}
                            getIcon={this.getIcon}
                        />
                    }
                </main>
            </div>
        )
    }
}