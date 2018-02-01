import React, { Component } from 'react';

export default class Header extends Component {

    handleClick(e) {
        e.preventDefault();
    }

    render() {
        return (
            <header>
                <button
                    onClick={this.handleClick}
                    type="button"
                >
                    Menu
                </button>
            </header>
        )
    }
    
}


