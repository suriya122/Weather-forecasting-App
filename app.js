const express=require("express");
const bodyparser=require("body-parser");
const https=require("https");
const { title } = require("process");
const env=require('dotenv').config();
const app=express();

 app.use(bodyparser.urlencoded({extended:true}));
 app.set("view engine","ejs");
 app.use(express.static(__dirname+"/public"));
var oldapod;
 var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
 var date=new Date();
 var month = date.toLocaleString('default', { month: 'short' });
 
 var dat=date.getDate();
 var day=days[date.getDay()];
 var nday=date.getDay();


var desc="check the city";


var city="India";
var humi=74;
 var wins=2.2;
 var temp=25;
 var cli="sunny";
 var nasaurl;
 var nasahurl;
 var nasadesc;
 var nasatitle;
 var dat;
 var imgurl="images/icons/icon-1.svg";
 app.get("/",function(req,res){
   var nkey=process.env.NASAKEY;
   

   var nasa="https://api.nasa.gov/planetary/apod?api_key="+nkey;
   var onasa="https://api.nasa.gov/planetary/apod?api_key="+nkey+"&count=6";
  
https.get(nasa,function(response){
  console.log(response.statusCode);
  response.on("data",function(data){
    
    
    var ndata=JSON.parse(data);
    
   dat=ndata.date;
    nasahurl=ndata.hdurl;
    nasaurl=ndata.url;
    nasatitle=ndata.title;
    nasadesc=ndata.explanation;
   


  });
 
});
https.get(onasa,function(respons){

  console.log(respons.statusCode);
  respons.on("data",function(data){
    
    
    var odata=JSON.parse(data);
    oldapod=odata;
    
    res.render("home",{date:dat,oarr:oldapod,apodurl:nasaurl,apoddesc:nasadesc,apodhurl:nasahurl,apodtitle:nasatitle,des:desc,dayss:days,nd:nday,m:month,da:dat,d:day,imgs:imgurl,windspeed:wins,place:city,hum:humi,temp:temp,climate:cli});

    
   

  });

});

});
app.get("/know-more-apod",function(req,res){
  
  
  
  res.render("knowapod",{oarry:oldapod});
})








app.post("/",function(req,res){
 
  const query=req.body.place;
  const akey=process.env.KEY;
  // console.log(query);
  var url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+akey+"&units=metric"
  https.get(url,function(response){
    // console.log(response.statusCode);
    response.on("data",function(data){
      var weatherdata=JSON.parse(data);
      // console.log(weatherdata);
      if(weatherdata.cod==200){
      const icon=weatherdata.weather[0].icon;
      imgurl="http://openweathermap.org/img/wn/"+icon+"@2x.png";
        wins=weatherdata.wind.speed;
        temp=Math.round(weatherdata.main.temp);
        humi=weatherdata.main.humidity;
        cli=weatherdata.weather[0].main;
        city=query;
        desc=weatherdata.weather[0].description;

       res.redirect("/");
      }else{
        imgurl="images/icons/icon-1.svg";
        cli=weatherdata.message;
        desc="Check the City Spelling";
        city=query;
        wins=0;
        temp=0;
        humi=0;
        
        res.redirect("/");
        
      }
       
      
    });
    


  });
  

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port,function(req,res){
  console.log("server started sucessfully green-weather");
});
