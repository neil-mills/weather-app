import React, { Component } from 'react';
import { searchLocation, getForecast } from '../../utils/api';
import axios from 'axios';
import './nav.scss';

export default class Nav extends Component {
    constructor(){
        super();
        this.handleChange = this.handleChange.bind(this);
        this.drawResult = this.drawResult.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.expandSearch = this.expandSearch.bind(this);
        this.state = {
            searchResults: [],
            searchActive: false
        }
    }

    expandSearch() {
        if(!this.state.searchActive) {
            this.setState({ searchActive: true });
            this.searchInput.focus();
        }
    }

    handleChange(e) {
        e.preventDefault();
        searchLocation(this.searchInput.value)
        .then((results) => {
            const searchResults = results.data;
            this.setState({ searchResults })
        })
    }

    handleClick(e, location, save=true) {
        e.preventDefault();
        this.props.getForecast(location, save);
    }

    drawResult(key, location) {
        return (
            <li
                key={key}
                onClick={(e) => this.handleClick(e, location.name)}
            >
                {location.name}
            </li>
        )
    }

    drawLocation(key, location) {
        const forecast = location.forecast.forecast.forecastday[0];
        const icon = this.props.getIcon(forecast.day.condition.code);
        return (
            <li
                key={key}
                onClick={(e) => this.handleClick(e, location.name, false)}
                className="location-item"
            >
                <div className="location-item__col location-item__col--left">
                    <span className="location-item__label location-item__label--name">{location.name}</span>
                    <span className="location-item__label location-item__label--region">{location.region}</span>
                </div>
                <div className="location-item__col location-item__col--right">
                    <span className="location-item__temp">{Math.round(forecast.day.maxtemp_c)}&deg;</span>
                    <svg className="location-item__icon" viewBox="0 0 60 60">
                        <use xlinkHref={`#${icon.name}`}></use>
                    </svg>
                </div>     
            </li>
        )
    }

    render() {
        return (
            <div>
                <form className="search-form" data-expanded={this.state.searchActive}>
                    <input
                        type="text"
                        placeholder="Enter a location"
                        onChange={this.handleChange}
                        onFocus={this.expandSearch}
                        ref={(input) => this.searchInput = input}
                        className="search-form__input"
                    />
                    <a
                        className="search-form__cancel"
                    >
                        Cancel
                    </a>
                    { this.state.searchResults.length > 0 &&
                        <ul className="search-results">
                        {
                            this.state.searchResults.map((location, index) => this.drawResult(index, location))
                        }
                        </ul>
                    }
                </form>
                <nav className="nav">
                    { this.props.locations && 
                        <ul className="locations-list">
                            {
                                this.props.locations.map((location, index) => this.drawLocation(index, location))
                            }
                        </ul>   
                    }
                </nav>
            </div>
        )
    }
}
