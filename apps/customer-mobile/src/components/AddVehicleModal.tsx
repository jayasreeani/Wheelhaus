import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useCustomer } from '../context/CustomerContext';
import { VehicleType } from '../types';
import { COLORS, SPACING, RADIUS } from '../theme/theme';

export const AddVehicleModal: React.FC = () => {
  const { addVehicleModalOpen, setAddVehicleModalOpen, addVehicle } = useCustomer();
  const [name, setName] = useState('');
  const [type, setType] = useState<VehicleType>('Sedan');
  const [reg, setReg] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Vehicle Name Required', 'Please enter your car or bike model (e.g. Tata Nexon, Hyundai Creta).');
      return;
    }
    if (!reg.trim()) {
      Alert.alert('Registration Plate Required', 'Please enter your vehicle license plate (e.g. KL-01 CK 2231).');
      return;
    }
    addVehicle(name.trim(), type, reg.trim());
    setName('');
    setReg('');
  };

  return (
    <Modal visible={addVehicleModalOpen} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Add Vehicle to Garage</Text>
          <Text style={styles.subtitle}>Enter vehicle details to customize wash specs & fit</Text>

          {/* Vehicle Type Selector */}
          <Text style={styles.label}>VEHICLE CLASSIFICATION</Text>
          <View style={styles.typeRow}>
            {(['Hatchback', 'Sedan', 'SUV', 'Bike'] as VehicleType[]).map(t => (
              <TouchableOpacity
                key={t}
                onPress={() => setType(t)}
                style={[styles.typeButton, type === t && styles.typeButtonActive]}
              >
                <Text style={[styles.typeButtonText, type === t && styles.typeButtonTextActive]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Vehicle Brand & Model */}
          <Text style={styles.label}>MAKE & MODEL</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Hyundai Creta, Honda City, Royal Enfield"
            placeholderTextColor={COLORS.inkSubtle}
            style={styles.input}
          />

          {/* Number Plate */}
          <Text style={styles.label}>NUMBER PLATE REGISTRATION</Text>
          <TextInput
            value={reg}
            onChangeText={setReg}
            autoCapitalize="characters"
            placeholder="e.g. KL-01 CK 2231"
            placeholderTextColor={COLORS.inkSubtle}
            style={styles.input}
          />

          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Add to My Garage</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setAddVehicleModalOpen(false)}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    paddingBottom: 40,
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
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.inkMuted,
    marginBottom: 6,
    marginTop: 10,
    letterSpacing: 0.5,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  typeButtonActive: {
    backgroundColor: COLORS.brandSoft,
    borderColor: COLORS.brand,
  },
  typeButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.ink,
  },
  typeButtonTextActive: {
    color: COLORS.brand,
  },
  input: {
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.ink,
  },
  saveButton: {
    backgroundColor: COLORS.brand,
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.inkMuted,
  },
});
