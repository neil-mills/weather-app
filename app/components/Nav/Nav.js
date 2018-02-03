import React, { Component } from 'react';
import { searchLocation } from '../../utils/api';

export default class Nav extends Component {
    constructor(){
        super();
        this.handleChange = this.handleChange.bind(this);
        this.drawResult = this.drawResult.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            searchResults: []
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
        return (
            <li
                key={key}
                onClick={(e) => this.handleClick(e, location.name, false)}
            >
                {location.name}
            </li>
        )
    }

    render() {
        return (
            <nav className="nav">
                <form className="search">
                    <input
                        type="text"
                        placeholder="Enter a location"
                        onChange={this.handleChange}
                        ref={(input) => this.searchInput = input}
                    />
                    { this.state.searchResults.length > 0 &&
                         <ul className="search-results">
                         {
                             this.state.searchResults.map((location, index) => this.drawResult(index, location))
                         }
                        </ul>
                    }
                </form>
                { this.props.locations && 
                    <ul className="locations-list">
                        {
                            this.props.locations.map((location, index) => this.drawLocation(index, location))
                        }
                    </ul>   
                }
            </nav>
        )
    }
}
