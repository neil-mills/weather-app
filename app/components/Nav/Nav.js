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
        this.closeSearch = this.closeSearch.bind(this);
        this.state = {
            searchResults: [],
            searchActive: false,
            offCanvasStyle: {zIndex: 0}
        }
    }

    expandSearch() {
        if(!this.state.searchActive) {
            const offCanvasStyle = {zIndex: 100}
            this.setState({
                searchActive: true,
                offCanvasStyle
            });
            this.searchInput.focus();
        }
    }

    closeSearch() {
        this.setState({
            searchActive: false,
            searchResults: []
        });
        this.searchInput.value = "";
        this.searchInput.blur();
        const offCanvasStyle = {zIndex: 0}
        setTimeout(() => {
            this.setState({ offCanvasStyle })
        },400);
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
        const offCanvasStyle = {zIndex: 0}
        this.setState({ offCanvasStyle })
        this.props.toggleMenuState();
        setTimeout(() => {
            this.closeSearch();
        },400)
    }

    drawResult(key, location) {
        return (
            <li
                key={key}
                onClick={(e) => this.handleClick(e, location.name)}
                className="result-item"
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
            <div className="off-canvas" data-expanded={this.state.searchActive} style={this.state.offCanvasStyle}>
                <form className="search-form">
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
                        onClick={(e) => e.preventDefault() || this.closeSearch()}
                    >
                        Cancel
                    </a>
                </form>
                { this.state.searchResults.length > 0 &&
                        <ul className="search-results">
                            { this.state.searchResults.map((location, index) => this.drawResult(index, location)) }
                        </ul>
                 }
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
