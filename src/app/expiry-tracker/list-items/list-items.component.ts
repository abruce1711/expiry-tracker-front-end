import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from '../models/item';
import { ResponseModel } from '../models/response-model';
import { ItemService } from '../services/item.service';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss']
})
export class ListItemsComponent implements OnInit {
  displayFridge: boolean
  fridgeItems: Item[];
  freezerItems: Item[];
  itemToDeleteName: string;
  loading: boolean;
  constructor(private service:ItemService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
   this.getItems();

    this.service.$fridgeFreezerToggle.subscribe((toggle) => {
      if(toggle === "expirytracker"){
        this.displayFridge = true;
      } else {
        this.displayFridge = false;
      }
      this.getItems();
    });

    if(this.displayFridge){
      this.service.$localFridgeItemsList.subscribe((items) => {this.fridgeItems = items});
    }
    else {
      this.service.$localFreezerItemsList.subscribe((items) => {this.freezerItems = items});
    }
  }

  private getItems(){
    this.loading = true;
    this.service.getItems().subscribe((response: ResponseModel) => {
      this.loading = false;
      if(response.Items != null && this.displayFridge){
        this.fridgeItems = response.Items;
        this.service.buildLocalItemList(response.Items);
      }
      else if(response.Items != null && !this.displayFridge){
        this.freezerItems = response.Items;
        this.service.buildLocalItemList(response.Items);
      }
    });
  }

  private deleteItem(item: Item):void {
    this.service.removeFromLocalItemList(item);
    this.service.deleteItem(item.ItemName).subscribe((response: ResponseModel) => {
      if(response.StatusCode != 200){
        this.service.addToLocalItemList(item);
        console.log(`Error deleting item, response code = ${response.StatusCode}`);
      }
    });
  }

  public confirmDelete(deleteItemModal: any, item: Item) {
    this.itemToDeleteName = item.ItemName;
    this.modalService.open(deleteItemModal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if(result === "Delete"){
        this.deleteItem(item);
      }
    });
  }

  public editItem(item: Item):void{
      this.service.editItem(item);
  }
}
