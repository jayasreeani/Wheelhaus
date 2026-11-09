import React, { Component, ErrorInfo, ReactNode, useState } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Platform,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { CustomerProvider, useCustomer } from './src/context/CustomerContext';
import { Header } from './src/components/Header';
import { BottomTabBar } from './src/components/BottomTabBar';
import { VehicleSwitcherModal } from './src/components/VehicleSwitcherModal';
import { AddVehicleModal } from './src/components/AddVehicleModal';

import { HomeScreen } from './src/screens/HomeScreen';
import { VendorDetailScreen } from './src/screens/VendorDetailScreen';
import { BookingScreen } from './src/screens/BookingScreen';
import { TrackingScreen } from './src/screens/TrackingScreen';
import { GarageScreen } from './src/screens/GarageScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

import { WashPackageId, ServiceMode } from './src/types';
import { COLORS } from './src/theme/theme';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Wheelhaus Customer Mobile caught error:', error, errorInfo);
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>
            {this.state.error?.message || 'An unexpected issue occurred while loading Wheelhaus.'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={this.handleRestart}>
            <Text style={styles.retryButtonText}>Reload Wheelhaus</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

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
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.card}
        translucent={Platform.OS === 'android'}
      />
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
    <SafeAreaProvider>
      <ErrorBoundary>
        <CustomerProvider>
          <MainNavigator />
        </CustomerProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
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
  errorContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#1a1f36',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
});
