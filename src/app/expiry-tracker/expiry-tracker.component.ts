import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ItemService } from './services/item.service';

@Component({
  selector: 'app-expiry-tracker',
  templateUrl: './expiry-tracker.component.html',
  styleUrls: ['./expiry-tracker.component.scss']
})
export class ExpiryTrackerComponent {
  
  constructor(private service: ItemService) {}

  toggleFridgeFreezer(toggle: string) {
    this.service.$fridgeFreezerToggle.next(toggle);
  }


}
  



