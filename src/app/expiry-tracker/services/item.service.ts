import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { Item } from '../models/item';
import { ResponseModel } from '../models/response-model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private url = "https://shje5d3m4g.execute-api.eu-west-2.amazonaws.com/Prod";
  
  public $fridgeFreezerToggle: BehaviorSubject<string>;
  public $localFridgeItemsList: BehaviorSubject<Item[]>;
  public $localFreezerItemsList: BehaviorSubject<Item[]>;
  public $itemToEdit: ReplaySubject<Item>;

  public testItem1: Item;
  public testItem2: Item;
  public testItem3: Item;
  public testItem4: Item;
  public testItems: Item[];
  constructor(private httpClient: HttpClient) { 
    this.$localFridgeItemsList = new BehaviorSubject<Item[]>([]);
    this.$localFreezerItemsList = new BehaviorSubject<Item[]>([]);
    this.$itemToEdit = new ReplaySubject<Item>();
    this.$fridgeFreezerToggle = new BehaviorSubject<string>("expirytracker");
    this.testItem1 = new Item("test item 1", 2, "23-06-2022", "Use By");
    this.testItem2 = new Item("test item 2", 1, "28-06-2022", "Best Before");
    this.testItem3 = new Item("test item 3", 2, undefined, undefined, "2");
    this.testItem4 = new Item("test item 4", 2, undefined, undefined, "1");
    this.testItems = [this.testItem1, this.testItem2, this.testItem3, this.testItem4];
  }

  public getItems(): Observable<ResponseModel>{
    return this.httpClient.get<ResponseModel>(`${this.url}/${this.$fridgeFreezerToggle.value}`);
  }

  public createUpdateItem(item: Item): Observable<ResponseModel>{
    return this.httpClient.post<ResponseModel>(`${this.url}/${this.$fridgeFreezerToggle.value}`, item);
  }

  public deleteItem(itemName: string): Observable<ResponseModel>{
    return this.httpClient.delete<ResponseModel>(`${`${this.url}/${this.$fridgeFreezerToggle.value}`}?userId=1&itemName=${itemName}`);
  }

  public buildLocalItemList(items: Item[]): void{
    let fridgeItems = [];
    let freezerItems = [];
    for(let i=0; i<items.length; i++){
      if(items[i].ExpiryDate != null){
        fridgeItems.push(items[i]);
      } else {
        freezerItems.push(items[i]);
      }
    }

    if(items[0].ExpiryDate != null){
      let sortedItems = this.sortLocalItems(fridgeItems);
      this.$localFridgeItemsList.next(sortedItems);
  
    } else {
      this.$localFreezerItemsList.next(freezerItems);
    }
  }

  public addToLocalItemList(item?: Item): void{
    if(item?.ExpiryDate != null){
      var values = this.$localFridgeItemsList.getValue();
      if(item != null){
        values.push(item);
        let sortedItems = this.sortLocalItems(values);
        this.$localFridgeItemsList.next(sortedItems);
      }
    } else {
      var values = this.$localFreezerItemsList.getValue();
      if(item != null){
        values.push(item);
        this.$localFreezerItemsList.next(values);
      }
    }

  }

  public removeFromLocalItemList(itemToDelete?: Item): void{
    if(itemToDelete?.Drawer == null){
      var items = this.$localFridgeItemsList.getValue();
    } else {
      var items = this.$localFreezerItemsList.getValue();
    }

    items.forEach((item,index)=>{
      if(item==itemToDelete) {
        items.splice(index,1);
      }
    });

    if(itemToDelete?.Drawer == null){
      this.$localFridgeItemsList.next(items);
    } else {
      this.$localFreezerItemsList.next(items);
    }
  }

  public editItem(item: Item):void{
    this.$itemToEdit.next(item);
    this.removeFromLocalItemList(item);
  }

  public sortLocalItems(items: Item[]): Item[]{
    // Sorts by soonest expiry date first
    return items.sort((a,b) => {
      var aa = a.ExpiryDate?.split('/').reverse().join();
      var bb = b.ExpiryDate?.split('/').reverse().join();
      if(aa != null && bb != null)
        return aa < bb ? -1 : (aa > bb ? 1 : 0);
      
      return 0;
    });
  }
}
