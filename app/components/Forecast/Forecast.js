import React, {Component} from 'react';
import DayMenu from '../DayMenu/DayMenu';
import moment from 'moment';
import './forecast.scss';
import '../../svg/sunrise.svg';


export default class Forecast extends Component {
    render() {
        const { location } = this.props.forecast;
        const current = this.props.currentForecast;
        const forecastDays = this.props.forecast.forecast.forecastday;
        let day = moment(new Date(current.date)).format('dddd');
        const icon = this.props.getIcon(current.day.condition.code);
        if(moment(new Date()).format('MMM Do YY') === moment(new Date(current.date)).format('MMM Do YY')) {
            day = 'Today';
        }
        return (
            <div className="forecast">
                <header className="forecast__header">
                    <h2 className="forecast__location">{location.name}</h2>
                <div className="forecast__meta">
                    <span className="forecast__day">
                        {day}
                    </span>
                    <ul className="astro">
                        <li className="astro-item astro-item--sunrise">
                            <svg className="astro-item__icon">
                                <use xlinkHref="#sunrise"></use>
                            </svg>
                            {current.astro.sunrise}
                        </li>
                        <li className="astro-item astro-item--sunset">{current.astro.sunset}</li>
                    </ul>
                </div>
            </header>
                <div className="">
                    <svg className="controls-link__icon">
                        <use xlinkHref={`#${icon.name}`}></use>
                    </svg>
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