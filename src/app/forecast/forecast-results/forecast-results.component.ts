import { Component, OnInit, Input } from '@angular/core';
import { SearchService } from '../search.service';
import { Chart } from 'chart.js';
import { FavoriteService } from '../favorite.service';
import axios from 'axios';
import { NgForm, MaxLengthValidator } from '@angular/forms';
import * as CanvasJS from '../assets/canvasjs.min';
import { DatePipe } from '@angular/common';
import {MatTooltipModule} from '@angular/material/tooltip';


@Component({
  selector: 'app-forecast-results',
  templateUrl: './forecast-results.component.html',
  styleUrls:['./forecast-results.component.css']
})
export class ForecastResultsComponent implements OnInit{
 
  @Input('matTooltipPosition')
  position: 'above';
  datePipe = new DatePipe('en-US');
  active: any;
  tData = [];
  pData = [];
  hData = [];
  
  oData = [];
  vData = [];
  wData = [];
  xData = [];
  yData = [];
  weeklyData = [];
  timeData = [];
  show = "t";
  
  isFavorite: any;
  forecastJSON = null;
  showResults: any;
  favs: any;
  loading: any;
  display='none';
  currentDate = '';
  latlon: any;
  dayData_details: any;
  showModal = false;
  // ----daily weather card variables-----
  time = '';
  wind = 0;
  time_to_display = '';
  temperature= 0;
  current_temperature = 0;
  summary = '';
  precipitation = 0;
  chanceOfRain = 0;
  humidity = 0;
  visibility = 0;
  weather_icon = '';
  static maxOzone = 0;
  icon_hashmap = {
    'clear-day': 'https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png',
    'clear-night': 'https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png',
    'rain': 'https://cdn3.iconfinder.com/data/icons/weather-344/142/rain-512.png',
    'snow': 'https://cdn3.iconfinder.com/data/icons/weather-344/142/snow-512.png',
    'sleet': 'https://cdn3.iconfinder.com/data/icons/weather-344/142/lightning-512.png',
    'wind':'https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png',
    'fog': 'https://cdn3.iconfinder.com/data/icons/weather-344/142/cloudy-512.png',
    'cloudy': 'https://cdn3.iconfinder.com/data/icons/weather-344/142/cloud-512.png',
    'partly-cloudy-day': 'https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png',
    'partly-cloudy-night': 'https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png'
  };
  async getDayData(time){
    try{
     
     var vars = this.latlon[0]+','+this.latlon[1]+','+time;
     const dayData_response = await axios.get('/api/forecast/45aa47c3d7fb9ce5fe6cbe0bc841aab0/' + vars);
     this.dayData_details = dayData_response.data;
     this.time_to_display = this.datePipe.transform(this.dayData_details['daily']['data'][0]['time']*1000,'dd/MM/yyyy');
    this.temperature = Math.round(this.dayData_details['currently']['temperature']);
    this.summary  = this.dayData_details['currently']['summary'];
    this.weather_icon = this.icon_hashmap[this.dayData_details['currently']['icon']];
    this.precipitation = Math.round((this.dayData_details['currently']['precipIntensity']*100))/100;
    this.chanceOfRain = Math.round(this.dayData_details['currently']['precipProbability'] * 100)/ 100;
    this.wind =  Math.round(this.dayData_details['currently']['windSpeed'] * 100)/100;
    this.humidity = Math.round(this.dayData_details['currently']['humidity'] *100);
    this.visibility =  Math.round(this.dayData_details['currently']['visibility'] * 100) / 100;
    }
    catch(error){
     console.log(error);
    }
   }
  constructor(public searchService: SearchService, public favoriteService: FavoriteService,) {
    
    this.show = 't';
    this.forecastJSON = this.searchService.getForecastUpdateListener();
    this.forecastJSON.subscribe(data => {
      this.showResults = true;
      
      this.isFavorite = this.favoriteService.checkFavorite(this.cityName);
      if (data != 'clear' && data != undefined ){
        
        this.current_temperature = Math.round(data['currently']['temperature']);
        for(let i=0; i< data['hourly']['data'].length ; i++){
          this.tData.push(data['hourly']['data'][i]['temperature']);
          this.pData.push(Math.round(data['hourly']['data'][i]['pressure']*100)/100);
          this.hData.push(Math.round(data['hourly']['data'][i]['humidity'] * 100));
          this.oData.push(Math.round(data['hourly']['data'][i]['ozone'] * 100)/100);
          this.vData.push(Math.round(data['hourly']['data'][i]['visibility'] * 100)/100);
          this.wData.push(Math.round(data['hourly']['data'][i]['windSpeed'] * 100)/100);
          if(i == 24){
            break;
          }
        }
      ForecastResultsComponent.maxOzone = Math.max(...this.oData);
      this.yData = [];
      console.log("Ozone Data 1 : "+this.oData[0]);
      for(let j=0 ; j< data['daily']['data'].length; j++){
        this.weeklyData = [];
        this.weeklyData.push(Math.round(data['daily']['data'][j]['temperatureLow']));
        this.weeklyData.push(Math.round(data['daily']['data'][j]['temperatureHigh']));
        this.yData.push(this.weeklyData);
        this.timeData.push(data['daily']['data'][j]['time']);
      }
    }
    if(data == 'clear'){
      this.showResults = true;
      this.active = 't1';
    }
    });
    this.currentDate = this.datePipe.transform((this.timeData[0])*1000, 'dd/MM/yyyy'); 
    console.log("date"+this.currentDate);

   
    
}
  
  forecast_results: any;
  cityName: any;
  stateName: any;
  stateSeal: any;
  invalidAdd: any;
  dailyData: any;
  favorites= [];
  isCurr: any;
  streetName: any;

  //------------favorite code -----------------
  setFavorite(cityName){

    console.log("hi from setfav"+this.favorites);
    if(localStorage.getItem(cityName)){
      this.favoriteService.delFavorite(cityName);
      this.isFavorite  =  false;
    }
    else{
      // console.log(this.stateName);
      // console.log(this.streetName);
      // console.log(this.stateSeal);
      this.isFavorite = true;
      this.favoriteService.saveFavorite(this.stateSeal,cityName,this.stateName,this.streetName);
    }
    
  }
  delFavorite(city){
    this.favoriteService.delFavorite(city);
  }
  
  //==================================for toggleactive==================================
  activate(elem){
    //deactivate all first
    this.active= '';
    this.active= elem;
    document.getElementById('chartContainer').innerHTML = "";
  }
  //-----------------------methods for showing charts ------------------
  showChart(el){
    this.show = el;
  }
  

  //--------------------------charts code-----------------------------
  
  //----------------temperature data ---------------------------------
  public temperatureOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales:{
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Fahrenheit'
        },
        ticks: {
          suggestedMax: Math.max(...this.tData)+2
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString:  'Time Difference from current hour'
        }
      }],
      
    },
    legend:{
      onClick: function(event,temperatureLegend) {}
    }
  };
  public temperatureLabels = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
  public temperatureChartType = 'bar';
  public temperatureLegend = true;
  public temperatureData = [
    { data: this.tData , label: 'Temperature', backgroundColor: 'rgb(151, 206, 239)', hoverBackgroundColor: 'rgb(99, 138, 157)',borderColor: 'rgb(99, 138, 157)', hoverBorderColor: 'rgb(99, 138, 157)'}
  ];
  //---------------------------------------------------------------
  //------------------------pressure data -------------------------
  public pressureOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales:{
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Millibars'
        },
        ticks: {
          suggestedMax: Math.max(...this.pData)+0.5
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString:  'Time Difference from current hour'
        }
      }],
      
    },
    legend:{
      onClick: function(event,pressureLegend) {}
    }
  };

  public pressureLabels = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
  public pressureChartType = 'bar';
  public pressureLegend = true;
  public pressureData = [
    { data: this.pData , label: 'pressure', backgroundColor: 'rgb(151, 206, 239)', hoverBackgroundColor: 'rgb(99, 138, 157)',borderColor: 'rgb(99, 138, 157)', hoverBorderColor: 'rgb(99, 138, 157)'}
  ];
  //--------------------------------------------------------------
  //------------------------Humidity data ------------------------
  public humidityOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales:{
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: '%Humidity'
        },
      ticks: {
        suggestedMax: Math.max(...this.hData)+5
      }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString:  'Time Difference from current hour'
        }
      }]
    },
    legend:{
      onClick: function(event,humidityLegend) {}
    }
  };
  public humidityLabels = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
  public humidityChartType = 'bar';
  public humidityLegend = true;
  public humidityData = [
    { data: this.hData , label: 'humidity', backgroundColor: 'rgb(151, 206, 239)', hoverBackgroundColor: 'rgb(99, 138, 157)',borderColor: 'rgb(99, 138, 157)', hoverBorderColor: 'rgb(99, 138, 157)'}
  ];
  //-----------------------------------------------------------
  //-------------Ozone Data ------------------------------------
  
  public ozoneOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales:{
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Dobson Units'
        },
        ticks:{
          suggestedMax: Math.max(...this.oData)
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString:  'Time Difference from current hour'
        }
      }]
    },
    legend:{
      onClick: function(event,ozoneLegend) {}
    }
    
  };
  
  public ozoneLabels = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
  public ozoneChartType = 'bar';
  public ozoneLegend = true;
  public ozoneData = [
    { data: this.oData , label: 'ozone', backgroundColor: 'rgb(151, 206, 239)', hoverBackgroundColor: 'rgb(99, 138, 157)',borderColor: 'rgb(99, 138, 157)', hoverBorderColor: 'rgb(99, 138, 157)'}
  ];
  //-------------------------------------------
  //--------------visibility data---------------
  public visibilityOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales:{
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Miles(Maximum 10)'
        },
        ticks: {
          suggestedMax: Math.max(...this.vData) + 1
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString:  'Time Difference from current hour'
        }
      }],
      
    },
    legend:{
      onClick: function(event,visibilityLegend) {}
    },
    
  };
  public visibilityLabels = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
  public visibilityChartType = 'bar';
  public visibilityLegend = true;
  public visibilityData = [
    { data: this.vData , label: 'visibility', backgroundColor: 'rgb(151, 206, 239)', hoverBackgroundColor: 'rgb(99, 138, 157)',borderColor: 'rgb(99, 138, 157)', hoverBorderColor: 'rgb(99, 138, 157)'}
  ];
  //-----------------------------------------
  //-------------Windspeed data--------------
  public windOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales:{
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Miles per Hour'
        },
      ticks: {
          suggestedMax: Math.max(...this.wData) + 1
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString:  'Time Difference from current hour'
        }
      }]
    },
    legend:{
      onClick: function(event,windLegend) {}
    }
  };
  public windLabels = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
  public windChartType = 'bar';
  public windLegend = true;
  public windData = [
    { data: this.wData , label: 'windSpeed', backgroundColor: 'rgb(151, 206, 239)', hoverBackgroundColor: 'rgb(99, 138, 157)',borderColor: 'rgb(99, 138, 157)', hoverBorderColor: 'rgb(99, 138, 157)'}
  ];
  //-------------------------------------------------
  //-------------------weekly range chart-----------------
  showRangeChart(){
    
    this.active="";
    var timeData = this.timeData;
   
    var searchService = this.searchService;
    var index = 0;
    
    async function openModal(e) {
      //console.log('event object')
      //console.log(e.dataSeries.this_pointer.showModal);
      e.dataSeries.this_pointer.showModal = true;
      //console.log(e.dataSeries.this_pointer.showModal);
      
      index = Math.abs(e.dataPointIndex-7);
      let time = timeData[index];
      
      //console.log("I am here");
      await e.dataSeries.this_pointer.getDayData(time);
      getButton();
      //console.log( e.dataSeries.this_pointer.dayData_details);
    }

    function getButton(){
      const elem = <HTMLInputElement>document.getElementById('modalId');
      elem.click();
    }
    
   
    for(var i =0 ; i <= 8; i++){
      console.log()
    }
    let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      height:500,
      title: {
        text: "Weekly Weather"
      },
      axisX: {
        title: "Days"
      },
      axisY: {
        gridThickness: 0,
        includeZero: false,
        title: "Temperature in Fahrenheit",
        interval: 10,
        
      }, 
      
      legend:{
        horizontalAign: "center",
        verticalAlign: "top"
      },
      dataPointWidth: 15,
      data: [{
        type: "rangeBar",
        color: "rgb(151, 206, 239)",
        showInLegend: true,
        legendText: "Day wise Temperature Range",
        yValueFormatString: "#0.#",
        indexLabel: "{y[#index]}",
        toolTipContent: "<b>{label}</b>: {y[0]} to {y[1]}",
        click: openModal,
        this_pointer: this,
        dataPoints: [
          { x: 10, y:this.yData[7], label: this.datePipe.transform((this.timeData[7])*1000, 'dd/MM/yyyy') },
          { x: 20, y:this.yData[6], label: this.datePipe.transform((this.timeData[6])*1000, 'dd/MM/yyyy')},
          { x: 30, y:this.yData[5], label:  this.datePipe.transform((this.timeData[5])*1000, 'dd/MM/yyyy')},
          { x: 40, y:this.yData[4], label: this.datePipe.transform((this.timeData[4])*1000, 'dd/MM/yyyy')},
          { x: 50, y:this.yData[3], label: this.datePipe.transform((this.timeData[3])*1000, 'dd/MM/yyyy') },
          { x: 60, y:this.yData[2], label:  this.datePipe.transform((this.timeData[2])*1000, 'dd/MM/yyyy')},
          { x: 70, y:this.yData[1], label:  this.datePipe.transform((this.timeData[1])*1000, 'dd/MM/yyyy')},
          { x: 80, y:this.yData[0], label:  this.datePipe.transform((this.timeData[0])*1000, 'dd/MM/yyyy')},
        ]
      }]
      
    });
    
    chart.render();
   
  }
  twitterClicked(){
    let url = 'https://twitter.com/intent/tweet?hashtags=CSCI571WeatherSearch&text=The%20current%20temperature%20at%20'+ this.cityName +'%20is%20'+ Math.round(this.forecast_results['currently']['temperature']) +'°F.%20The%20weather%20conditions%20are%20'+ this.forecast_results['currently']['summary'] ;
    window.open(url,"");
  }

  favClicked(){
    
    this.favs = true;
    this.showResults = false;
    this.favoriteService.getFavorites();
    console.log("from favclicked"+this.favorites);
  }
  displayResults(){
    this.showResults = true;
    this.favs = false;
    this.active= 't1';
  }
  getDetailsAgain(city){
    let deets = JSON.parse(localStorage.getItem(city));
    let street = deets["street"];
    let state = deets['state'];
    this.searchService.getGoogleGeocode(street,city,state);
    this.showResults = true;
    this.favs = false;
    
  }
  onCloseHandled(){
    document.getElementById('modalContainer').style.display = 'none';
    document.getElementById('modalContent').style.display = 'none';
   
  }

  
  ngOnInit(){
    
    this.searchService.getForecast();
    this.searchService.getForecastUpdateListener()
                      .subscribe((forecast_results) => {
                        this.forecast_results = forecast_results;
                        
                      });
    this.searchService.getCityName();
    this.searchService.getCityNameListener()
                      .subscribe((cityName) => {
                        this.cityName = cityName;
                      });
    this.searchService.getStateName();
    this.searchService.getStateNameListener()
                      .subscribe((stateName) => {
                        this.stateName = stateName;
                      });
    this.searchService.getStreetName();
    this.searchService.getStreetNameListener()
                      .subscribe((streetName) => {
                        this.streetName = streetName;
                      });
    this.searchService.getStateSealLink();
    this.searchService.getStateSealLinkListener()
                      .subscribe((stateSeal) => {
                        this.stateSeal = stateSeal;
                        console.log("hi someth" + this.stateSeal);
                      });
    this.searchService.getInvalidAddress();
    this.searchService.getInvalidAddressUpdateListener()
                      .subscribe((invalidAdd) => {
                          this.invalidAdd = invalidAdd;
                          
                      });
    this.searchService.getLatLon();
    this.searchService.getLatLonUpdateListener()
                      .subscribe((latlon) => {
                        this.latlon = latlon;
                        console.log("latlong "  + this.latlon);
                      });
    this.favoriteService.favList.subscribe((favss)=> {
      //console.log(favss['favs']);
      this.favorites = favss['favs'];
      //console.log("hi sahithi" + this.favorites);
      });
      this.searchService.getDayDataUpdates();
      this.searchService.getDayDataUpdateListener()
                    .subscribe((dailyData) => {
                      this.dailyData = dailyData;
                      console.log("hi someth" + this.dailyData);
                    });
    this.favoriteService.getisFavoriteUpdate();
    this.favoriteService.getisFavoriteUpdateListener()
                        .subscribe((isFavorite) => {
                          this.isFavorite = isFavorite;
                        })
    this.searchService.getCurrentLoc();
    this.searchService.getCurrentLocUpdateListener()
                      .subscribe((isCurr) => {
                        this.isCurr = isCurr;
                      });
    this.searchService.getLoading();
    this.searchService.getLoadingUpdatesListener()
                      .subscribe((loading) => {
                        this.loading = loading;
                      });
    this.searchService.getShowResults();
    this.searchService.getShowResultsUpdateListener()
                      .subscribe((showResults) => {
                        this.showResults = showResults;
                      });
    this.searchService.getFavs();
    this.searchService.getFavsUpdateListener()
                      .subscribe((favs) => {
                        this.favs = favs;
                      });
    this.searchService.getActive();
    this.searchService.getActiveUpdateListener()
                      .subscribe(active  => {
                        this.active=active
                    });
    
    
}
}


