import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { formatDate } from '@angular/common'
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Item } from '../models/item';
import { ItemService } from '../services/item.service';
import { ResponseModel } from '../models/response-model';

@Component({
  selector: 'app-add-items',
    template: `
      <button (click)="toggleAddItemForm()">Send Message</button>
  `,
  templateUrl: './add-items.component.html',
  styleUrls: ['./add-items.component.scss']
})
export class AddItemsComponent implements OnInit {

  fridge: boolean;
  addItemForm:FormGroup;
  addItemToggle: boolean;
  toggleButtonText: string;
  submitButtonText: string;

  toggleAddItemButtonText: string;
  addItemButtonText: string;
  editItemButtonText: string;
  cancelEditButtonText: string;
  cancelAddItemButtonText: string;

  itemToEdit: Item;

  constructor(private formBuilder: FormBuilder, private service: ItemService) {
    this.addItemToggle = true;
    this.toggleAddItemButtonText = "Add Items";
    this.addItemButtonText = "Add Item";
    this.editItemButtonText = "Edit Item";
    this.toggleButtonText = "Add Items";
    this.cancelEditButtonText = "Cancel";
    this.cancelAddItemButtonText = "Hide Form";
    this.submitButtonText = this.addItemButtonText;
   }

  ngOnInit(): void {

    this.service.$fridgeFreezerToggle.subscribe((toggle) => {
        if(toggle === "expirytracker"){
          this.fridge = true;
        } else {
          this.fridge = false;
        }
    });

    this.buildForm(this.fridge);
    this.service.$itemToEdit.subscribe((itemToEdit: Item) => {
      this.itemToEdit = itemToEdit;
        this.buildForm(this.fridge, itemToEdit);
        this.toggleButtonText = this.cancelEditButtonText;
        this.toggleEditItems();
    });
  }

  bestBeforeOrUseBySelect = [
    "Use by",
    "Best before"
  ]

  public get itemName(): AbstractControl { return this.addItemForm?.get('itemName') as FormGroup; }
  public get bestBeforeOrUseBy(): AbstractControl { return this.addItemForm?.get('bestBeforeOrUseBy') as FormGroup; }
  public get expiryDate(): AbstractControl { return this.addItemForm?.get('expiryDate') as FormGroup; }
  public get quantity(): AbstractControl { return this.addItemForm?.get('quantity') as FormGroup; }
  public get previousName(): AbstractControl { return this.addItemForm?.get('previousName') as FormGroup; }
  public get drawer(): AbstractControl { return this.addItemForm?.get('drawer') as FormGroup; }

  private item: Item;


  public toggleEditItems(){
    this.addItemToggle = !this.addItemToggle;
    this.toggleButtonText = this.addItemToggle ? this.toggleAddItemButtonText : this.cancelEditButtonText;
    this.submitButtonText = this.addItemToggle ? this.addItemButtonText : this.editItemButtonText
  }

  public toggleAddItems(buttonText: string){
    this.addItemToggle = !this.addItemToggle;
    this.toggleButtonText = this.addItemToggle ? this.toggleAddItemButtonText : this.cancelAddItemButtonText;

    if(buttonText == this.cancelEditButtonText){
      this.buildForm(this.fridge);
      this.service.addToLocalItemList(this.itemToEdit);
      this.submitButtonText = this.addItemButtonText;
    }
  }

  public createUpdateItem(submitButtonText:string):void {
    if(this.fridge){
      this.item = new Item(this.itemName.value, this.quantity.value, formatDate(this.expiryDate.value, 'dd/MM/yyyy', 'en_GB'),
        this.bestBeforeOrUseBy.value,
        
        );
    }
    else {
      this.item = new Item(this.itemName.value, this.quantity.value, undefined, undefined, this.drawer.value);
    }

    if(submitButtonText == this.editItemButtonText){
        this.toggleEditItems();
        if(this.previousName.valid && this.previousName != this.itemName){
          this.item.PreviousItemName = this.previousName.value;
        }
    }

    this.service.addToLocalItemList(this.item);
    this.service.createUpdateItem(this.item).subscribe((response: ResponseModel) => {
      if(response.StatusCode != 200 && response.Item == null){  
        this.service.removeFromLocalItemList(this.item);
        console.log(`Error adding item, response code = ${response.StatusCode}`);
      }
    });

    this.buildForm(this.fridge);
  }

  private buildForm(fridge: boolean, itemToEdit?: Item):void{
    if(fridge){
      if(itemToEdit != null && itemToEdit.ExpiryDate != null){
        var dateParts = itemToEdit.ExpiryDate.split("/");
        var expiryDate = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
  
        this.addItemForm = new FormGroup({
          itemName: new FormControl(itemToEdit.ItemName),
          previousName: new FormControl(itemToEdit.ItemName),
          bestBeforeOrUseBy: new FormControl(itemToEdit.BestBeforeOrUseBy),
          expiryDate: new FormControl(new Date(expiryDate)),
          quantity: new FormControl(itemToEdit.Quantity),
          drawer: new FormControl(itemToEdit.Drawer),
          editingItem: new FormControl(true),
        });
      } else {
        this.addItemForm = new FormGroup({
          itemName: new FormControl(''),
          previousName: new FormControl(null),
          bestBeforeOrUseBy: new FormControl(this.bestBeforeOrUseBySelect[0]),
          expiryDate: new FormControl(new Date()),
          quantity: new FormControl('1'),
          drawer: new FormControl('1'),
          editingItem: new FormControl(false)
        });
      } 
    }
    else {
      if(itemToEdit != null){  
        this.addItemForm = new FormGroup({
          itemName: new FormControl(itemToEdit.ItemName),
          previousName: new FormControl(itemToEdit.ItemName),
          quantity: new FormControl(itemToEdit.Quantity),
          drawer: new FormControl(itemToEdit.Drawer),
          editingItem: new FormControl(true)
        });
      } else {
        this.addItemForm = new FormGroup({
          itemName: new FormControl(''),
          previousName: new FormControl(null),
          quantity: new FormControl('1'),
          drawer: new FormControl('1'),
          editingItem: new FormControl(false)
        });
      } 
    }
  }
}
