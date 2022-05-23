import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common'
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Item } from '../models/item';
import { ItemService } from '../services/item.service';
import { ResponseModel } from '../models/response-model';

@Component({
  selector: 'app-add-items',
  templateUrl: './add-items.component.html',
  styleUrls: ['./add-items.component.scss']
})
export class AddItemsComponent implements OnInit {

  addItemForm:FormGroup;
  constructor(private formBuilder: FormBuilder, private service: ItemService) { }

  ngOnInit(): void {
    this.buildForm();
  }

  bestBeforeOrUseBySelect = [
    "Use by",
    "Best before"
  ]

  public get itemName(): AbstractControl { return this.addItemForm?.get('itemName') as FormGroup; }
  public get bestBeforeOrUseBy(): AbstractControl { return this.addItemForm?.get('bestBeforeOrUseBy') as FormGroup; }
  public get expiryDate(): AbstractControl { return this.addItemForm?.get('expiryDate') as FormGroup; }
  public get quantity(): AbstractControl { return this.addItemForm?.get('quantity') as FormGroup; }

  private item: Item;

  public addItem():void {
    this.item = new Item(this.itemName.value, 
      formatDate(this.expiryDate.value, 'dd/MM/yyyy', 'en_GB'),
      this.bestBeforeOrUseBy.value, this.quantity.value);

    this.service.createItem(this.item).subscribe((response: ResponseModel) => {
      console.log(response);
      if(response.StatusCode == 200){
        this.service.addToLocalItemList(response.Item);
      }
      else {
        console.log(`Error adding item, response code = ${response.StatusCode}`);
      }
    });

    this.buildForm();
  }

  private buildForm():void{
    this.addItemForm = new FormGroup({
      itemName: new FormControl(''),
      bestBeforeOrUseBy: new FormControl(this.bestBeforeOrUseBySelect[0]),
      expiryDate: new FormControl(new Date()),
      quantity: new FormControl('1')
    });
  }
}
