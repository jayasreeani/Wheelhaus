import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useCustomer } from '../context/CustomerContext';
import { COLORS, SPACING, RADIUS } from '../theme/theme';

export const Header: React.FC = () => {
  const { currentVehicle, setVehicleSwitcherOpen } = useCustomer();

  return (
    <View style={styles.container}>
      {/* Top Location Bar */}
      <View style={styles.locationRow}>
        <View style={styles.locationLeft}>
          <Text style={styles.locationPin}>📍</Text>
          <View>
            <View style={styles.cityPill}>
              <Text style={styles.cityText}>Kazhakoottam, Technopark</Text>
              <Text style={styles.downArrow}>▾</Text>
            </View>
            <Text style={styles.subLocation}>Phase 1, NH-66 Bypass, Trivandrum</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setVehicleSwitcherOpen(true)}
          style={styles.vehicleChip}
          activeOpacity={0.8}
        >
          <Text style={styles.vehicleEmoji}>
            {currentVehicle.type === 'Bike' ? '🏍️' : '🚗'}
          </Text>
          <View>
            <Text style={styles.vehicleName} numberOfLines={1}>
              {currentVehicle.name}
            </Text>
            <Text style={styles.vehicleReg}>{currentVehicle.reg}</Text>
          </View>
          <Text style={styles.vehicleChevron}>›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationPin: {
    fontSize: 18,
    marginRight: 6,
  },
  cityPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.ink,
  },
  downArrow: {
    fontSize: 10,
    color: COLORS.inkMuted,
    marginLeft: 3,
  },
  subLocation: {
    fontSize: 10,
    color: COLORS.inkMuted,
    marginTop: 1,
  },
  vehicleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brandSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.brandLine,
    maxWidth: 160,
  },
  vehicleEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  vehicleName: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.brand,
  },
  vehicleReg: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.inkMuted,
  },
  vehicleChevron: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.brand,
    marginLeft: 4,
  },
});
