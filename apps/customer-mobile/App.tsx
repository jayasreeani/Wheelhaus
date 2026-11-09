import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import { CustomerProvider, useCustomer } from './src/context/CustomerContext';
import { Header } from './src/components/Header';
import { BottomTabBar } from './src/components/BottomTabBar';
import { VehicleSwitcherModal } from './src/components/VehicleSwitcherModal';
import { AddVehicleModal } from './src/components/AddVehicleModal';

import { HomeScreen } from './src/screens/HomeScreen';
import { VendorDetailScreen } from './src/screens/VendorDetailScreen';
import { BookingScreen } from './src/screens/BookingScreen';
import { TrackingScreen } from './src/screens/TrackingScreen';
import { BookingsScreen } from './src/screens/BookingsScreen';
import { GarageScreen } from './src/screens/GarageScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

import { WashPackageId, ServiceMode } from './src/types';
import { COLORS } from './src/theme/theme';

function MainNavigator() {
  const {
    activeTab,
    selectedVendor,
    setSelectedVendor,
  } = useCustomer();

  const [bookingStep, setBookingStep] = useState<{
    pkgId: WashPackageId;
    mode: ServiceMode;
  } | null>(null);

  const renderContent = () => {
    // If user is inside Booking flow
    if (bookingStep) {
      return (
        <BookingScreen
          pkgId={bookingStep.pkgId}
          mode={bookingStep.mode}
          onBack={() => setBookingStep(null)}
        />
      );
    }

    // If user tapped a centre and is viewing packages & reviews
    if (selectedVendor) {
      return (
        <VendorDetailScreen
          onProceedToBooking={(pkg, mode) => setBookingStep({ pkgId: pkg, mode })}
          onBack={() => setSelectedVendor(null)}
        />
      );
    }

    // Otherwise render active bottom tab
    switch (activeTab) {
      case 'explore':
        return <HomeScreen />;
      case 'bookings':
        return <TrackingScreen />;
      case 'garage':
        return <GarageScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.card} />
      <Header />
      <View style={styles.screenArea}>
        {renderContent()}
      </View>
      <BottomTabBar />
      <VehicleSwitcherModal />
      <AddVehicleModal />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <CustomerProvider>
      <MainNavigator />
    </CustomerProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  screenArea: {
    flex: 1,
  },
});
