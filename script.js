let lat;
let lon;


let locationName=document.getElementById('locationName')
let setIcon = document.getElementById("icon");
let desc = document.getElementById("description");
let temperature = document.getElementById("temp");
let minTemp = document.getElementById("minTemp");
let maxTemp = document.getElementById("maxTemp");
let windSpeed = document.getElementById("windSpeed");



//used to give the current latitude and longitude
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(async (position) => {
    lat = position.coords.latitude;
    lon = position.coords.longitude;

    // console.log(lat,lon);
    console.log(position);

    //higher order function
    let data = await getWeatherData(lat, lon);

    //for placing map
    var map = L.map("map").setView([lat, lon], 6);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);


    var marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup(`<b>${data.name}</b>`).openPopup();

    // function onMapClick(e) {
    //   popup
    //     .setLatLng(e.latlng)
    //     .setContent("You clicked the map at " + e.latlng.toString())
    //     .openOn(map);
    // }

    map.on("click", async function(e){
        const data=await getWeatherData(e.latlng.lat,e.latlng.lng)
        marker.setLatLng([e.latlng.lat,e.latlng.lng]);
        marker.bindPopup(`<b>${data.name}</b>`).openPopup(); //for popup
    });

    return data;
  });
}

  async function getWeatherData(lat, lon) {

    //get this link and key from openweathermap
    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=887c2b8ec41f4dd137b3204328e18f6b`;

    let response = await fetch(api);
    let data = await response.json();
    console.log(data);

    dataHandler(data)
    return data
  }
  // getWeatherData()



function dataHandler(data){
    const {temp,temp_min,temp_max}=data.main //data->value that holds and main->parent key . we can see it in console

    const {description}=data.weather[0]
    // const {name}=data.name

    const {speed}=data.wind;
    const {icon}=data.weather[0]


    //visible in our application
    locationName.innerHTML=data.name
    desc.innerHTML=description
    temperature.innerHTML=temp
    minTemp.innerHTML="Min-Temp: "+temp_min
    maxTemp.innerHTML = "Max-Temp: " + temp_max;
    windSpeed.innerHTML=speed
    setIcon.style["background"] = `url(${setIconFunction(icon)})`;
    
}



//for displaying icons
function setIconFunction(icon) {
  const icons = {
    "01d": "./animated/day.svg",
    "02d": "./animated/cloudy-day-1.svg",
    "03d": "./animated/cloudy-day-2.svg",
    "04d": "./animated/cloudy-day-3.svg",
    "09d": "./animated/rainy-1.svg",
    "10d": "./animated/rainy-2.svg",
    "11d": "./animated/rainy-3.svg",
    "13d": "./animated/snowy-6.svg",
    "50d": "./animated/mist.svg",
    "01n": "./animated/night.svg",
    "02n": "./animated/cloudy-night-1.svg",
    "03n": "./animated/cloudy-night-2.svg",
    "04n": "./animated/cloudy-night-3.svg",
    "09n": "./animated/rainy-1.svg",
    "10n": "./animated/rainy-2.svg",
    "11n": "./animated/rainy-3.svg",
    "13n": "./animated/snowy-6.svg",
    "50n": "./animated/mist.svg",
  };

  return icons[icon];
}