export class Item {
    UserId: string;
    ItemName: string;
    Quantity: number;
    PreviousItemName?:string;
    ExpiryDate?: string;
    BestBeforeOrUseBy?: string;
    Drawer?: string;

    public constructor(itemName: string, quantity: number, expiryDate?: string, 
        bestBeforeOrUseBy?: string, drawer?: string){
            this.UserId = "1",
            this.ItemName = itemName,
            this.ExpiryDate = expiryDate,
            this.BestBeforeOrUseBy = bestBeforeOrUseBy,
            this.Quantity = quantity,
            this.Drawer = drawer
        }
}