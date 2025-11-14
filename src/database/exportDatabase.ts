import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Alert } from 'react-native';

const DB_NAME = "saborDaVila.db";

// Caminhos dentro do sandbox do Expo
const DB_SOURCE_PATH = `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;
const DB_EXPORT_PATH = `${FileSystem.documentDirectory}${DB_NAME}`;

export async function exportDatabase(): Promise<void> {
  try {
    // Verifica se o banco existe na pasta SQLite
    const sourceInfo = await FileSystem.getInfoAsync(DB_SOURCE_PATH);

    if (!(sourceInfo as any).exists) {
      console.log("❌ Banco não encontrado em:", DB_SOURCE_PATH);
      Alert.alert("Erro", "Banco não encontrado. Execute alguma operação para criá-lo.");
      return;
    }

    // Copia o banco para fora da pasta SQLite (obrigatório para compartilhar)
    await FileSystem.copyAsync({
      from: DB_SOURCE_PATH,
      to: DB_EXPORT_PATH,
    });

    console.log("📦 Banco exportado para:", DB_EXPORT_PATH);
    
    // Verifica se o compartilhamento está disponível
    const sharingAvailable = await Sharing.isAvailableAsync();
    
    if (!sharingAvailable) {
      Alert.alert(
        "Sucesso", 
        `Banco exportado com sucesso!\nLocal: ${DB_EXPORT_PATH}`,
        [{ text: "OK" }]
      );
      return;
    }

    // Compartilha o arquivo
    await Sharing.shareAsync(DB_EXPORT_PATH, {
      mimeType: "application/octet-stream",
      dialogTitle: "Compartilhar banco de dados",
      UTI: "public.data",
    });

  } catch (error) {
    console.error("❌ Erro ao exportar banco:", error);
  }
}
