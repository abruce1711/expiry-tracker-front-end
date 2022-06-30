import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Drawer } from '../models/drawer';
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
  freezerDrawers: Drawer[];
  itemToDeleteName: string;
  loading: boolean;
  displaySpinner: boolean;
  panelOpenState = false;
  @ViewChild(MatAccordion) accordion: MatAccordion; 
  constructor(private service:ItemService, private modalService: NgbModal) {
    this.freezerDrawers = [new Drawer("1"), new Drawer("2"), new Drawer("3")];
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
    

    this.service.$localFridgeItemsList.subscribe((items) => {this.fridgeItems = items;});
    this.service.$localFreezerItemsList.subscribe((items) => {
      this.freezerItems = items;
      this.populateFreezerDrawers(items);
    });
  }

  private delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  private async setDisplaySpinner(){
    await this.delay(200);
    if(this.loading === true){
      this.displaySpinner = true;
    }
    else {
      this.loading = false;
      this.displaySpinner = false;
    }
  }

  private getItems(){
    this.loading = true;
    this.setDisplaySpinner();
    this.service.getItems().subscribe((response: ResponseModel) => {
      if(response.Items != null && this.displayFridge){
        this.fridgeItems = response.Items;
        this.service.buildLocalItemList(response.Items);
      }
      else if(response.Items != null && !this.displayFridge){
        this.populateFreezerDrawers(response.Items);
        this.freezerItems = response.Items;
        this.service.buildLocalItemList(response.Items);
      }

      this.loading = false;
      this.displaySpinner = false;
    });

  }

  private populateFreezerDrawers(items: Item[]){
    this.freezerDrawers = [new Drawer("1"), new Drawer("2"), new Drawer("3")];
    for(let i = 0; i < items.length; i++){
      if(items[i].Drawer === "1"){
        this.freezerDrawers[0].items.push(items[i]);
      }
      else if(items[i].Drawer === "2"){
        this.freezerDrawers[1].items.push(items[i]);
      }
      else if(items[i].Drawer === "3"){
        this.freezerDrawers[2].items.push(items[i]);
      }
    }
  }

  public drawerTrackBy(index: any, drawer:any){
    return drawer.drawerNumber;
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
