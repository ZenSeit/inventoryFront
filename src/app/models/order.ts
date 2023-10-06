import { ProductSale } from "./productSale";

export interface Order {
    products: ProductSale[];
    branchId: string;
}
