import { ProductSale } from "./productSale";

export interface Invoice {

    id: string;
    branchId: string;
    products: ProductSale[];
    total: number;
    date: Date;
    sellType: string;
}
