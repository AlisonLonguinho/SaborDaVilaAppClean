// src/app/_layout.tsx
import { Platform } from 'react-native';
import { Slot } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Text } from 'react-native';

export default function RootLayout() {
  // iOS: usa as tabs inferiores definidas em src/app/tabs/_layout.tsx
  if (Platform.OS !== 'android') {
    return <Slot />;
  }

  // Android: mostra Drawer (menu hambúrguer) com a tela de Tabs dentro
  return (
    <Drawer
      initialRouteName="tabs"
      // custom drawerContent so we only show the items we want (Dashboard, Vendas, Estoque, Debug)
      drawerContent={(props) => (
        <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: '#18181B', flex: 1 }}>
          <Text style={{ color: '#fff', padding: 16, fontWeight: '700' }}>Menu</Text>
          <DrawerItem
            label="Painel Principal"
            labelStyle={{ color: '#fff' }}
            icon={({ color, size }) => <MaterialIcons name="dashboard" color={color} size={size} />}
            onPress={() => props.navigation.navigate('tabs', { screen: 'index' })}
          />
          <DrawerItem
            label="Vendas"
            labelStyle={{ color: '#fff' }}
            icon={({ color, size }) => <MaterialIcons name="shopping-cart" color={color} size={size} />}
            onPress={() => props.navigation.navigate('tabs', { screen: 'sales' })}
          />
          <DrawerItem
            label="Estoque"
            labelStyle={{ color: '#fff' }}
            icon={({ color, size }) => <MaterialIcons name="inventory" color={color} size={size} />}
            onPress={() => props.navigation.navigate('tabs', { screen: 'inventory' })}
          />
          <DrawerItem
            label="Debug"
            labelStyle={{ color: '#fff' }}
            icon={({ color, size }) => <MaterialIcons name="bug-report" color={color} size={size} />}
            onPress={() => props.navigation.navigate('tabs', { screen: 'DebugScreen' })}
          />
        </DrawerContentScrollView>
      )}
      screenOptions={{
        // escondemos o header nativo porque usamos Header custom nas telas
        headerShown: false,
        headerStyle: { backgroundColor: '#18181B' },
        headerTintColor: '#fff',
        drawerStyle: { backgroundColor: '#18181B' },
        drawerActiveTintColor: '#6366F1',
        drawerInactiveTintColor: '#9CA3AF',
      }}
    >
      {/* screens still need to exist so navigation can resolve them */}
      <Drawer.Screen name="tabs" />
    </Drawer>
  );
}
