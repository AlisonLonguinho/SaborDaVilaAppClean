import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { Download, Database, Settings, Info, FileText, BarChart3, Package } from 'lucide-react-native';
import { exportDatabase } from "../../database/exportDatabase";
import { 
  generateSalesReportPDF, 
  generateInventoryReportPDF, 
  generateSalesProductReportPDF,
  generateSalesExcelData,
  generateInventoryExcelData 
} from "../../services/reportService";
import { Header } from "../../components/Header";
import { Button } from "../../components/Button";

export default function DebugScreen() {
  return (
    <View style={styles.container}>
      <StatusBar translucent style="light" />
      <Header title="Debug & Configurações" />
      
      <ScrollView style={styles.scrollView}>
        {/* Informações sobre o Debug */}
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <Info color="#6366F1" size={24} />
            <Text style={styles.infoTitle}>Sobre esta tela</Text>
          </View>
          <Text style={styles.infoText}>
            Esta é a tela de debug e configurações do aplicativo Sabor da Vila. 
            Aqui você pode exportar o banco de dados, visualizar informações do sistema 
            e realizar operações de manutenção.
          </Text>
        </View>

        {/* Card de Exportação de Banco */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exportar Banco de Dados</Text>
          
          <View style={styles.exportCard}>
            <View style={styles.exportHeader}>
              <Database color="#10B981" size={32} />
              <View style={styles.exportInfo}>
                <Text style={styles.exportTitle}>Banco de Dados SQLite</Text>
                <Text style={styles.exportDescription}>
                  Exportar arquivo SQLite com todas as vendas e produtos
                </Text>
              </View>
            </View>
            
            <Button
              title="Exportar Banco"
              onPress={exportDatabase}
              size="medium"
              icon={<Download color="#10B981" size={20} />}
            />
          </View>
        </View>

        {/* Relatórios em PDF */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Relatórios em PDF</Text>
          
          <View style={styles.reportsContainer}>
            <View style={styles.reportCard}>
              <FileText color="#EF4444" size={24} />
              <Text style={styles.reportTitle}>Vendas</Text>
              <Text style={styles.reportDesc}>Relatório completo de vendas</Text>
              <Button
                title="PDF"
                onPress={generateSalesReportPDF}
                size="small"
              />
            </View>

            <View style={styles.reportCard}>
              <Package color="#F97316" size={24} />
              <Text style={styles.reportTitle}>Estoque</Text>
              <Text style={styles.reportDesc}>Relatório de produtos em estoque</Text>
              <Button
                title="PDF"
                onPress={generateInventoryReportPDF}
                size="small"
              />
            </View>

            <View style={styles.reportCard}>
              <BarChart3 color="#3B82F6" size={24} />
              <Text style={styles.reportTitle}>Por Produto</Text>
              <Text style={styles.reportDesc}>Vendas agrupadas por produto</Text>
              <Button
                title="PDF"
                onPress={generateSalesProductReportPDF}
                size="small"
              />
            </View>
          </View>
        </View>

        {/* Exportar para Excel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exportar para Excel</Text>
          
          <View style={styles.excelContainer}>
            <View style={styles.excelCard}>
              <View style={styles.excelHeader}>
                <FileText color="#059669" size={24} />
                <Text style={styles.excelTitle}>Dados de Vendas</Text>
              </View>
              <Text style={styles.excelDesc}>Exportar todas as vendas em formato CSV para Excel</Text>
              <Button
                title="Exportar CSV"
                onPress={generateSalesExcelData}
                size="medium"
              />
            </View>

            <View style={styles.excelCard}>
              <View style={styles.excelHeader}>
                <Package color="#059669" size={24} />
                <Text style={styles.excelTitle}>Dados de Estoque</Text>
              </View>
              <Text style={styles.excelDesc}>Exportar inventário completo em formato CSV para Excel</Text>
              <Button
                title="Exportar CSV"
                onPress={generateInventoryExcelData}
                size="medium"
              />
            </View>
          </View>
        </View>

        {/* Informações do Sistema */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações do Sistema</Text>
          
          <View style={styles.systemInfo}>
            <View style={styles.systemItem}>
              <Settings color="#6366F1" size={20} />
              <View style={styles.systemItemText}>
                <Text style={styles.systemItemLabel}>Versão do App</Text>
                <Text style={styles.systemItemValue}>1.0.0</Text>
              </View>
            </View>
            
            <View style={styles.systemItem}>
              <Database color="#6366F1" size={20} />
              <View style={styles.systemItemText}>
                <Text style={styles.systemItemLabel}>Banco de Dados</Text>
                <Text style={styles.systemItemValue}>SQLite Local</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
    paddingTop: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  infoSection: {
    backgroundColor: '#18181B',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27272A',
    marginBottom: 24,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  infoText: {
    color: '#A1A1AA',
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  exportCard: {
    backgroundColor: '#18181B',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  exportHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  exportInfo: {
    flex: 1,
    marginLeft: 16,
  },
  exportTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  exportDescription: {
    color: '#A1A1AA',
    fontSize: 14,
  },
  reportsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  reportCard: {
    flex: 1,
    backgroundColor: '#18181B',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27272A',
    alignItems: 'center',
    minHeight: 120,
  },
  reportTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  reportDesc: {
    color: '#A1A1AA',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
  },
  excelContainer: {
    gap: 16,
  },
  excelCard: {
    backgroundColor: '#18181B',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  excelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  excelTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  excelDesc: {
    color: '#A1A1AA',
    fontSize: 14,
    marginBottom: 16,
  },
  systemInfo: {
    backgroundColor: '#18181B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27272A',
    overflow: 'hidden',
  },
  systemItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
  },
  systemItemText: {
    marginLeft: 12,
    flex: 1,
  },
  systemItemLabel: {
    color: '#A1A1AA',
    fontSize: 14,
  },
  systemItemValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
});
