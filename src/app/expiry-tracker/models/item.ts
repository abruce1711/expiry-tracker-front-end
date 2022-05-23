export class Item {
    UserId: string;
    ItemName: string;
    ExpiryDate: string;
    BestBeforeOrUseBy: string;
    Quantity: number;

    public constructor(itemName: string, expiryDate: string, 
        bestBeforeOrUseBy:string, quantity: number){
            this.UserId = "1",
            this.ItemName = itemName,
            this.ExpiryDate = expiryDate,
            this.BestBeforeOrUseBy = bestBeforeOrUseBy,
            this.Quantity = quantity
        }
}