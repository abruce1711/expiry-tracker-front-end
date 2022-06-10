import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Item } from 'src/app/expiry-tracker/models/item';

@Injectable({
  providedIn: 'root'
})
export class DeleteModalService {
  public $itemToDelete: ReplaySubject<Item>;

  constructor() { 
    this.$itemToDelete = new ReplaySubject();
  }

  public confirmDeleteItem(item: Item){
    this.$itemToDelete.next(item);
  }
}
