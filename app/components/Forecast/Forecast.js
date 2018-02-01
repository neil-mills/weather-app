import React, {Component} from 'react';
import DayMenu from '../DayMenu/DayMenu';


export default class Forecast extends Component {
    render() {
        const { location, current } = this.props.forecast;
        const forecastDay = this.props.forecast.forecast.forecastday;
        return (
            <div className="forecast">
                <header className="forecast-header">
                 <h2>{location.name}</h2>
                <ul className="">
                    <li>{forecastDay[0].astro.sunrise}</li>
                    <li>{forecastDay[0].astro.sunset}</li>
                </ul>
                </header>
                <div className="">
                    <p className="">{current.temp_c}&deg;</p>
                </div>
                <div className="forecast-conditions">
                    <p className="">{current.condition.text}</p>
                </div>
                <DayMenu forecastDays={forecastDay} />
            </div>
        )
    }
}