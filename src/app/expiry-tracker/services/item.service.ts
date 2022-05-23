import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Item } from '../models/item';
import { ResponseModel } from '../models/response-model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private url = "https://shje5d3m4g.execute-api.eu-west-2.amazonaws.com/Prod/expirytracker";
  
  public $localItemsList: BehaviorSubject<Item[]>;
  constructor(private httpClient: HttpClient) { 
    this.$localItemsList = new BehaviorSubject<Item[]>([]);
  }

  public getItems(): Observable<ResponseModel>{
    return this.httpClient.get<ResponseModel>(this.url);
  }

  public createItem(item: Item): Observable<ResponseModel>{
    return this.httpClient.post<ResponseModel>(this.url, item);
  }

  public deleteItem(itemName: string): Observable<ResponseModel>{
    return this.httpClient.delete<ResponseModel>(`${this.url}?userId=1&itemName=${itemName}`);
  }

  public addToLocalItemList(item?: Item): void{
    var oldValues = this.$localItemsList.getValue();
    if(item != null){
      this.$localItemsList.next([...oldValues, item]);
    }
  }

  public removeFromLocalItemList(itemToDelete: Item): void{
    var items = this.$localItemsList.getValue();

    items.forEach((item,index)=>{
      if(item==itemToDelete) items.splice(index,1);
   });
  }
}
