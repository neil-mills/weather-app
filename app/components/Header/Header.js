import React, { Component } from 'react';
import './header.scss';
import '../../svg/menu.svg';

export default class Header extends Component {

    handleClick(e) {
        e.preventDefault();
    }

    render() {
        return (
            <header className="header" role="header">
                <button
                    className="menu-button button button--menu"
                    onClick={this.handleClick}
                    type="button"
                >
                    Menu
                    <svg className="menu-button__icon">
                        <use xlinkHref="#menu"></use>
                    </svg>
                </button>
                <h1 className="app-title">Weather App</h1>
            </header>
        )
    }
    
}


