import React, {Component} from 'react';
import moment from 'moment';
import './day-menu.scss';

export default class DayMenu extends Component {
    constructor() {
        super();
        this.state = {
            itemStyle: { flex: '0 0 0px' },
            listStyle: { flex: '0 0 0px' } 
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleClick(e, key) {
       e.preventDefault();
       this.props.updateForecastDay(key); 
    }

    handleResize() {
        const windowWidth = window.innerWidth;
        const itemWidth = (windowWidth/100) * 28;
        const itemStyle = { flex: `0 0 ${(windowWidth/100) * 28}px` } 
        const listStyle = { flex: `0 0 ${itemWidth}px` };
        this.setState({
            itemStyle,
            listStyle
        });
    }

    renderDay(key, day) {
        const daysOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        const date = moment(new Date(day.date));
        const icon = this.props.getIcon(day.day.condition.code);
        return (
            <li
                key={key}
                className="day-item"
                style={this.state.itemStyle}
                onClick={(e) => this.handleClick(e, key)}
            >
                <p className="day-item__title">{date.format('ddd')}</p>
                <div className="day-item__column day-item__column--left">
                    <svg className="day-item__icon" viewBox="0 0 60 60">
                        <use xlinkHref={`#${icon.name}`}></use>
                    </svg>
                </div>
                <div className="day-item__column day-item__column--right">
                    <p className="day-item__temp day-item__temp--max">{Math.round(day.day.maxtemp_c)}&deg;</p>
                    <p className="day-item__temp day-item__temp--min">{Math.round(day.day.mintemp_c)}&deg;</p>
                </div> 
            </li>
        )
    }

    render() {
        return (
            <menu className="day-menu">
                <div className="day-menu__track">
                    <ul
                        className="day-menu__list"
                        style={this.state.listStyle}
                    >
                        {
                            this.props.forecastDays.map((day, index) => this.renderDay(index, day))
                        }
                    </ul>
                </div>
            </menu>
        )
    }
}