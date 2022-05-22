import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Item } from '../models/item';
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
    this.service.getItems().subscribe((items) => {this.items = items});
    this.service.$updatedItems.subscribe((updatedItems) => {this.items = updatedItems});
  }
}
