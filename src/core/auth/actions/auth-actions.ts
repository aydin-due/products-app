import { productsApi } from "../api/products-api"
import { User } from "../interfaces/user"

export interface AuthResponse {
    id: string
    email: string
    fullName: string
    isActive: boolean
    roles: string[]
    token: string
}

const returnUserToken = (data: AuthResponse): { user: User; token: string } => {
    // const { id, email, fullName, isActive, roles, token } = data
    // const user: User = {
    //     id, email, fullName, isActive, roles
    // }

    const { token, ...user } = data;
    return { user, token }
}

export const authLogin = async (email: string, password: string) => {
    email = email.toLowerCase()
    try {
        const { data } = await productsApi.post<AuthResponse>('/auth/login', { email, password })
        return returnUserToken(data)
    } catch (e) {
        console.log(e)
        return null
    }
}

export const authCheckStatus = async () => {
    try {
        console.log('check status action')
        const { data } = await productsApi.get<AuthResponse>('/auth/check-status')
        console.log('check status res')
        return returnUserToken(data)
    } catch (e) {
        console.log(e)
        return null
    }
}