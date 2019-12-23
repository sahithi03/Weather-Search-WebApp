import { Component, OnInit } from '@angular/core';
import { SearchForm } from './search-form';
import {FormControl, Validators} from '@angular/forms';
import { SearchService  } from '../search.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-forecast',
  templateUrl: './forecast-search.component.html',
  styleUrls: ['./forecast-search.component.css']
})
export class ForecastSearchComponent implements OnInit{
    states = [
        {
            "name": "Alabama",
            "value": "AL"
        },
        {
            "name": "Alaska",
            "value": "AK"
        },
        {
            "name": "American Samoa",
            "value": "AS"
        },
        {
            "name": "Arizona",
            "value": "AZ"
        },
        {
            "name": "Arkansas",
            "value": "AR"
        },
        {
            "name": "California",
            "value": "CA"
        },
        {
            "name": "Colorado",
            "value": "CO"
        },
        {
            "name": "Connecticut",
            "value": "CT"
        },
        {
            "name": "Delaware",
            "value": "DE"
        },
        {
            "name": "District Of Columbia",
            "value": "DC"
        },
        {
            "name": "Federated States Of Micronesia",
            "value": "FM"
        },
        {
            "name": "Florida",
            "value": "FL"
        },
        {
            "name": "Georgia",
            "value": "GA"
        },
        {
            "name": "Guam",
            "value": "GU"
        },
        {
            "name": "Hawaii",
            "value": "HI"
        },
        {
            "name": "Idaho",
            "value": "ID"
        },
        {
            "name": "Illinois",
            "value": "IL"
        },
        {
            "name": "Indiana",
            "value": "IN"
        },
        {
            "name": "Iowa",
            "value": "IA"
        },
        {
            "name": "Kansas",
            "value": "KS"
        },
        {
            "name": "Kentucky",
            "value": "KY"
        },
        {
            "name": "Louisiana",
            "value": "LA"
        },
        {
            "name": "Maine",
            "value": "ME"
        },
        {
            "name": "Marshall Islands",
            "value": "MH"
        },
        {
            "name": "Maryland",
            "value": "MD"
        },
        {
            "name": "Massachusetts",
            "value": "MA"
        },
        {
            "name": "Michigan",
            "value": "MI"
        },
        {
            "name": "Minnesota",
            "value": "MN"
        },
        {
            "name": "Mississippi",
            "value": "MS"
        },
        {
            "name": "Missouri",
            "value": "MO"
        },
        {
            "name": "Montana",
            "value": "MT"
        },
        {
            "name": "Nebraska",
            "value": "NE"
        },
        {
            "name": "Nevada",
            "value": "NV"
        },
        {
            "name": "New Hampshire",
            "value": "NH"
        },
        {
            "name": "New Jersey",
            "value": "NJ"
        },
        {
            "name": "New Mexico",
            "value": "NM"
        },
        {
            "name": "New York",
            "value": "NY"
        },
        {
            "name": "North Carolina",
            "value": "NC"
        },
        {
            "name": "North Dakota",
            "value": "ND"
        },
        {
            "name": "Northern Mariana Islands",
            "value": "MP"
        },
        {
            "name": "Ohio",
            "value": "OH"
        },
        {
            "name": "Oklahoma",
            "value": "OK"
        },
        {
            "name": "Oregon",
            "value": "OR"
        },
        {
            "name": "Palau",
            "value": "PW"
        },
        {
            "name": "Pennsylvania",
            "value": "PA"
        },
        {
            "name": "Puerto Rico",
            "value": "PR"
        },
        {
            "name": "Rhode Island",
            "value": "RI"
        },
        {
            "name": "South Carolina",
            "value": "SC"
        },
        {
            "name": "South Dakota",
            "value": "SD"
        },
        {
            "name": "Tennessee",
            "value": "TN"
        },
        {
            "name": "Texas",
            "value": "TX"
        },
        {
            "name": "Utah",
            "value": "UT"
        },
        {
            "name": "Vermont",
            "value": "VT"
        },
        {
            "name": "Virgin Islands",
            "value": "VI"
        },
        {
            "name": "Virginia",
            "value": "VA"
        },
        {
            "name": "Washington",
            "value": "WA"
        },
        {
            "name": "West Virginia",
            "value": "WV"
        },
        {
            "name": "Wisconsin",
            "value": "WI"
        },
        {
            "name": "Wyoming",
            "value": "WY"
        }
    ]
    form = SearchForm;
    searchTerm: FormControl = new FormControl();
    isCurr = false;
    //selectedOption: string;
    selectedOption = new FormControl('',[Validators.required]);
    suggestions = [];
    predict = [];
    streetDisableText = false;
    cityDisableText = false;
    stateDisableText = false;
    submitBtn = true;
    currentLocation = new FormControl();
    favs = false;
    showResults = true;
    constructor(public searchService: SearchService, private http: HttpClient) {}
    

    getSuggestions($event, form: NgForm) {
      this.http
        .get('/api/autocomplete?input=' + form.value.city)
        .subscribe(response => {
          this.predict = Object.keys(response['predictions']);
          for (let i=0; i < this.predict.length; i++) {
            this.suggestions.push(response['predictions'][i]['structured_formatting']['main_text']);
            if (i == 4){
                break;
            }
          }
      });
      
      this.suggestions = [];
    }
    
    currentLoc(){
        if (this.currentLocation.value == true) {
        // (<HTMLInputElement>document.getElementById('street')).value = "";
        // (<HTMLInputElement>document.getElementById('city')).value = "";
        // (<HTMLInputElement>document.getElementById('state')).value = "";
        this.streetDisableText = true;
        this.cityDisableText = true;
        this.submitBtn = false;
        this.selectedOption.disable();
        this.isCurr =  true;
        (<HTMLButtonElement>document.getElementById('submitBtn')).removeAttribute('disabled');
        //this.showResults = true;
    }
    else{
        (<HTMLButtonElement>document.getElementById('submitBtn')).setAttribute('disabled','true');
        this.streetDisableText = false;
        this.cityDisableText = false;
        this.selectedOption.enable();
    }
    }
    isStateDisabled(){
        if(this.selectedOption.value != '' && this.form.city.length > 0 && this.form.street.length > 0){
            if(this.form.city.trim().length >0 && this.form.street.trim().length >  0 && this.selectedOption.value != ''){
                this.submitBtn = false;
            }
            
        }
        else if(this.selectedOption.value == '' || this.form.city.length == 0 || this.form.street.length == 0){
            this.submitBtn = true;
        }
    }
    isStreetDisabled(){
        if(this.selectedOption.value != '' && this.form.city.trim().length > 0 && this.form.street.trim().length > 0){
            if(this.form.city.trim().length >0 && this.form.street.trim().length >  0 && this.selectedOption.value != ''){
                this.submitBtn = false;
            }
        }
        else if(this.selectedOption.value == '' || this.form.city.length == 0 || this.form.street.length == 0){
            this.submitBtn = true;
        } 
    }
    isCityDisabled(){
        if(this.selectedOption.value != '' && this.form.city.trim().length > 0 && this.form.street.trim().length > 0){
            if(this.form.city.trim().length >0 && this.form.street.trim().length >  0 && this.selectedOption.value != ''){
                this.submitBtn = false;
            }
        }
        else if(this.selectedOption.value == '' || this.form.city.length == 0 || this.form.street.length == 0){
            this.submitBtn = true;
        } 
    }
    
    onSubmit(form: NgForm) {
    this.showResults = true;
    this.favs = false;
      if (this.currentLocation.value == true) {
        this.searchService.getIpApi();
        
      }
      else {
        
        this.searchService.getGoogleGeocode(form.value.street,form.value.city,this.selectedOption.value);
        
      }
      
    }
    clear(){
        this.streetDisableText = false;
        this.cityDisableText = false;
        this.currentLocation.setValue(false);
        this.selectedOption.enable();
        this.submitBtn = true;
        this.searchService.clear();
        
        (<HTMLButtonElement>document.getElementById('submitBtn')).setAttribute('disabled','true');
    }

    
    ngOnInit() {
        
    }










}
