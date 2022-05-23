import { Component, OnInit } from '@angular/core';
import { Item } from '../models/item';
import { ResponseModel } from '../models/response-model';
import { ItemService } from '../services/item.service';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss']
})
export class ListItemsComponent implements OnInit {
  items: Item[];
  constructor(private service:ItemService) {
  }

  ngOnInit(): void {
    this.service.getItems().subscribe((response: ResponseModel) => {
      if(response.Items != null){
        this.items = response.Items,
        this.service.$localItemsList.next(response.Items)
      }
    });

    this.service.$localItemsList.subscribe((items) => {this.items = items});
  }

  public deleteItem(item: Item):void {
    this.service.deleteItem(item.ItemName).subscribe((response: ResponseModel) => {
      if(response.StatusCode == 200){
        this.service.removeFromLocalItemList(item);
      }
      else {
        console.log(`Error deleting item, response code = ${response.StatusCode}`);
      }
    });
  }
}
