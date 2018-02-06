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
import moment from 'moment';
import axios from 'axios';

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            locations: [],
            forecast: {},
            currentForecast: {},
            hourlyForecast: {},
            currentLocation: null,
            currentDate: null,
            menuActive: false,
            navLoading: true,
            loading: true
        }
        this.getForecast = this.getForecast.bind(this);
        this.updateForecastDay = this.updateForecastDay.bind(this);
        this.isCurrentDate = this.isCurrentDate.bind(this);
        this.defaultLocation = { name: 'London', latitude: 51.5287718, longitude: -0.2416812 }; 
        this.toggleMenuState = this.toggleMenuState.bind(this);
        this.updateLocationForecasts = this.updateLocationForecasts.bind(this);
    }

    componentDidMount() {
        const localStorageLocations = localStorage.getItem('locations');
        if(localStorageLocations) {
            const locations = JSON.parse(localStorageLocations);
            if(locations.length) {
                this.updateLocationForecasts(locations);
            } 
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

    updateLocationForecasts(locations) {
        const promises = [];
        locations.map((location) => {
            promises.push(getForecast(location.name));
        });
        axios
        .all(promises)
        .then((forecasts) => {
            console.log('update location forecasts',forecasts);
            const locations = {...this.state.locations}
            forecasts.map((forecast, index) => {
                const filteredLocations = this.state.locations.filter((location) => location.name === forecast.location.name);
                if(filteredLocations.length) {
                    locations[index].forecast = forecast
                }
            })
            this.setState({
                locations,
                navLoading: false
            })
        })
    }

    getIcon(code) {
        const forecastIcon = icons.data.filter((icon) => icon.code === code)
        if(forecastIcon) return forecastIcon[0];
        return false;
    }

    isToday(date) {
        if(moment(new Date()).format('MMM Do YY') === moment(new Date(date)).format('MMM Do YY')) {
            return true;
        }
        return false;
    }

    isCurrentDate(date) {
        if(moment(new Date(this.state.currentDate)).format('MMM Do YY') === moment(new Date(date)).format('MMM Do YY')) {
            return true;
        }
        return false;
    }

    getForecast(location, saveLocation=true) {
        getForecast(location)
        .then((response) => {
            const forecast = response.data;
            const currentForecast = forecast.forecast.forecastday[0];
            const currentLocation = forecast.location.name;
            const currentDate = currentForecast.date;
            const locations = [...this.state.locations];
            let newLocation = true;
            for (let location of locations) {
                if (location.name === forecast.location.name) {
                  newLocation = false;
                  if(!location.forecast) {
                    location.forecast = forecast;
                    this.setState({
                        locations
                    })
                  }
                  break;
                }
                
            }
            if(saveLocation && newLocation) {
                locations.push({
                    name: forecast.location.name,
                    region: forecast.location.region,
                    latitude: forecast.location.lat,
                    longitude: forecast.location.lon,
                    forecast 
                });
            }
            this.setState({
                forecast,
                currentForecast,
                currentLocation,
                currentDate,
                locations,
                loading: false,
                navLoading: false
            });
           // getHourlyForecast(currentLocation,12);
        })
    }

    updateForecastDay(day) {
        const currentForecast = this.state.forecast.forecast.forecastday[day];
        const currentDate = currentForecast.date;
        this.setState({
            currentForecast,
            currentDate
        });
    }

    toggleMenuState() {
        const menuActive = this.state.menuActive ? false : true;
        this.setState({ menuActive })
    }

    render() {
        const { match, location } = this.props;
        return (
            <div>
                { !this.state.navLoading &&
                <Nav
                    locations={this.state.locations}
                    getForecast={this.getForecast}
                    getIcon={this.getIcon}
                    className="off-canvas"
                    role="navigation"
                />
                }
                <main
                    className="main"
                    role="main"
                    data-move={this.state.menuActive}
                >
                <Header
                    toggleMenuState={this.toggleMenuState}
                />
                    { this.state.loading ?
                        <Loading/>
                        :
                        <Forecast
                            currentForecast={this.state.currentForecast}
                            forecast={this.state.forecast}
                            updateForecastDay={this.updateForecastDay}
                            getIcon={this.getIcon}
                            isToday={this.isToday}
                            isCurrentDate={this.isCurrentDate}
                        />
                    }
                </main>
            </div>
        )
    }
}