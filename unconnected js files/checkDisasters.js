import fs from 'node:fs';
import https from 'https'

const year = 1964
const month = 5
const day = 21


function checkNaturalDisaster(year, month, day) {
  const hasTsunami = checkTsunami(year, month, day)
  const hasEarthquake = checkEarthquake(year, month, day)
  const hasVolcano = checkVolcano(year, month, day)
  return {
    "tsunami": hasTsunami,
    "earthquake": hasEarthquake,
    "volcano": hasVolcano,
    "noDisastor": !(hasTsunami || hasVolcano || hasEarthquake),
    "windSpeed": "temp",
    "temperature": "temp",
    "cloudCover": "temp",
    "sharknado": year == 2013 && month == 7 && day == 11 ? "true": "false"
  }

  }



  async function getWeatherConditions(year, month, day, longitude, latitude) {
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
              clouds: cloud_cover
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





  

function checkEarthquake(year, month, day) {
    fs.readFile('./earthquake.csv', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        
        const earthquakes = data.split('\n');
        let current_earthquake_split = ""
        let quake_date = ""
        //time,place,status,tsunami,significance,data_type,magnitudo,state,longitude,latitude,depth,date
        for (const element of earthquakes) {
          current_earthquake_split = element.split(",")
          quake_date = current_earthquake_split[current_earthquake_split.length-1]
          // console.log(quake_date.substring(0,4))
          if (quake_date.substring(0,4).trim() == year.toString()) {
              if (quake_date.substring(5,7) == month.toString().padStart(2, "0")) {
                  if (quake_date.substring(8,10) == day.toString().padStart(2, "0")) {
                      console.log("Date is the same as an earthquake")
                      console.log(current_earthquake_split)
                      return true
                  }
              }
          } 
        }

      });
      return false
}

function checkTsunami(year, month, day) {
    fs.readFile('./tsunami.csv', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        // ID,YEAR,MONTH,DAY,HOUR,MINUTE,LATITUDE,LONGITUDE,LOCATION_NAME,COUNTRY,REGION,CAUSE,EVENT_VALIDITY,EQ_MAGNITUDE,EQ_DEPTH,TS_INTENSITY,DAMAGE_TOTAL_DESCRIPTION,HOUSES_TOTAL_DESCRIPTION,DEATHS_TOTAL_DESCRIPTION,URL,COMMENTS
        
        const tsunamis = data.split('\n');
        let current_tsunami_split = ""
        for (const element of tsunamis) {
          current_tsunami_split = element.split(",")
          if (current_tsunami_split[1] == year.toString()) {
              if (current_tsunami_split[2] == month.toString()) {
                  if (current_tsunami_split[3] == day.toString()) {
                      console.log("Date is the same as a tsunami")
                      console.log(current_tsunami_split)
                      return true
                  }
              }
          } 
        }

      });
      return false
}

function checkVolcano(year, month, day) {
  fs.readFile('./volcano.csv', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      // Year,Month,Day,Name,Location,Country,Latitude,Longitude,Elevation (m),Type,VEI,Agent,Deaths,Death Description,Missing,Missing Description,Injuries,Injuries Description,Damage ($Mil),Damage Description,Houses Destroyed,Houses Destroyed Description,Total Deaths,Total Death Description,Total Missing,Total Missing Description,Total Injuries,Total Injuries Description,Total Damage ($Mil),Total Damage Description,Total Houses Destroyed,Total Houses Destroyed Description
      
      const volcanos = data.split('\n');
      let current_volcano_split = ""
      for (const element of volcanos) {
        current_volcano_split = element.split(",")
        if (current_volcano_split[0] == year.toString()) {
            if (current_volcano_split[1] == month.toString()) {
                if (current_volcano_split[2] == day.toString()) {
                    console.log("Date is the same as a volcano")
                    console.log(current_volcano_split)
                    return true
                }
            }
        } 
      }

    });
    return false
}

// console.log(checkNaturalDisaster(year, month, day))

console.log(await getWeatherConditions(year, month, day, 1, 1))