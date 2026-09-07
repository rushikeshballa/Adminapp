import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, Platform } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RestaurantProvider, useRestaurants } from './src/context/RestaurantContext';
import { Header } from './src/components/Header';
import { Toast } from './src/components/Toast';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { RestaurantDetailScreen } from './src/screens/RestaurantDetailScreen';
import { RestaurantModal } from './src/components/RestaurantModal';
import { MenuItemModal } from './src/components/MenuItemModal';
import { ExportModal } from './src/components/ExportModal';
import { Restaurant, MenuItem } from './src/types';
import { theme } from './src/theme/colors';

const MainAppContent: React.FC = () => {
  const { activeRestaurant } = useRestaurants();

  // Modal States
  const [restoModalVisible, setRestoModalVisible] = useState(false);
  const [restoToEdit, setRestoToEdit] = useState<Restaurant | null>(null);

  const [menuItemModalVisible, setMenuItemModalVisible] = useState(false);
  const [menuItemToEdit, setMenuItemToEdit] = useState<MenuItem | null>(null);

  const [exportModalVisible, setExportModalVisible] = useState(false);

  const handleOpenAddRestaurant = () => {
    setRestoToEdit(null);
    setRestoModalVisible(true);
  };

  const handleEditRestaurant = (restaurant: Restaurant) => {
    setRestoToEdit(restaurant);
    setRestoModalVisible(true);
  };

  const handleOpenAddMenuItem = () => {
    setMenuItemToEdit(null);
    setMenuItemModalVisible(true);
  };

  const handleEditMenuItem = (item: MenuItem) => {
    setMenuItemToEdit(item);
    setMenuItemModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpoStatusBar style="light" />
      {Platform.OS === 'android' && (
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.cardBg} />
      )}

      {/* Floating Notifications */}
      <Toast />

      {/* Main Top Header */}
      <Header
        onOpenAddRestaurant={handleOpenAddRestaurant}
        onOpenExportModal={() => setExportModalVisible(true)}
      />

      {/* Main Content Area: Dashboard or Restaurant Detail Screen */}
      <View style={styles.body}>
        {activeRestaurant ? (
          <RestaurantDetailScreen
            restaurant={activeRestaurant}
            onEditRestaurant={handleEditRestaurant}
            onOpenAddMenuItem={handleOpenAddMenuItem}
            onEditMenuItem={handleEditMenuItem}
          />
        ) : (
          <DashboardScreen
            onOpenAddRestaurant={handleOpenAddRestaurant}
            onEditRestaurant={handleEditRestaurant}
          />
        )}
      </View>

      {/* Modals */}
      <RestaurantModal
        visible={restoModalVisible}
        onClose={() => {
          setRestoModalVisible(false);
          setRestoToEdit(null);
        }}
        restaurantToEdit={restoToEdit}
      />

      {activeRestaurant && (
        <MenuItemModal
          visible={menuItemModalVisible}
          restaurantId={activeRestaurant.id}
          onClose={() => {
            setMenuItemModalVisible(false);
            setMenuItemToEdit(null);
          }}
          itemToEdit={menuItemToEdit}
        />
      )}

      <ExportModal
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <RestaurantProvider>
        <MainAppContent />
      </RestaurantProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  body: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
});
