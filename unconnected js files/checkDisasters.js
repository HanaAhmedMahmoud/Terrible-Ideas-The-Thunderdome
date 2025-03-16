
import { promises as fs } from 'node:fs';
import https from 'https'

const year = 1980
const month = 7
const day = 11
const latitude = 1
const longitude = 1


async function checkNaturalDisaster(year, month, day, latitude, longitude) {
  const hasTsunami = await checkTsunami(year, month, day)
  const hasEarthquake = await checkEarthquake(year, month, day)
  const hasVolcano = await checkVolcano(year, month, day)
  const otherWeather = await getWeatherConditions(year, month, day, latitude, longitude)
  return {
    "tsunami": hasTsunami.toString(),
    "earthquake": hasEarthquake.toString(),
    "volcano": hasVolcano.toString(),
    "noDisastor": (!(hasTsunami || hasVolcano || hasEarthquake)).toString(),
    "windSpeed": otherWeather.wind.toString(),
    "temperature": otherWeather.temperature.toString(),
    "cloudCover": otherWeather.clouds.toString(),
    "sharknado": year == 2013 && month == 7 && day == 11 ? "true": "false"
  }

  }

async function getWeatherConditions(year, month, day, latitude, longitude) {
  const formattedDate = `${year.toString().padStart(2, "0")}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

  const options = {
    hostname: 'archive-api.open-meteo.com',
    port: 443,
    path: `/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${formattedDate}&end_date=${formattedDate}&hourly=temperature_2m,wind_speed_10m,rain,cloud_cover`,
    method: 'GET',
    family: 4 // Force IPv4
  };

  return new Promise((resolve, reject) => {
    https.get(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const returnedData = JSON.parse(data);
          const temp = returnedData.hourly.temperature_2m[10];
          const wind = returnedData.hourly.wind_speed_10m[10];
          const rain = returnedData.hourly.rain[10];
          const cloud_cover = returnedData.hourly.cloud_cover[10];

          const data_object = {
            temperature: temp,
            wind: wind,
            rain: rain,
            clouds: cloud_cover,
          };

          resolve(data_object);
        } catch (error) {
          reject(`Parsing error: ${error.message}`);
        }
      });
    }).on('error', (err) => {
      reject(`Request error: ${err.message}`);
    });
  });
}



  

async function checkEarthquake(year, month, day) {
  try {
    const data = await fs.readFile('./earthquake.csv', 'utf8');
    const earthquakes = data.split('\n');

    for (const element of earthquakes) {
        const current_earthquake_split = element.split(',');
        const quake_date = current_earthquake_split[current_earthquake_split.length - 1];

        if (quake_date.substring(0, 4).trim() == year.toString()) {
            if (quake_date.substring(5, 7) == month.toString().padStart(2, '0')) {
                if (quake_date.substring(8, 10) == day.toString().padStart(2, '0')) {
                    console.log('Date is the same as an earthquake');
                    return true;
                }
            }
        }
    }

    return false;
} catch (err) {
    console.error(err);
    return false;
}
}


async function checkTsunami(year, month, day) {
  try {
      const data = await fs.readFile('./tsunami.csv', 'utf8');
      const tsunamis = data.split('\n');

      for (const element of tsunamis) {
          const current_tsunami_split = element.split(',');
          if (current_tsunami_split[1] == year.toString()) {
              if (current_tsunami_split[2] == month.toString()) {
                  if (current_tsunami_split[3] == day.toString()) {
                      console.log('Date is the same as a tsunami');
                      console.log(current_tsunami_split);
                      return true;
                  }
              }
          }
      }

      return false;
  } catch (err) {
      console.error(err);
      return false;
  }
}

async function checkVolcano(year, month, day) {
  try {
      const data = await fs.readFile('./volcano.csv', 'utf8');
      const volcanos = data.split('\n');

      for (const element of volcanos) {
          const current_volcano_split = element.split(',');
          if (current_volcano_split[0] == year.toString()) {
              if (current_volcano_split[1] == month.toString()) {
                  if (current_volcano_split[2] == day.toString()) {
                      console.log('Date is the same as a volcano');
                      console.log(current_volcano_split);
                      return true;
                  }
              }
          }
      }

      return false;
  } catch (err) {
      console.error(err);
      return false;
  }
}

console.log(await checkNaturalDisaster(year, month, day, latitude, longitude))
