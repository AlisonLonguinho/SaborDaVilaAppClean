import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { Alert } from 'react-native';
import { getRecentSales } from '../database/salesRepository';
import { getProductRepository } from '../database/productRepository';

// Tipos para os dados dos relatórios
interface SalesReportData {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
  date: string;
}

interface InventoryReportData {
  id: number;
  name: string;
  stock: number;
  price: number;
  total_value: number;
}

interface SalesProductSummary {
  product_name: string;
  total_quantity: number;
  total_sales: number;
  average_price: number;
}

// Função para formatar data
const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
};

// Função para formatar moeda
const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

// Gerar relatório de vendas em PDF
export async function generateSalesReportPDF(): Promise<void> {
  try {
    const sales = await getRecentSales();
    
    if (sales.length === 0) {
      Alert.alert('Aviso', 'Não há vendas para gerar o relatório.');
      return;
    }

    // Calcular totais
    const totalSales = sales.reduce((sum: number, sale: any) => sum + sale.total, 0);
    const totalItems = sales.reduce((sum: number, sale: any) => sum + sale.itemsSold, 0);

    // Gerar HTML para o PDF
    const htmlContent = `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; color: #333; margin-bottom: 30px; }
        .summary { background-color: #f5f5f5; padding: 15px; margin-bottom: 20px; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        .total { font-weight: bold; background-color: #e8f5e8; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Sabor da Vila</h1>
        <h2>Relatório de Vendas</h2>
        <p>Gerado em: ${formatDate(new Date())}</p>
      </div>
      
      <div class="summary">
        <h3>Resumo</h3>
        <p><strong>Total de Vendas:</strong> ${formatCurrency(totalSales)}</p>
        <p><strong>Total de Itens Vendidos:</strong> ${totalItems}</p>
        <p><strong>Número de Transações:</strong> ${sales.length}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Preço Unit.</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${sales.map((sale: any) => `
            <tr>
              <td>${formatDate(sale.createdAt || new Date())}</td>
              <td>${sale.product}</td>
              <td>${sale.itemsSold}</td>
              <td>${formatCurrency(sale.total / sale.itemsSold)}</td>
              <td>${formatCurrency(sale.total)}</td>
            </tr>
          `).join('')}
          <tr class="total">
            <td colspan="3"><strong>TOTAL GERAL</strong></td>
            <td><strong>${totalItems}</strong></td>
            <td><strong>${formatCurrency(totalSales)}</strong></td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>`;

    // Gerar PDF
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    // Compartilhar PDF
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Compartilhar Relatório de Vendas',
    });

  } catch (error) {
    console.error('Erro ao gerar relatório de vendas:', error);
    Alert.alert('Erro', 'Não foi possível gerar o relatório de vendas.');
  }
}

// Gerar relatório de estoque em PDF
export async function generateInventoryReportPDF(): Promise<void> {
  try {
    const productRepo = await getProductRepository();
    const products = await productRepo.getAll();
    
    if (products.length === 0) {
      Alert.alert('Aviso', 'Não há produtos para gerar o relatório.');
      return;
    }

    // Calcular totais
    const totalValue = products.reduce((sum, product) => sum + (product.stock * product.price), 0);
    const totalItems = products.reduce((sum, product) => sum + product.stock, 0);

    // Gerar HTML para o PDF
    const htmlContent = `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; color: #333; margin-bottom: 30px; }
        .summary { background-color: #f5f5f5; padding: 15px; margin-bottom: 20px; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #FF6B35; color: white; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        .total { font-weight: bold; background-color: #ffe8e1; }
        .low-stock { background-color: #ffebee; color: #c62828; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Sabor da Vila</h1>
        <h2>Relatório de Estoque</h2>
        <p>Gerado em: ${formatDate(new Date())}</p>
      </div>
      
      <div class="summary">
        <h3>Resumo</h3>
        <p><strong>Valor Total do Estoque:</strong> ${formatCurrency(totalValue)}</p>
        <p><strong>Total de Itens em Estoque:</strong> ${totalItems}</p>
        <p><strong>Número de Produtos:</strong> ${products.length}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Estoque</th>
            <th>Preço Unit.</th>
            <th>Valor Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(product => `
            <tr ${product.stock <= 5 ? 'class="low-stock"' : ''}>
              <td>${product.name}</td>
              <td>${product.stock}</td>
              <td>${formatCurrency(product.price)}</td>
              <td>${formatCurrency(product.stock * product.price)}</td>
              <td>${product.stock <= 5 ? '⚠️ Estoque Baixo' : '✅ OK'}</td>
            </tr>
          `).join('')}
          <tr class="total">
            <td><strong>TOTAL GERAL</strong></td>
            <td><strong>${totalItems}</strong></td>
            <td>-</td>
            <td><strong>${formatCurrency(totalValue)}</strong></td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>`;

    // Gerar PDF
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    // Compartilhar PDF
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Compartilhar Relatório de Estoque',
    });

  } catch (error) {
    console.error('Erro ao gerar relatório de estoque:', error);
    Alert.alert('Erro', 'Não foi possível gerar o relatório de estoque.');
  }
}

// Gerar relatório de vendas por produto em PDF
export async function generateSalesProductReportPDF(): Promise<void> {
  try {
    const sales = await getRecentSales();
    
    if (sales.length === 0) {
      Alert.alert('Aviso', 'Não há vendas para gerar o relatório.');
      return;
    }

    // Agrupar vendas por produto
    const productSummary: { [key: string]: SalesProductSummary } = {};
    
    sales.forEach((sale: any) => {
      if (!productSummary[sale.product]) {
        productSummary[sale.product] = {
          product_name: sale.product,
          total_quantity: 0,
          total_sales: 0,
          average_price: 0,
        };
      }
      
      productSummary[sale.product].total_quantity += sale.itemsSold;
      productSummary[sale.product].total_sales += sale.total;
    });

    // Calcular preço médio
    Object.values(productSummary).forEach(summary => {
      summary.average_price = summary.total_sales / summary.total_quantity;
    });

    // Ordenar por vendas (maior para menor)
    const sortedProducts = Object.values(productSummary).sort((a, b) => b.total_sales - a.total_sales);

    // Calcular totais gerais
    const totalSales = sortedProducts.reduce((sum, product) => sum + product.total_sales, 0);
    const totalQuantity = sortedProducts.reduce((sum, product) => sum + product.total_quantity, 0);

    // Gerar HTML para o PDF
    const htmlContent = `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; color: #333; margin-bottom: 30px; }
        .summary { background-color: #f5f5f5; padding: 15px; margin-bottom: 20px; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #2196F3; color: white; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        .total { font-weight: bold; background-color: #e3f2fd; }
        .rank { text-align: center; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Sabor da Vila</h1>
        <h2>Relatório de Vendas por Produto</h2>
        <p>Gerado em: ${formatDate(new Date())}</p>
      </div>
      
      <div class="summary">
        <h3>Resumo</h3>
        <p><strong>Total de Vendas:</strong> ${formatCurrency(totalSales)}</p>
        <p><strong>Total de Itens Vendidos:</strong> ${totalQuantity}</p>
        <p><strong>Produtos Diferentes:</strong> ${sortedProducts.length}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Ranking</th>
            <th>Produto</th>
            <th>Quantidade Vendida</th>
            <th>Preço Médio</th>
            <th>Total Vendas</th>
            <th>% do Total</th>
          </tr>
        </thead>
        <tbody>
          ${sortedProducts.map((product, index) => `
            <tr>
              <td class="rank">${index + 1}º</td>
              <td>${product.product_name}</td>
              <td>${product.total_quantity}</td>
              <td>${formatCurrency(product.average_price)}</td>
              <td>${formatCurrency(product.total_sales)}</td>
              <td>${((product.total_sales / totalSales) * 100).toFixed(1)}%</td>
            </tr>
          `).join('')}
          <tr class="total">
            <td>-</td>
            <td><strong>TOTAL GERAL</strong></td>
            <td><strong>${totalQuantity}</strong></td>
            <td>-</td>
            <td><strong>${formatCurrency(totalSales)}</strong></td>
            <td><strong>100%</strong></td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>`;

    // Gerar PDF
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    // Compartilhar PDF
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Compartilhar Relatório por Produto',
    });

  } catch (error) {
    console.error('Erro ao gerar relatório por produto:', error);
    Alert.alert('Erro', 'Não foi possível gerar o relatório por produto.');
  }
}

// Gerar dados CSV para Excel (vendas)
export async function generateSalesExcelData(): Promise<void> {
  try {
    const sales = await getRecentSales();
    
    if (sales.length === 0) {
      Alert.alert('Aviso', 'Não há vendas para gerar o arquivo Excel.');
      return;
    }

    // Criar cabeçalho CSV
    const csvHeader = 'Data,Produto,Quantidade,Preço Unitário,Total\n';
    
    // Criar linhas de dados
    const csvData = sales.map((sale: any) => 
      `"${formatDate(sale.createdAt || new Date())}","${sale.product}",${sale.itemsSold},"${formatCurrency(sale.total / sale.itemsSold)}","${formatCurrency(sale.total)}"`
    ).join('\n');

    // Combinar cabeçalho e dados
    const csvContent = csvHeader + csvData;

    // Salvar arquivo
    const fileName = `vendas_${new Date().toISOString().split('T')[0]}.csv`;
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;
    
    await FileSystem.writeAsStringAsync(fileUri, csvContent);

    // Compartilhar arquivo
    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/csv',
      dialogTitle: 'Compartilhar Dados de Vendas (Excel)',
    });

  } catch (error) {
    console.error('Erro ao gerar dados Excel:', error);
    Alert.alert('Erro', 'Não foi possível gerar o arquivo Excel.');
  }
}

// Gerar dados CSV para Excel (estoque)
export async function generateInventoryExcelData(): Promise<void> {
  try {
    const productRepo = await getProductRepository();
    const products = await productRepo.getAll();
    
    if (products.length === 0) {
      Alert.alert('Aviso', 'Não há produtos para gerar o arquivo Excel.');
      return;
    }

    // Criar cabeçalho CSV
    const csvHeader = 'Produto,Estoque,Preço Unitário,Valor Total,Status\n';
    
    // Criar linhas de dados
    const csvData = products.map(product => 
      `"${product.name}",${product.stock},"${formatCurrency(product.price)}","${formatCurrency(product.stock * product.price)}","${product.stock <= 5 ? 'Estoque Baixo' : 'OK'}"`
    ).join('\n');

    // Combinar cabeçalho e dados
    const csvContent = csvHeader + csvData;

    // Salvar arquivo
    const fileName = `estoque_${new Date().toISOString().split('T')[0]}.csv`;
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;
    
    await FileSystem.writeAsStringAsync(fileUri, csvContent);

    // Compartilhar arquivo
    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/csv',
      dialogTitle: 'Compartilhar Dados de Estoque (Excel)',
    });

  } catch (error) {
    console.error('Erro ao gerar dados Excel:', error);
    Alert.alert('Erro', 'Não foi possível gerar o arquivo Excel.');
  }
}