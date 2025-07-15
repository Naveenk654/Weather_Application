import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.set("view engine", "ejs");  // Add this line to use EJS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/Home", (req, res) => {
    res.render("index.ejs");
});

app.post("/submit", async (req, res) => {
    const place = req.body.location;

    if (!place || place.trim() === "") {
        return res.status(400).send("Location is required.");
    }

    const url = `https://weather-api138.p.rapidapi.com/weather?city_name=${encodeURIComponent(place)}`;

    const options = {
        method: 'GET',
        url: url,
        timeout: 5000,
        headers: {
            'x-rapidapi-key': '82bad7c5admsh3d56e55775c4155p1ba613jsn9fe6ac2f2cad',
            'x-rapidapi-host': 'weather-api138.p.rapidapi.com'
        }
    };

     try {
        const response = await axios.request(options);
        const data = response.data;

        res.render("info.ejs", {
            temperature: {
                feels_like: data.main.feels_like,
                min: data.main.temp_min,
                max: data.main.temp_max,
                unit: "K"
            },
            humidity: {
                value: data.main.humidity,
                unit: "%"
            },
            pressure: {
                value: data.main.pressure,
                unit: "hPa"
            },
            wind: {
                speed: data.wind.speed,
                degree: data.wind.deg,
                unit: "m/s"
            },
            cloudcover: {
                percent: data.clouds.all,
                unit: "%"
            },
            sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
            sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
            Place: data.name,
            country: data.sys.country
        });
    } catch (error) {
        console.error("API error:", error.response?.data || error.message);
        res.status(500).send("Failed to fetch weather data.");
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});