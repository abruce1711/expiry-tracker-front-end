import { Component, OnInit } from '@angular/core';
import { ListItemsComponent } from './list-items/list-items.component';

@Component({
  selector: 'app-expiry-tracker',
  templateUrl: './expiry-tracker.component.html',
  styleUrls: ['./expiry-tracker.component.scss']
})
export class ExpiryTrackerComponent implements OnInit {

  addItemToggle: boolean;
  toggleButtonText: string;
  constructor() {
    this.addItemToggle = true;
    this.toggleButtonText = "Add Items";
   }

  ngOnInit(): void {
  }

  toggleAddItems(): void {
    this.addItemToggle = !this.addItemToggle;
    this.toggleButtonText = this.addItemToggle ? "Add Items" : "Hide Form";
  }

}
