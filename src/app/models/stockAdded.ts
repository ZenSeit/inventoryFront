import { ProductToAdd } from "./productToAdd";

export interface StockAdded {
    branchId?: string;
    products: ProductToAdd[];
}
