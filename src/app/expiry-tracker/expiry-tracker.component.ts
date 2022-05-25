import { Component, OnInit, ViewChild } from '@angular/core';
import { AddItemsComponent } from './add-items/add-items.component';
import { ListItemsComponent } from './list-items/list-items.component';
import { Item } from './models/item';
import { ItemService } from './services/item.service';

@Component({
  selector: 'app-expiry-tracker',
  templateUrl: './expiry-tracker.component.html',
  styleUrls: ['./expiry-tracker.component.scss']
})
export class ExpiryTrackerComponent  {

  constructor() {}
  }



