import { authCheckStatus, authLogin } from "@/core/auth/actions/auth-actions"
import { User } from "@/core/auth/interfaces/user"
import { SecureStorageAdapter } from "@/helpers/adapters/secure-storage-adapter"
import { create } from 'zustand'

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'checking'

export interface AuthState {
    status: AuthStatus
    token?: string
    user?: User
    login: (email: string, password: string) => Promise<boolean>
    checkStatus: () => Promise<void>
    logout: () => Promise<void>
    changeStatus: (token?: string, user?: User) => Promise<boolean>
}

export const useAuthStore = create<AuthState>()((set, get) => ({
    status: 'checking',
    token: undefined,
    user: undefined,
    changeStatus: async (token?: string, user?: User) => {
        if (!token || !user) {
            SecureStorageAdapter.deleteItem('token')
            set({ status: 'unauthenticated', token: undefined, user: undefined })
            return false
        }

        await SecureStorageAdapter.setItem('token', token)

        set({ status: 'authenticated', token: token, user: user })
        return true
    },
    login: async (email: string, password: string) => {
        const res = await authLogin(email, password)
        return get().changeStatus(res?.token, res?.user)
    },
    checkStatus: async () => {
        const res = await authCheckStatus()
        get().changeStatus(res?.token, res?.user)
    },
    logout: async () => {
        SecureStorageAdapter.deleteItem('token')
        set({ status: 'unauthenticated', token: undefined, user: undefined })
        return
    },
}))