import { productsApi } from "@/core/api/products-api";
import { Product } from "../interfaces/product.interface";

export const updateCreateProduct = (product: Partial<Product>) => {
    product.stock = isNaN(Number(product.stock)) ? 0 : Number(product.stock)
    product.price = isNaN(Number(product.price)) ? 0 : Number(product.price)

    if (product.id && product.id !== 'new') {
        return updateProduct(product)
    }

    return createProduct(product)

}

async function updateProduct(product: Partial<Product>) {
    const { id, images = [], user, ...rest } = product;
    try {
        const { data } = await productsApi.patch<Product>(`/products/${id}`, {
            ...rest,
        })
        return data;
    } catch (e) {
        throw new Error("error when updating product");
    }
}

async function createProduct(product: Partial<Product>) {
    const { id, images = [], user, ...rest } = product;
    try {
        const { data } = await productsApi.post<Product>('/products', {
            ...rest,
        })
        return data;
    } catch (e) {
        throw new Error("error when creating product");
    }
}

