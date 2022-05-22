export class Item {
    userId: string;
    itemName: string;
    expiryDate: string;
    bestBeforeOrUseBy: string;
    quantity: number;

    constructor(itemName: string, expiryDate: string, 
        bestBeforeOrUseBy:string, quantity: number){
            this.userId = "1",
            this.itemName = itemName,
            this.expiryDate = expiryDate,
            this.bestBeforeOrUseBy = bestBeforeOrUseBy,
            this.quantity = quantity
        }
}