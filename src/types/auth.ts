// Entidades do sistema de autenticação

export interface User {
  id: string;
  nome: string;
  sobrenome: string;
  tipoDocumento: 'CPF' | 'CNPJ';
  cpf?: string;
  cnpj?: string;
  email: string;
  telefone: string;
  endereco: string;
  senha: string; // hash
  createdAt: string;
  updatedAt: string;
}

export interface Shop {
  id: string;
  ownerId: string;
  nomeDaLoja: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  tipoDocumento: 'CPF' | 'CNPJ';
  cpf?: string;
  cnpj?: string;
  telefone: string;
  endereco: string;
}

export interface CreateUserRequest {
  nome: string;
  sobrenome: string;
  tipoDocumento: 'CPF' | 'CNPJ';
  cpf?: string;
  cnpj?: string;
  email: string;
  telefone: string;
  endereco: string;
  senha: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface CreateShopRequest {
  nomeDaLoja: string;
}