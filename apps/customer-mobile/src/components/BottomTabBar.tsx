import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useCustomer } from '../context/CustomerContext';
import { CustomerTab } from '../types';
import { COLORS, SPACING } from '../theme/theme';

export const BottomTabBar: React.FC = () => {
  const { activeTab, setActiveTab, activeBooking } = useCustomer();

  const tabs: { key: CustomerTab; label: string; icon: string }[] = [
    { key: 'explore', label: 'Explore', icon: '✨' },
    { key: 'bookings', label: 'Bookings', icon: '🚗' },
    { key: 'garage', label: 'My Garage', icon: '🔑' },
    { key: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map(t => {
        const isActive = activeTab === t.key;
        const hasLiveBadge = t.key === 'bookings' && activeBooking && !['completed', 'rejected', 'expired'].includes(activeBooking.status);

        return (
          <TouchableOpacity
            key={t.key}
            onPress={() => setActiveTab(t.key)}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrap}>
              <Text style={[styles.iconText, isActive && styles.iconActive]}>{t.icon}</Text>
              {hasLiveBadge && <View style={styles.badgeDot} />}
            </View>
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconWrap: {
    position: 'relative',
  },
  iconText: {
    fontSize: 20,
    opacity: 0.6,
  },
  iconActive: {
    opacity: 1,
  },
  badgeDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.brand,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.inkMuted,
    marginTop: 2,
  },
  tabLabelActive: {
    color: COLORS.brand,
  },
});
