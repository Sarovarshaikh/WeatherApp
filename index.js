const http = require("http");
const fs = require("fs");
var requests = require("requests");
const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) =>{
let temrature = tempVal.replace("{%tempValue%}",orgVal.main.temp);
temrature = temrature.replace("{%tempMinValue%}",orgVal.main.temp_min);
temrature = temrature.replace("{%tempMaxValue%}",orgVal.main.temp_max);
temrature = temrature.replace("{%location%}",orgVal.name);
temrature = temrature.replace("{%country%}",orgVal.sys.country);
temrature = temrature.replace("{%tempStatus%}",orgVal.weather[0].main);
return temrature;
}

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests("https://api.openweathermap.org/data/2.5/weather?q=Pune&APPID=10cb7749a10db12bd428644b6efc559f")
      .on("data",  (chunk)=> {
        const objData=JSON.parse(chunk);
        const arrObj = [objData]
        // console.log(arrObj[0].main.temp);
        const realTimeData = arrObj
        .map((val) => replaceVal(homeFile, val))
        .join("");
      res.write(realTimeData);
      console.log(realTimeData);
     
      })
      .on("end", (err) =>{
        if (err) return console.log("connection closed due to errors", err);
        res.end();
        //  console.log("end");
      });
  }
});
server.listen(9000);
