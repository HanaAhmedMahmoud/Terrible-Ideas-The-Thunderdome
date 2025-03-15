import fs from 'node:fs';
const year = 1963
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
    "cloudCover": "temp"
  }

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

console.log(checkNaturalDisaster(year, month, day))