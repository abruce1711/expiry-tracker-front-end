import {Item} from './item'

export class Drawer {
    drawerNumber: string;
    items: Item[];

    public constructor (drawerNumber: string) {
        this.drawerNumber = drawerNumber;
        this.items = [];
    }
}