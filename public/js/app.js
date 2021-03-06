/**
 * WEATHER CONTROLLER
 */
const WeatherController = (() => {

    //return public function
    return {

        // Get forecasr with Address
        getForecastAddress: async (address) => {

            const response = await fetch(`/weather/address/?address=${address}`)
            const data = await response.json()
            return data
        },

        // Get forecast with Coordinate
        getForecastCoordinate: async (coord) => {

            const response = await fetch(`/weather/coord/?lat=${coord.latitude}&lon=${coord.longitude}`)
            const data = await response.json()
            return data
        }
    };
})();

/**
 * UI CONTROLLER
 */

const UIController = (function () {
    const DOMstrings = {
        form: "form",
        input: "input",
        message: "message",
        current: "current",
        content: ".content",
        titleCurrent: "titleCurrent",
        listDaily: "list-daily",
        findLocation: '#find-location'
    };
    // Change alias

    const change_alias = function (alias) {
        var str = alias
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(
            /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
            " "
        );
        str = str.replace(/ + /g, " ");
        str = str.trim()
        return str
    }

    // Format date
    const formatDate = function (timestamp) {
        const months = [
            "JAN",
            "FEB",
            "MAR",
            "APR",
            "MAY",
            "JUN",
            "JUL",
            "AUG",
            "SEP",
            "OCT",
            "NOV",
            "DEC",
        ];
        let current_datetime = new Date(timestamp * 1000);
        let formatted_date =
            current_datetime.getFullYear() +
            "-" +
            months[current_datetime.getMonth()] +
            "-" +
            current_datetime.getDate() +
            " " +
            current_datetime.getHours() +
            ":" +
            current_datetime.getMinutes() +
            ":" +
            current_datetime.getSeconds()

        return formatted_date
    }

    // Return public function
    return {
        // Get DOM strings
        getDOMstrings: function () {
            return DOMstrings;
        },

        // Get input

        getAddress: function () {
            this.showMessage("loading...", "loading");
            let value = document.querySelector(DOMstrings.input).value;
            value = value.trim();

            if (value === "") {
                document.getElementById(DOMstrings.message).textContent =
                    "Invalid location!";
            }

            value = change_alias(value);
            return value;
        },

        // Add current forecast
        addCurrentForecast: function (location = "", currentData = {}) {
            let html,
                newHtml,
                info,
                icon,
                description,
                detail,
                weather,
                time,
                sunrise,
                sunset,
                temp;

            time = formatDate(currentData.dt);
            sunrise = formatDate(currentData.sunrise);
            sunset = formatDate(currentData.sunset);

            weather = currentData.weather[0];
            info = `${location}\n${time}`;
            icon = weather.icon;
            temp = `${currentData.temp}°C\n\n`;
            description = `${weather.description}\n\n`;
            detail = `Sunrise:\t${sunrise}\nSunset:\t\t${sunset}\nFeel like:\t${currentData.feels_like} °C\nHumidity:\t${currentData.humidity}%\nUV index:\t${currentData.uvi}\nVisibility:\t${currentData.visibility} m\nWind speed:\t${currentData.wind_speed} m/s\n`;

            html =
                '<div class="list"><div class="left"><pre class="info">%info%</pre><img src="https://openweathermap.org/img/wn/%icon%@2x.png" alt="" class="current-img"><pre class="temp">%temp%</pre><pre class="description">%description%</pre></div><div class="right"><pre class="detail">%detail%</pre></div><div style="clear:both"></div></div>';

            newHtml = html.replace("%info%", info);
            newHtml = newHtml.replace("%icon%", icon);
            newHtml = newHtml.replace("%description%", description);
            newHtml = newHtml.replace("%detail%", detail);
            newHtml = newHtml.replace("%temp%", temp);

            document.getElementById(DOMstrings.current).innerHTML = "";

            document
                .getElementById(DOMstrings.current)
                .insertAdjacentHTML("beforeend", newHtml);

            this.showMessage("", "loading");
        },

        // Add daily forecast
        addDailyForecast: function (location = "", dailyData = {}) {
            let html,
                newHtml,
                size,
                info,
                dateTime,
                icon,
                description,
                temp,
                minMax,
                detailTemp,
                detail,
                sunrise,
                sunset;

            size = dailyData.length;

            html =
                '<div id = "%id%" class="daily"><div class="left"><pre class="info">%info%</pre><img src="https://openweathermap.org/img/wn/%icon%@2x.png" alt="" class="current-img"><pre class="temp">%temp%</pre><pre class="min-max">%minMax%</pre><pre class="description">%description%</pre><pre class="detail-temp">%detailTemp%</pre></div><div class="right"><pre class="detail">%detail%</pre></div><div style="clear:both"></div></div>';

            document.getElementById(DOMstrings.listDaily).innerHTML = "";

            for (let i = 0; i < size; i++) {
                dateTime = formatDate(dailyData[i].dt);

                info = `${location}\n${dateTime}`;

                icon = `${dailyData[i].weather[0].icon}`;

                temp = `${dailyData[i].temp.day}°C`;

                minMax = `min: ${dailyData[i].temp.min}\tmax: ${dailyData[i].temp.max}`;

                description = `${dailyData[i].weather[0].description}\n`;

                detailTemp = `<strong>Detail Temp (°C)\n</strong>Morn:${dailyData[i].temp.morn}\tFeel like: ${dailyData[i].feels_like.morn}\nEve: ${dailyData[i].temp.eve} \tFeel like: ${dailyData[i].feels_like.eve}\nNight: ${dailyData[i].temp.night}\tFeel like: ${dailyData[i].feels_like.night}\n`;

                sunrise = formatDate(dailyData[i].sunrise);

                sunset = formatDate(dailyData[i].sunset);

                detail = `Sunrise:\t${sunrise}\nSunset:\t\t${sunset}\nHumidity:\t${dailyData[i].humidity} %\nWind speed:\t${dailyData[i].wind_speed} m/s\nCloud:\t\t${dailyData[i].clouds} %\nUV Index:\t${dailyData[i].uvi}\n`;

                if (dailyData[i].rain) {
                    detail += `<strong><em>Rain:\t\t${dailyData[i].rain} mm\n</em></strong>`;
                }

                if (dailyData[i].snow) {
                    detail += `<strong><em>Snow:\t\t${dailyData[i].snow} mm</em></strong>`;
                }

                newHtml = html.replace("%id%", i);
                newHtml = newHtml.replace("%info%", info);
                newHtml = newHtml.replace("%icon%", icon);
                newHtml = newHtml.replace("%temp%", temp);
                newHtml = newHtml.replace("%description%", description);
                newHtml = newHtml.replace("%minMax%", minMax);
                newHtml = newHtml.replace("%detailTemp%", detailTemp);
                newHtml = newHtml.replace("%detail%", detail);

                document
                    .getElementById(DOMstrings.listDaily)
                    .insertAdjacentHTML("beforeend", newHtml);
            }
        },

        // Show message
        showMessage: function (message, type) {
            let el = document.getElementById(DOMstrings.message)

            el.className = type
            el.textContent = message;
        },
    };
})();

/**
 * APP CONTROLLER
 */

const controller = (function (UICtrl, WeatherCtrl) {

    // Setup Event
    const setupEventListeners = () => {

        const DOM = UICtrl.getDOMstrings()

        document.querySelector(DOM.form).addEventListener("submit", showForecastAddress)
        document.querySelector(DOM.findLocation).addEventListener('click', showForecastLocation)
    };

    // Show weather forecast in user location
    const showForecastLocation = async () => {

        if (!navigator.geolocation) {
            return
        }

        navigator.geolocation.getCurrentPosition(async (position) => {

            const weatherData = await WeatherCtrl.getForecastCoordinate(position.coords)
            
            if (weatherData.error) {
                return UIController.showMessage(weatherData.error,'error')
            }

            // Add current weather
            UICtrl.addCurrentForecast(weatherData.location, weatherData.current)

            // Add daily forecast
            UICtrl.addDailyForecast(weatherData.location, weatherData.daily)

        })
    }

    // Forecast for address
    const showForecastAddress = async (e) => {
        e.preventDefault()

        let address, weatherData

        // Get location
        address = UICtrl.getAddress()

        // Get data
        weatherData = await WeatherCtrl.getForecastAddress(address)
        console.log(weatherData);

        if (weatherData.error) {
            return UIController.showMessage(weatherData.error,'error')
        }

        // Add current weather
        UICtrl.addCurrentForecast(weatherData.location, weatherData.current)

        // Add daily forecast
        UICtrl.addDailyForecast(weatherData.location, weatherData.daily)
    }

    // Return
    return {
        init: () => {
            console.log("Application has started.")
            setupEventListeners()
        },
    }

})(UIController, WeatherController)


controller.init()
