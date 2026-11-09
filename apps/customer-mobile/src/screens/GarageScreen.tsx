import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useCustomer } from '../context/CustomerContext';
import { COLORS, SPACING, RADIUS } from '../theme/theme';

export const GarageScreen: React.FC = () => {
  const { vehicles, currentVehicle, setCurrentVehicle, setAddVehicleModalOpen } = useCustomer();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>My Garage</Text>
      <Text style={styles.subtitle}>
        Manage your registered vehicles. Service packages automatically calibrate to your selected ride.
      </Text>

      <View style={styles.list}>
        {vehicles.map(v => {
          const isSelected = currentVehicle ? v.id === currentVehicle.id : false;

          return (
            <TouchableOpacity
              key={v.id}
              onPress={() => setCurrentVehicle(v)}
              style={[styles.card, isSelected && styles.cardActive]}
              activeOpacity={0.8}
            >
              <View style={styles.avatarCircle}>
                <Text style={{ fontSize: 24 }}>{v.type === 'Bike' ? '🏍️' : '🚗'}</Text>
              </View>

              <View style={styles.infoCol}>
                <View style={styles.topRow}>
                  <Text style={styles.vehicleName}>{v.name}</Text>
                  {isSelected && (
                    <View style={styles.activeTag}>
                      <Text style={styles.activeTagText}>ACTIVE SELECTION</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.regNumber}>{v.reg}</Text>
                <Text style={styles.typeTag}>Classification: {v.type}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        onPress={() => setAddVehicleModalOpen(true)}
        style={styles.addBtn}
        activeOpacity={0.8}
      >
        <Text style={styles.addBtnText}>+ Add Vehicle to Garage</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: SPACING.lg, paddingBottom: 100 },
  title: { fontSize: 20, fontWeight: '900', color: COLORS.ink },
  subtitle: { fontSize: 12, color: COLORS.inkMuted, marginTop: 2, marginBottom: SPACING.lg },
  list: { gap: SPACING.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.line,
  },
  cardActive: {
    borderColor: COLORS.brand,
    backgroundColor: '#fffaf6',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: { flex: 1, marginLeft: 12 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  vehicleName: { fontSize: 15, fontWeight: '800', color: COLORS.ink },
  activeTag: {
    backgroundColor: COLORS.brandSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activeTagText: { fontSize: 8, fontWeight: '900', color: COLORS.brand },
  regNumber: { fontSize: 12, fontWeight: '700', color: COLORS.inkMuted, marginTop: 2 },
  typeTag: { fontSize: 10, color: COLORS.inkSubtle, marginTop: 2 },
  addBtn: {
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.brand,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  addBtnText: { fontSize: 13, fontWeight: '800', color: COLORS.brand },
});
