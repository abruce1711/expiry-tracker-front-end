import { Component, OnInit } from '@angular/core';
import { DatePipe, formatDate } from '@angular/common'
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Item } from '../models/item';
import { ItemService } from '../services/item.service';

@Component({
  selector: 'app-add-items',
  templateUrl: './add-items.component.html',
  styleUrls: ['./add-items.component.scss']
})
export class AddItemsComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private service: ItemService) { }

  ngOnInit(): void {
  }

  bestBeforeOrUseBySelect = [
    "Use by",
    "Best before"
  ]

  addItemForm: FormGroup = new FormGroup({
    itemName: new FormControl(''),
    bestBeforeOrUseBy: new FormControl(this.bestBeforeOrUseBySelect[0]),
    expiryDate: new FormControl(new Date()),
    quantity: new FormControl('1')
  });

  public get itemName(): AbstractControl { return this.addItemForm?.get('itemName') as FormGroup; }
  public get bestBeforeOrUseBy(): AbstractControl { return this.addItemForm?.get('bestBeforeOrUseBy') as FormGroup; }
  public get expiryDate(): AbstractControl { return this.addItemForm?.get('expiryDate') as FormGroup; }
  public get quantity(): AbstractControl { return this.addItemForm?.get('quantity') as FormGroup; }

  private item: Item;

  public addItem():void {
    this.item = new Item(this.itemName.value, 
      formatDate(this.expiryDate.value, 'dd/MM/yyyy', 'en_GB'),
      this.bestBeforeOrUseBy.value, this.quantity.value);

    this.service.createItem(this.item).subscribe(() => {
      this.service.getItems().subscribe((items: Item[]) => {
        this.service.$updatedItems.next(items);
      })
    });
  }
}
