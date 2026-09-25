import { API_URL, productsApi } from "@/core/api/products-api";
import { Gender, type Product } from "../interfaces/product.interface";

const emptyProduct: Product = {
    id: '',
    title: 'new product',
    description: '',
    price: 0,
    images: [],
    slug: '',
    gender: Gender.Kid,
    sizes: [],
    stock: 0,
    tags: []
}

export const getProductById = async (id: string): Promise<Product> => {
    if (id === 'new') return emptyProduct;

    try {
        const { data } = await productsApi.get<Product>(`/products/${id}`)
        return {
            ...data, images: data.images.map(img => `${API_URL}/files/product/${img}`)
        }
    }
    catch (e) {
        throw new Error(`unable to load product ${id}`)
    }
} 