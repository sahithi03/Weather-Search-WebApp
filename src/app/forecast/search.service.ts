import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import axios from 'axios';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class SearchService {

    private http: HttpClient;
    street = '';
    city = '';
    state = '';
    address = '';
    lat = 0;
    lon = 0;
    public latLon: any;
    private _latlon = new Subject;
    seal_link = "";
    public invalid_address = new Subject;
    public invalid_add = false;
    private loading: any;
    public _loading = new Subject;
    private stateSeal = new Subject;
    private cityName = new Subject;
    private stateName = new Subject;
    private streetName = new Subject;
    private forecast_details: any;
    public forecast_results = new Subject;
    private dayData_details: any;
    public dayData = new Subject;
    private isCurrentLoc: any;
    public _isCurrentLoc = new Subject;
    public showResults = true;
    private _showResults = new Subject;
    public favs = false;
    private _favs = new Subject;
    public active = 't1';
    private _active =   new Subject;
    //ipapi lat lon values
    async getIpApi(){
      try{
      this.isCurrentLoc = true;
      this._isCurrentLoc.next(this.isCurrentLoc);
      this.invalid_add = false;
      this.invalid_address.next(this.invalid_add);
      const response = await axios.get('http://ip-api.com/json');
      this.lat = response.data['lat'];
      this.lon = response.data['lon'];
      this.city = response.data['city'];
      this.state = response.data['region']
      this.cityName.next(this.city);
      this.stateName.next(this.state);
      this.getForecastDetails(this.lat, this.lon,this.state);
      this.getStateSeal(this.state);
      console.log("im in getip api service");
      }
      catch(error){
        console.log(error);
      }
    }


    // google geocode lat long values
    async getGoogleGeocode(street,city,st){
    try{
    this.isCurrentLoc = false;
    this._isCurrentLoc.next(this.isCurrentLoc);
    this.street = street;
    this.city = city;
    this.state = st;
    this.streetName.next(this.street);
    this.cityName.next(this.city);
    this.stateName.next(this.state);
    this.address = this.street + this.city + this.state;
    const response = await axios.get('/api/googleGeocode?address=' + this.address );
    let jsonResults = response.data;
    console.log("im in google geocode service");
    if(response.data.status == 'ZERO_RESULTS'){
      
      this.invalid_add = true;
      
    }
    else{
    this.invalid_add = false;
    
    this.lat = jsonResults['results'][0]['geometry']['location']['lat'];
    this.lon = jsonResults['results'][0]['geometry']['location']['lng'];
    this.getForecastDetails(this.lat, this.lon, this.state);
    this.getStateSeal(this.state);

    }
    this.invalid_address.next(this.invalid_add);
    }
    catch(error){
      console.log(error);
    }
    }

    // forecast details method
    async getForecastDetails(lat, lon, state) {
      try{
      this.showResults = true;
      this._showResults.next(this.showResults);
      this.favs = false;
      this._favs.next(this.favs);
      console.log("active------"+this.active);
      this.active = 't1';
      console.log(this.active);
      this._active.next(this.active);
      this.latLon = [lat,lon];
      this._latlon.next(this.latLon);
      this.loading = true;
      this._loading.next(this.loading);
      this.showResults  = false;
      this._showResults.next(this.showResults);
      const forecast_response = await axios.get('/forecast//'+this.latLon[0]+"/"+this.latLon[1]);
      this.showResults  = true;
      this._showResults.next(this.showResults);
      this.loading = false;
      this._loading.next(this.loading);
      this.forecast_details = forecast_response.data;
      console.log("im in getforecast details service");
      console.log(this.forecast_details);
      this.forecast_results.next(this.forecast_details);
      //alert(state);
      
      }
      catch(error){
        console.log(error);
      }
    }

    // google custom search------state seal------
    async getStateSeal(state){
     
      try{
      const seal_response = await axios.get('/api/customsearch?q=' + state);
      let seal_json = seal_response.data;
      
      this.seal_link = seal_json["items"][0]["link"];
      this.stateSeal.next(this.seal_link);
      
      }
      catch(error){
        console.log(error);
      }
    }

    clear(){
      this.forecast_results.next("clear");
      this.invalid_add = false;
      this.invalid_address.next(this.invalid_add);
      this.showResults = true;
      this._showResults.next(this.showResults);
      this.favs = false;
      this._favs.next(this.favs);
      
    }
    
    
    getStreetNameListener(){
      return this.streetName.asObservable();
    }
    getStreetName(){
      this.streetName.next(this.street);
    }
    getCityNameListener(){
      return this.cityName.asObservable();
    }

    getCityName(){
      this.cityName.next(this.city);
    }
    getStateNameListener(){
      return this.stateName.asObservable();
    }
    getStateName(){
      this.stateName.next(this.state);
    }
    getStateSealLinkListener(){
      return this.stateSeal.asObservable();
    }
    getStateSealLink(){
      this.stateSeal.next(this.seal_link);
    }
    //getter
    getForecastUpdateListener(){
      return this.forecast_results.asObservable();
    }

    //setter
    getForecast(){
      //console.log("from service"+this.forecast_details);
      this.forecast_results.next(this.forecast_details);
    }
    getInvalidAddressUpdateListener(){
      return this.invalid_address.asObservable();
    }
    getInvalidAddress(){
      this.invalid_address.next(this.invalid_add);
    }

    getDayDataUpdateListener(){
      return this.dayData.asObservable();
    }
    getDayDataUpdates(){
      this.dayData.next(this.dayData_details);
    }
    getLatLonUpdateListener(){
      return this._latlon.asObservable();
      
    }
    getLatLon(){
      this._latlon.next(this.latLon);
    }
    getCurrentLocUpdateListener(){
      return this._isCurrentLoc.asObservable();
    }
    getCurrentLoc(){
      this._isCurrentLoc.next(this.isCurrentLoc);
    }
    getLoadingUpdatesListener(){
      return this._loading.asObservable();
    }
    getLoading(){
      this._loading.next(this.loading);
    }
    getShowResultsUpdateListener(){
      return this._showResults.asObservable();
    }
    getShowResults(){
      this._showResults.next(this.showResults);
    }

    getFavsUpdateListener(){
      return this._favs.asObservable();
    }
    getFavs(){
      this._favs.next(this.favs);
    }
    getActiveUpdateListener(){
      return this._active.asObservable();
    }
    getActive(){
      this._active.next(this.active);
    }
    
}


