// src/app/_layout.tsx
import React from 'react';
import { Slot, Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';

function NavigationLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return <Slot />; // Ou um componente de loading
  }

  // Se não autenticado, mostrar telas de auth
  if (!isAuthenticated) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="create-first-shop" />
        <Stack.Screen name="index" />
      </Stack>
    );
  }

  // Se autenticado, usar Slot para passar controle para as tabs
  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <NavigationLayout />
    </AuthProvider>
  );
}
