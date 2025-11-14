import * as SQLite from 'expo-sqlite';
import { User, Shop } from '../types/auth';

const db = SQLite.openDatabaseSync('saborDaVila.db');

// Inicializar tabelas de autenticação
export async function initializeAuthTables() {
  try {
    // Tabela de usuários
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        nome TEXT NOT NULL,
        sobrenome TEXT NOT NULL,
        tipoDocumento TEXT NOT NULL CHECK (tipoDocumento IN ('CPF', 'CNPJ')),
        cpf TEXT UNIQUE,
        cnpj TEXT UNIQUE,
        email TEXT NOT NULL UNIQUE,
        telefone TEXT NOT NULL,
        endereco TEXT NOT NULL,
        senha TEXT NOT NULL,
        createdAt TEXT NOT NULL DEFAULT (datetime('now')),
        updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);

    // Tabela de lojas
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS shops (
        id TEXT PRIMARY KEY,
        ownerId TEXT NOT NULL,
        nomeDaLoja TEXT NOT NULL,
        createdAt TEXT NOT NULL DEFAULT (datetime('now')),
        updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (ownerId) REFERENCES users (id) ON DELETE CASCADE
      );
    `);

    // Índices para performance
    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_cpf ON users(cpf);
      CREATE INDEX IF NOT EXISTS idx_users_cnpj ON users(cnpj);
      CREATE INDEX IF NOT EXISTS idx_shops_owner ON shops(ownerId);
    `);

    console.log('✅ Tabelas de autenticação inicializadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inicializar tabelas de autenticação:', error);
    throw error;
  }
}

// Repository para User
export class UserRepository {
  async create(user: Omit<User, 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      await db.runAsync(`
        INSERT INTO users (id, nome, sobrenome, tipoDocumento, cpf, cnpj, email, telefone, endereco, senha)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        user.id,
        user.nome,
        user.sobrenome,
        user.tipoDocumento,
        user.cpf || null,
        user.cnpj || null,
        user.email,
        user.telefone,
        user.endereco,
        user.senha
      ]);
    } catch (error) {
      console.error('❌ Erro ao criar usuário:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await db.getFirstAsync<User>(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return result || null;
    } catch (error) {
      console.error('❌ Erro ao buscar usuário por email:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const result = await db.getFirstAsync<User>(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return result || null;
    } catch (error) {
      console.error('❌ Erro ao buscar usuário por ID:', error);
      throw error;
    }
  }

  async findByCpf(cpf: string): Promise<User | null> {
    try {
      const result = await db.getFirstAsync<User>(
        'SELECT * FROM users WHERE cpf = ?',
        [cpf]
      );
      return result || null;
    } catch (error) {
      console.error('❌ Erro ao buscar usuário por CPF:', error);
      throw error;
    }
  }

  async findByCnpj(cnpj: string): Promise<User | null> {
    try {
      const result = await db.getFirstAsync<User>(
        'SELECT * FROM users WHERE cnpj = ?',
        [cnpj]
      );
      return result || null;
    } catch (error) {
      console.error('❌ Erro ao buscar usuário por CNPJ:', error);
      throw error;
    }
  }

  async update(id: string, updates: Partial<User>): Promise<void> {
    try {
      const fields = Object.keys(updates).filter(key => key !== 'id').map(key => `${key} = ?`).join(', ');
      const values = Object.entries(updates).filter(([key]) => key !== 'id').map(([, value]) => value);
      
      await db.runAsync(`
        UPDATE users SET ${fields}, updatedAt = datetime('now') WHERE id = ?
      `, [...values, id]);
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error);
      throw error;
    }
  }
}

// Repository para Shop
export class ShopRepository {
  async create(shop: Omit<Shop, 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      await db.runAsync(`
        INSERT INTO shops (id, ownerId, nomeDaLoja)
        VALUES (?, ?, ?)
      `, [shop.id, shop.ownerId, shop.nomeDaLoja]);
    } catch (error) {
      console.error('❌ Erro ao criar loja:', error);
      throw error;
    }
  }

  async findByOwnerId(ownerId: string): Promise<Shop[]> {
    try {
      const result = await db.getAllAsync<Shop>(
        'SELECT * FROM shops WHERE ownerId = ? ORDER BY createdAt ASC',
        [ownerId]
      );
      return result || [];
    } catch (error) {
      console.error('❌ Erro ao buscar lojas do usuário:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Shop | null> {
    try {
      const result = await db.getFirstAsync<Shop>(
        'SELECT * FROM shops WHERE id = ?',
        [id]
      );
      return result || null;
    } catch (error) {
      console.error('❌ Erro ao buscar loja por ID:', error);
      throw error;
    }
  }

  async countByOwnerId(ownerId: string): Promise<number> {
    try {
      const result = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM shops WHERE ownerId = ?',
        [ownerId]
      );
      return result?.count || 0;
    } catch (error) {
      console.error('❌ Erro ao contar lojas do usuário:', error);
      throw error;
    }
  }

  async update(id: string, updates: Partial<Shop>): Promise<void> {
    try {
      const fields = Object.keys(updates).filter(key => key !== 'id').map(key => `${key} = ?`).join(', ');
      const values = Object.entries(updates).filter(([key]) => key !== 'id').map(([, value]) => value);
      
      await db.runAsync(`
        UPDATE shops SET ${fields}, updatedAt = datetime('now') WHERE id = ?
      `, [...values, id]);
    } catch (error) {
      console.error('❌ Erro ao atualizar loja:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await db.runAsync('DELETE FROM shops WHERE id = ?', [id]);
    } catch (error) {
      console.error('❌ Erro ao deletar loja:', error);
      throw error;
    }
  }
}