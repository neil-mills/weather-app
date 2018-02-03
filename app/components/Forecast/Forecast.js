import React, {Component} from 'react';
import DayMenu from '../DayMenu/DayMenu';
import moment from 'moment';


export default class Forecast extends Component {
    render() {
        const { location } = this.props.forecast;
        const current = this.props.currentForecast;
        const forecastDays = this.props.forecast.forecast.forecastday;
        let day = moment(new Date(current.date)).format('dddd');
        if(moment(new Date()).format('MMM Do YY') === moment(new Date(current.date)).format('MMM Do YY')) {
            day = 'Today';
        }
        return (
            <div className="forecast">
                <header className="forecast-header">
                 <h2>{location.name}</h2>
                 <p className="forecast__day">
                    {day}
                 </p>
                <ul className="">
                    <li>{current.astro.sunrise}</li>
                    <li>{current.astro.sunset}</li>
                </ul>
                </header>
                <div className="">
                    <p className="">{current.day.temp_c}&deg;</p>
                </div>
                <div className="forecast-conditions">
                    <p className="">{current.day.condition.text}</p>
                </div>
                <DayMenu forecastDays={forecastDays} updateForecastDay={this.props.updateForecastDay} />
            </div>
        )
    }
}