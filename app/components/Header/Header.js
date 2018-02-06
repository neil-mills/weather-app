import React, { Component } from 'react';
import './header.scss';
import '../../svg/menu.svg';
import '../../svg/refresh.svg';

export default class Header extends Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
        this.props.toggleMenuState()
    }

    render() {
        return (
            <header className="header" role="header">
                {
                    !this.props.loading ?
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
                        :
                        <div className="menu-button menu-button--loading">
                            <svg className="menu-button__icon">
                                <use xlinkHref="#refresh"></use>
                            </svg>
                        </div>
                }
                
                <h1 className="app-title">Weather App</h1>
            </header>
        )
    }
    
}


