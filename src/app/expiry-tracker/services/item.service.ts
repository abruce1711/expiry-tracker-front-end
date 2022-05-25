import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { Item } from '../models/item';
import { ResponseModel } from '../models/response-model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private url = "https://shje5d3m4g.execute-api.eu-west-2.amazonaws.com/Prod/expirytracker";
  
  public $localItemsList: BehaviorSubject<Item[]>;
  public $itemToEdit: ReplaySubject<Item>;
  constructor(private httpClient: HttpClient) { 
    this.$localItemsList = new BehaviorSubject<Item[]>([]);
    this.$itemToEdit = new ReplaySubject<Item>();
  }

  public getItems(): Observable<ResponseModel>{
    return this.httpClient.get<ResponseModel>(this.url);
  }

  public createUpdateItem(item: Item): Observable<ResponseModel>{
    return this.httpClient.post<ResponseModel>(this.url, item);
  }

  public deleteItem(itemName: string): Observable<ResponseModel>{
    return this.httpClient.delete<ResponseModel>(`${this.url}?userId=1&itemName=${itemName}`);
  }

  public buildLocalItemList(items: Item[]): void{
    let sortedItems = this.sortLocalItems(items);
    debugger;
    this.$localItemsList.next(sortedItems);
  }

  public addToLocalItemList(item?: Item): void{
    var values = this.$localItemsList.getValue();
    if(item != null){
      values.push(item);
      let sortedItems = this.sortLocalItems(values);
      this.$localItemsList.next(sortedItems);
    }
  }

  public removeFromLocalItemList(itemToDelete?: Item): void{
    var items = this.$localItemsList.getValue();
    items.forEach((item,index)=>{
      if(item==itemToDelete) items.splice(index,1);
   });
  }

  public editItem(item: Item):void{
    this.$itemToEdit.next(item);
    this.removeFromLocalItemList(item);
  }

  public sortLocalItems(items: Item[]): Item[]{
    // Sorts by soonest expiry date first
    return items.sort((a,b) => {
      var aa = a.ExpiryDate.split('/').reverse().join();
      var bb = b.ExpiryDate.split('/').reverse().join();
      return aa < bb ? -1 : (aa > bb ? 1 : 0);
    });
  }
}
