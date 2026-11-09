import React from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity } from 'react-native';
import { useCustomer } from '../context/CustomerContext';
import { COLORS, SPACING, RADIUS } from '../theme/theme';

export const VehicleSwitcherModal: React.FC = () => {
  const {
    vehicles,
    currentVehicle,
    setCurrentVehicle,
    vehicleSwitcherOpen,
    setVehicleSwitcherOpen,
    setAddVehicleModalOpen,
  } = useCustomer();

  return (
    <Modal visible={vehicleSwitcherOpen} transparent animationType="fade">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => setVehicleSwitcherOpen(false)}
      >
        <View style={styles.sheet}>
          <View style={styles.dragHandle} />

          <Text style={styles.title}>Switch Vehicle</Text>
          <Text style={styles.subtitle}>
            Service packages and wash rates adjust automatically to vehicle size
          </Text>

          <View style={styles.vehicleList}>
            {vehicles.map(v => {
              const isSelected = currentVehicle ? v.id === currentVehicle.id : false;

              return (
                <TouchableOpacity
                  key={v.id}
                  onPress={() => {
                    setCurrentVehicle(v);
                    setVehicleSwitcherOpen(false);
                  }}
                  style={[styles.vehicleCard, isSelected && styles.vehicleCardActive]}
                >
                  <View style={styles.vehicleIconCircle}>
                    <Text style={{ fontSize: 20 }}>{v.type === 'Bike' ? '🏍️' : '🚗'}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.cardName}>{v.name}</Text>
                    <Text style={styles.cardReg}>{v.reg} • {v.type}</Text>
                  </View>
                  <View style={[styles.radio, isSelected && styles.radioActive]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            onPress={() => {
              setVehicleSwitcherOpen(false);
              setAddVehicleModalOpen(true);
            }}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>+ Add Another Vehicle</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 31, 54, 0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    paddingBottom: 36,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.line,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.ink,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.inkMuted,
    marginTop: 2,
    marginBottom: SPACING.lg,
  },
  vehicleList: {
    gap: SPACING.sm,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  vehicleCardActive: {
    backgroundColor: COLORS.brandSoft,
    borderColor: COLORS.brand,
  },
  vehicleIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.ink,
  },
  cardReg: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.inkMuted,
    marginTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: COLORS.brand,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.brand,
  },
  addButton: {
    marginTop: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.brand,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.brand,
  },
});
