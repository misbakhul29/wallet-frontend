// src/types/index.ts

export interface User {
  id: string
  username: string
  // Jangan sertakan password di sini untuk keamanan
}

export interface Wallet {
  id: string
  userId: string
  type: "dodi" | "dudi" | "codi" // Tambahkan 'type' untuk membedakan
  balance: number
}

export interface Transaction {
  id: string
  sourceWalletType: "dodi" | "dudi" | "codi"
  sourceWalletId: string
  type: "credit" | "debit"
  amount: number
  description: string | null
  createdAt: string // Tanggal biasanya string dari API, lalu di-parse
  senderWalletType?: string | null
  senderWalletId?: string | null
  receiverWalletType?: string | null
  receiverWalletId?: string | null
  // Relasi eksplisit dari backend jika ada, tambahkan di sini
  dodiWalletId?: string | null
  DodiWallet?: Wallet | null // Contoh jika ingin menginclude wallet object
  dudiWalletId?: string | null
  DudiWallet?: Wallet | null
  codiWalletId?: string | null
  CodiWallet?: Wallet | null
}

export interface LoginResponse {
  message: string
  user?: User
  error?: string
}
