import axios from 'axios';

const apiKey='e1d843c3a46a47e9a4d122250182901';
const googleMapsApiKey='AIzaSyCQWRTDIyaLGX11Fg5NAFy_mCxz25lC-s4';

const getCurrentWeather = (location) => {
    axios
    .get(`http://api.apixu.com/v1/current.json?key=${apiKey}&q=${location}`)
    .then((results) => {
        return results.data
    })
}

const getForecast = (location, duration=7) => {
    return new Promise((resolve, reject) => {
        const uri = `http://api.apixu.com/v1/forecast.json?key=${apiKey}&q=${location}&days=${duration}`;
        axios
        .get(encodeURI(uri))
        .then((results) => {
            resolve(results);
        })
        .catch((err) => reject(err.message))
    })
}

const searchLocation = (query) => {
    return new Promise((resolve, reject) => {
        const uri = `http://api.apixu.com/v1/search.json?key=${apiKey}&q=${query}`;
        axios
        .get(encodeURI(uri))
        .then((results) => {
            resolve(results);
        })
        .catch((err) => reject(err.message))
    });
}

const getHourlyForecast = (location, startHour = 12) => {
    return new Promise((resolve, reject) => {
        const calls=[];
        const numHours = 5;
        for(let i=0; i < numHours; i++) {
            const hour = i + 12;
            calls.push(getHourForecast(location, hour))
        }
        axios
        .all(calls)
        .then((data) => {
            console.log('all hours returned', data);
            resolve(data)
        })
        .catch((err) => reject(error.message))
    })
}

const getHourForecast = (location, time=12) => {
    return new Promise((resolve, reject) => {
        const uri = `http://api.apixu.com/v1/forecast.json?key=${apiKey}&q=${location}&hour=${time}`;
        console.log(uri);
        axios
        .get(encodeURI(uri))
        .then((results) => {
            resolve(results);
        })
        .catch((err) => reject(error.message))
    })
}

const getCurrentPosition = () => {
    return new Promise( ( resolve, reject ) => {
        navigator.geolocation.getCurrentPosition( ( position ) => {
            let latitude  = position.coords.latitude;
            let longitude = position.coords.longitude;
            resolve( { latitude, longitude } );
        }, () => { reject( 'We could not get your location.' ); } );
    });
};

const getCurrentLocation = ( { latitude, longitude } ) => {
    return new Promise((resolve, reject) => {
        axios
        .get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}`)
        .then((response) => {
            resolve(response);
        })
        .catch((err) => reject(err.message)) //google location failed 
    });
}

/*
const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        getCurrentPosition()
        .then(( { latitude, longitude }) => {
            axios
            .get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}`)
            .then((response) => {
                resolve(response);
            })
            .catch((err) => reject(err.message)) //google location failed 
        })
        .catch((err) => console.log(err)) //get location failed or blocked so just get defaults
    });
};
*/

export { getCurrentPosition, getCurrentLocation, getForecast, getHourlyForecast, searchLocation };


