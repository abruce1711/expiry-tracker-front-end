import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from 'src/app/expiry-tracker/models/item';
import { ItemService } from 'src/app/expiry-tracker/services/item.service';
import { DeleteModalService } from '../../services/delete-modal.service';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {
  closeResult = '';
  item: Item;
  constructor(private modalService: NgbModal, private itemService: ItemService, private deleteModalService: DeleteModalService) {}

  ngOnInit(): void {
    this.deleteModalService.$itemToDelete.subscribe((item: Item) => {
        this.open(item);
    });
  }


  public deleteItem(itemName: string){
    this.itemService.deleteItem(itemName);
  }

  open(item: Item) {
    this.modalService.open(null, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.item = item;
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
