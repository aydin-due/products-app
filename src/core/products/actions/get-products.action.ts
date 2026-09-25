import { API_URL, productsApi } from "@/core/api/products-api"
import { type Product } from "../interfaces/product.interface"

export const getProducts = async (limit = 20, offset = 0) => {
    try {
        const { data } = await productsApi.get<Product[]>('/products', {
            params: {
                limit, offset
            }
        })

        return data.map(product => ({ ...product, images: product.images.map(img => `${API_URL}/files/product/${img}`) }))
    }
    catch (e) {
        throw new Error('unable to load products')
    }
} 