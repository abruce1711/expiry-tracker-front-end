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
  items: Item[];
  itemToDeleteName: string;
  loading: boolean;
  constructor(private service:ItemService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.service.getItems().subscribe((response: ResponseModel) => {
      this.loading = false;
      if(response.Items != null){
        this.items = response.Items,
        this.service.buildLocalItemList(response.Items);
      }
    });

    this.service.$localItemsList.subscribe((items) => {this.items = items});
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
