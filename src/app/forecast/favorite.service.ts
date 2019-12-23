import { Injectable } from '@angular/core';
import { SearchService } from './search.service';
import { Subject } from 'rxjs';
@Injectable()
export class FavoriteService{
    allFavs= [];
    returnJson: any;
    //tempFav = [];
    private _allFavs = new Subject();
    favList = this._allFavs.asObservable();
    public isFavorite: boolean= true;
    public _isFavorite = new Subject;

    saveFavorite(image, city, state,street){
        let favJSON = {
            image: image,
            city: city,
            state: state,
            street: street
        }
        localStorage.setItem(city,JSON.stringify(favJSON));
        this.getFavorites();
    }
    getFavorites(){
       let tempFav = [];
        
        for(let i=0; i<localStorage.length; i++){
            
            if(localStorage.key(i) == 'randid'){
                
            }
            else{
                let favData = JSON.parse(localStorage.getItem(localStorage.key(i)));
                tempFav.push(favData);
                
            }
        
        }
       
        this.returnJson = {
            favs: tempFav
        };
        
        this._allFavs.next(this.returnJson);
    }
    delFavorite(city){
        localStorage.removeItem(city);
        this.isFavorite = false;
        this._isFavorite.next(this.isFavorite);
        this.getFavorites();
    }
    checkFavorite(city){
       
        if (!localStorage.getItem(city)){
            return false;
        }
        else{
            return true;
        }
    }
    getisFavoriteUpdateListener(){
        return this._isFavorite.asObservable();
    }
    getisFavoriteUpdate(){
        this._isFavorite.next(this._isFavorite);
    }
    getFavoritesUpdateListener(){
        return this._allFavs.asObservable();
    }
    getFavoritesUpdate(){
        return this._allFavs.next(this.returnJson);
    }
}