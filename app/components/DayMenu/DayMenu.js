import React, {Component} from 'react';
import moment from 'moment';

export default class DayMenu extends Component {

    handleClick(e) {

    }

    renderDay(key, day) {
        const daysOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        const date = moment(new Date(day.date));
        return (
            <li
                key={key}
                className="day-item"
                onClick={this.handleClick}
            >
                <p className="day-item__title">{date.format('ddd')}</p>
                <img src={`../../svg/${day.day.condition.code}.svg`} alt="" />
                <p className="day-item__max-temp">{day.day.maxtemp_c}&deg;</p>
                <p className="day-item__min-temp">{day.day.mintemp_c}&deg;</p> 
            </li>
        )
    }

    render() {
        return (
            <menu className="day-menu">
                <ul className="day-menu__list">
                    {
                        this.props.forecastDays.map((day, index) => this.renderDay(index, day))
                    }
                </ul>
            </menu>
            
        )
    }
}