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

const prepImages = async (images: string[]): Promise<string[]> => {
    const fileImages = images.filter((img) => img.includes('file'))
    const currentImages = images.filter((img) => !img.includes('file'))

    if (fileImages.length > 0) {
        const uploadPromises = fileImages.map(img => uploadImage(img))
        const uploadedImages = await Promise.all(uploadPromises)
        currentImages.push(...uploadedImages)
    }

    return currentImages.map(img => img.split('/').pop() ?? '');
}

const uploadImage = async (image: string): Promise<string> => {
    const formData = new FormData() as any;
    formData.append('file', {
        uri: image,
        type: 'image/jpeg',
        name: image.split('/').pop(),
    })

    const { data } = await productsApi.post<{
        image: string
    }>('/files/product',
        formData,
        {
            headers: {
                'Content-Type': 'multiplart/form-data'
            }
        }
    )

    return data.image;
}

async function updateProduct(product: Partial<Product>) {
    const { id, images = [], user, ...rest } = product;
    try {
        const checkedImages = await prepImages(images)
        const { data } = await productsApi.patch<Product>(`/products/${id}`, {
            ...rest,
            images: checkedImages
        })
        return data;
    } catch (e) {
        throw new Error("error when updating product");
    }
}

async function createProduct(product: Partial<Product>) {
    const { id, images = [], user, ...rest } = product;
    try {
        const checkedImages = await prepImages(images)
        const { data } = await productsApi.post<Product>('/products', {
            ...rest,
            imaages: checkedImages
        })
        return data;
    } catch (e) {
        throw new Error("error when creating product");
    }
}

