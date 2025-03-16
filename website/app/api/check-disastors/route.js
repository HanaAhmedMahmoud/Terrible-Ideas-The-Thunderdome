import { promises as fs } from 'fs';
import path from 'path';
import https from 'https';

export async function GET(req) {
  try {
    // Extract query parameters correctly
    const { searchParams } = new URL(req.url, 'http://localhost:3000');
    const year = parseInt(searchParams.get('year'));
    const month = parseInt(searchParams.get('month'));
    const day = parseInt(searchParams.get('day'));
    const latitude = parseFloat(searchParams.get('latitude'));
    const longitude = parseFloat(searchParams.get('longitude'));

    // Validate input parameters
    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(latitude) || isNaN(longitude)) {
      return new Response(JSON.stringify({ error: 'Invalid query parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Call the disaster check function
    const result = await checkNaturalDisaster(year, month, day, latitude, longitude);

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Function to check for natural disasters
async function checkNaturalDisaster(year, month, day, latitude, longitude) {
  const hasTsunami = await checkTsunami(year, month, day);
  const hasEarthquake = await checkEarthquake(year, month, day);
  const hasVolcano = await checkVolcano(year, month, day);
  const weather = await getWeatherConditions(year, month, day, latitude, longitude);

  return {
    tsunami: hasTsunami.toString(),
    earthquake: (day == 8 && month == 2 && year == 2007).toString(),
    volcano: hasVolcano.toString(),
    noDisaster: (!(hasTsunami || hasVolcano || hasEarthquake)).toString(),
    windSpeed: weather.wind.toString(),
    temperature: weather.temperature.toString(),
    cloudCover: weather.clouds.toString(),
    rain: weather.rain.toString(),
    sharknado: year === 2013 && month === 7 && day === 11 ? 'true' : 'false',
  };
}

// Function to get past weather data
async function getWeatherConditions(year, month, day, latitude, longitude) {
  const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${formattedDate}&end_date=${formattedDate}&hourly=temperature_2m,wind_speed_10m,rain,cloud_cover`;

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const returnedData = JSON.parse(data);
          resolve({
            temperature: returnedData.hourly.temperature_2m[10],
            wind: returnedData.hourly.wind_speed_10m[10],
            clouds: returnedData.hourly.cloud_cover[10],
            rain: returnedData.hourly.rain[10], 
          });
        } catch (error) {
          reject({ error: `Parsing error: ${error.message}` });
        }
      });
    }).on('error', (err) => {
      reject({ error: `Request error: ${err.message}` });
    });
  });
}

// Functions to check for disasters
async function checkEarthquake(year, month, day) {
  return checkCSVForDisaster('../public/csvs/earthquake.csv', year, month, day);
}

async function checkTsunami(year, month, day) {
  return checkCSVForDisaster('../public/csvs/tsunami.csv', year, month, day);
}

async function checkVolcano(year, month, day) {
  return checkCSVForDisaster('../public/csvs/volcano.csv', year, month, day);
}

// General function to check CSV files
async function checkCSVForDisaster(fileName, year, month, day) {
  try {
    const filePath = path.join(process.cwd(), 'public', fileName);
    const data = await fs.readFile(filePath, 'utf8');
    const lines = data.split('\n');

    for (const line of lines) {
      const cols = line.split(',');
      if (cols.includes(year.toString()) && cols.includes(month.toString()) && cols.includes(day.toString())) {
        return true;
      }
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
}
