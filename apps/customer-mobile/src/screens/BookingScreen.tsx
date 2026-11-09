import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useCustomer } from '../context/CustomerContext';
import { WashPackageId, ServiceMode } from '../types';
import { COLORS, SPACING, RADIUS } from '../theme/theme';

interface BookingScreenProps {
  pkgId: WashPackageId;
  mode: ServiceMode;
  onBack: () => void;
}

export const BookingScreen: React.FC<BookingScreenProps> = ({
  pkgId,
  mode,
  onBack,
}) => {
  const { selectedVendor, currentVehicle, requestBooking } = useCustomer();
  if (!selectedVendor) return null;

  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>('14:00');
  const [address, setAddress] = useState('Skyline Residency, Technopark Phase 1, Kazhakoottam');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Pay after Service'>('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const days = ['Today', 'Tomorrow', 'Wed 11 Nov'];
  const hours = [9, 10, 11, 12, 14, 15, 16, 17];

  const ti = ['Hatchback', 'Sedan', 'SUV', 'Bike'].indexOf(currentVehicle?.type || 'SUV');
  const basePrice = (selectedVendor?.prices && selectedVendor.prices[pkgId]?.[ti]) || 699;
  const modeFee = mode === 'walkin' ? 0 : ((selectedVendor?.modes && (selectedVendor.modes[mode] as any)?.fee) || 120);
  const platformFee = 19;
  const grandTotal = basePrice + modeFee + platformFee;

  const handleConfirm = async () => {
    if (!selectedSlot) {
      Alert.alert('Time Slot Required', 'Please select a wash appointment time slot.');
      return;
    }
    if (mode !== 'walkin' && !address.trim()) {
      Alert.alert('Address Required', 'Please provide your vehicle pickup or wash address.');
      return;
    }

    setIsSubmitting(true);
    const dayName = days[selectedDayIdx];
    const fullSlot = `${dayName}, ${selectedSlot}`;

    try {
      await requestBooking(pkgId, mode, fullSlot, address.trim());
    } catch (e) {
      Alert.alert('Booking Error', 'Could not send booking request. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Navigation */}
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>‹ Back to Package Details</Text>
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Confirm Appointment</Text>
        <Text style={styles.pageSubtitle}>
          Booking with {selectedVendor?.name || 'Wash Centre'} for your {currentVehicle?.name || 'Vehicle'}
        </Text>

        {/* Order Summary Strip */}
        <View style={styles.summaryBox}>
          <View>
            <Text style={styles.summaryPkg}>
              {pkgId === 'full' ? 'Full Comprehensive Spa' : 'Exterior Foam Wash'}
            </Text>
            <Text style={styles.summaryMode}>
              {mode === 'walkin' ? 'Drive-in At Centre' : mode === 'pickup' ? 'Pick & Drop Service' : 'At Doorstep'}
            </Text>
          </View>
          <Text style={styles.summaryCarBadge}>{currentVehicle?.reg || 'KL-01'}</Text>
        </View>

        {/* Address input if pickup or home */}
        {mode !== 'walkin' && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {mode === 'pickup' ? 'VEHICLE PICKUP & RETURN ADDRESS' : 'DOORSTEP WASH ADDRESS'}
            </Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Flat/House no., Apartment name, Street, Landmark"
              placeholderTextColor={COLORS.inkSubtle}
              multiline
              numberOfLines={2}
              style={styles.addressInput}
            />
          </View>
        )}

        {/* Date Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>APPOINTMENT DATE</Text>
          <View style={styles.dayRow}>
            {days.map((d, idx) => {
              const isSelected = selectedDayIdx === idx;
              return (
                <TouchableOpacity
                  key={d}
                  onPress={() => setSelectedDayIdx(idx)}
                  style={[styles.dayButton, isSelected && styles.dayButtonActive]}
                >
                  <Text style={[styles.dayText, isSelected && styles.dayTextActive]}>{d}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Time Slot Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>AVAILABLE TIME SLOTS</Text>
          <View style={styles.slotsGrid}>
            {hours.map(h => {
              const timeStr = `${h.toString().padStart(2, '0')}:00`;
              const isSelected = selectedSlot === timeStr;

              return (
                <TouchableOpacity
                  key={h}
                  onPress={() => setSelectedSlot(timeStr)}
                  style={[styles.slotButton, isSelected && styles.slotButtonActive]}
                >
                  <Text style={[styles.slotText, isSelected && styles.slotTextActive]}>
                    {timeStr}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SELECT PAYMENT METHOD</Text>
          <View style={styles.payRow}>
            {(['UPI', 'Card', 'Pay after Service'] as const).map(p => {
              const isSelected = paymentMethod === p;
              return (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPaymentMethod(p)}
                  style={[styles.payChip, isSelected && styles.payChipActive]}
                >
                  <Text style={[styles.payChipText, isSelected && styles.payChipTextActive]}>
                    {p}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Itemized Fee Breakdown */}
        <View style={styles.invoiceCard}>
          <Text style={styles.invoiceTitle}>Bill Summary</Text>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Wash Package ({currentVehicle?.type || 'Vehicle'})</Text>
            <Text style={styles.billVal}>₹{basePrice}</Text>
          </View>

          {modeFee > 0 && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Pick & Drop Transit Fee</Text>
              <Text style={styles.billVal}>₹{modeFee}</Text>
            </View>
          )}

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Wheelhaus Platform Fee</Text>
            <Text style={styles.billVal}>₹{platformFee}</Text>
          </View>

          <View style={styles.billTotalRow}>
            <Text style={styles.billTotalLabel}>Total Amount</Text>
            <Text style={styles.billTotalVal}>₹{grandTotal}</Text>
          </View>

          <Text style={styles.invoiceNote}>
            🔒 Charged only after the wash centre formally confirms and accepts.
          </Text>
        </View>
      </ScrollView>

      {/* Confirm Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Payable Total</Text>
          <Text style={styles.bottomAmount}>₹{grandTotal}</Text>
        </View>

        <TouchableOpacity
          disabled={isSubmitting}
          onPress={handleConfirm}
          style={[styles.confirmBtn, isSubmitting && { opacity: 0.6 }]}
        >
          <Text style={styles.confirmBtnText}>
            {isSubmitting ? 'Sending Request...' : 'Send Booking Request ›'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: SPACING.lg, paddingBottom: 110 },
  backButton: { marginBottom: SPACING.sm },
  backText: { fontSize: 13, fontWeight: '800', color: COLORS.brand },
  pageTitle: { fontSize: 20, fontWeight: '900', color: COLORS.ink },
  pageSubtitle: { fontSize: 12, color: COLORS.inkMuted, marginTop: 2, marginBottom: SPACING.md },
  summaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.line,
    marginBottom: SPACING.md,
  },
  summaryPkg: { fontSize: 14, fontWeight: '800', color: COLORS.ink },
  summaryMode: { fontSize: 11, color: COLORS.brand, fontWeight: '700', marginTop: 1 },
  summaryCarBadge: { fontSize: 11, fontWeight: '800', color: COLORS.inkMuted, backgroundColor: COLORS.surfaceSubtle, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  section: { marginBottom: SPACING.md },
  sectionLabel: { fontSize: 10, fontWeight: '800', color: COLORS.inkMuted, letterSpacing: 0.5, marginBottom: 6 },
  addressInput: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 10,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.ink,
    minHeight: 54,
  },
  dayRow: { flexDirection: 'row', gap: 8 },
  dayButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  dayButtonActive: { backgroundColor: COLORS.brand, borderColor: COLORS.brand },
  dayText: { fontSize: 12, fontWeight: '700', color: COLORS.ink },
  dayTextActive: { color: '#fff' },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slotButton: {
    width: '23%',
    paddingVertical: 10,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  slotButtonActive: { backgroundColor: COLORS.brand, borderColor: COLORS.brand },
  slotText: { fontSize: 12, fontWeight: '800', color: COLORS.ink },
  slotTextActive: { color: '#fff' },
  payRow: { flexDirection: 'row', gap: 8 },
  payChip: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  payChipActive: { backgroundColor: COLORS.ink, borderColor: COLORS.ink },
  payChipText: { fontSize: 11, fontWeight: '700', color: COLORS.ink },
  payChipTextActive: { color: '#fff' },
  invoiceCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.line,
    marginTop: SPACING.sm,
  },
  invoiceTitle: { fontSize: 14, fontWeight: '800', color: COLORS.ink, marginBottom: 10 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  billLabel: { fontSize: 12, color: COLORS.inkMuted },
  billVal: { fontSize: 12, fontWeight: '700', color: COLORS.ink },
  billTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
    borderStyle: 'dashed',
    marginTop: 8,
    paddingTop: 8,
  },
  billTotalLabel: { fontSize: 14, fontWeight: '900', color: COLORS.ink },
  billTotalVal: { fontSize: 16, fontWeight: '900', color: COLORS.brand },
  invoiceNote: { fontSize: 10, color: COLORS.inkSubtle, textAlign: 'center', marginTop: 10 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomLabel: { fontSize: 10, color: COLORS.inkSubtle },
  bottomAmount: { fontSize: 18, fontWeight: '900', color: COLORS.ink },
  confirmBtn: {
    backgroundColor: COLORS.brand,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
  },
  confirmBtnText: { fontSize: 13, fontWeight: '800', color: '#fff' },
});
