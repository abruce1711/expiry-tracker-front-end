import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private url = "https://shje5d3m4g.execute-api.eu-west-2.amazonaws.com/Prod/expirytracker";
  
  public $updatedItems: BehaviorSubject<Item[]>;
  constructor(private httpClient: HttpClient) { 
    this.$updatedItems = new BehaviorSubject<Item[]>([]);
  }

  public getItems(): Observable<Item[]>{
    return this.httpClient.get<Item[]>(this.url);
  }

  public createItem(item: Item): Observable<Item>{
    return this.httpClient.post<Item>(this.url, item);
  }


}
