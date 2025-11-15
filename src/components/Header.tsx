import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Menu } from 'lucide-react-native';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigation = useNavigation();

  const openDrawer = () => {
    try {
      // Tenta múltiplas abordagens para abrir o drawer
      if (navigation.getParent?.()?.openDrawer) {
        navigation.getParent().openDrawer();
      } else if (navigation.openDrawer) {
        // @ts-ignore
        navigation.openDrawer();
      } else {
        // Último recurso: dispatcha ação diretamente
        navigation.dispatch(DrawerActions.openDrawer());
      }
    } catch (error) {
      console.log('Erro ao abrir drawer:', error);
      // Fallback: dispatcha ação
      navigation.dispatch(DrawerActions.openDrawer());
    }
  };

  return (
    <View style={styles.container}>
      {Platform.OS === 'android' && (
        <TouchableOpacity 
          style={styles.leftButton} 
          onPress={openDrawer} 
          accessibilityLabel="Abrir menu"
          accessibilityHint="Toque para abrir o menu lateral"
        >
          <Menu size={26} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#18181B',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  leftButton: {
    position: 'absolute',
    left: 16,
    top: 16,
    padding: 8,
  },
});