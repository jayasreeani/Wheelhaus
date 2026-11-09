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

export const BookingsScreen: React.FC = () => {
  const { bookingsHistory, openBookingTracking, setActiveTab } = useCustomer();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>My Wash History</Text>
      <Text style={styles.subtitle}>Track active bookings or view past vehicle spa receipts</Text>

      {bookingsHistory.map(b => (
        <TouchableOpacity
          key={b.id}
          onPress={() => openBookingTracking(b.id)}
          style={styles.card}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.vendorName}>{b.vendorName}</Text>
              <Text style={styles.orderId}>ORDER WK-{b.id} • {b.carType}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>{b.status.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.middleRow}>
            <Text style={styles.packageName}>{b.packageName}</Text>
            <Text style={styles.totalPrice}>₹{b.total}</Text>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.slotText}>📅 {b.slot}</Text>
            <Text style={styles.trackLink}>View Live Details ›</Text>
          </View>
        </TouchableOpacity>
      ))}

      {bookingsHistory.length === 0 && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>🧾</Text>
          <Text style={styles.emptyTitle}>No Bookings Found</Text>
          <Text style={styles.emptySub}>You haven't scheduled any wash appointments yet.</Text>
          <TouchableOpacity onPress={() => setActiveTab('explore')} style={styles.bookNowBtn}>
            <Text style={styles.bookNowText}>Book a Wash Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: SPACING.lg, paddingBottom: 100 },
  title: { fontSize: 20, fontWeight: '900', color: COLORS.ink },
  subtitle: { fontSize: 12, color: COLORS.inkMuted, marginTop: 2, marginBottom: SPACING.lg },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.line,
    marginBottom: SPACING.md,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  vendorName: { fontSize: 15, fontWeight: '800', color: COLORS.ink },
  orderId: { fontSize: 10, fontWeight: '700', color: COLORS.inkSubtle, marginTop: 1 },
  statusBadge: { backgroundColor: COLORS.brandSoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusBadgeText: { fontSize: 9, fontWeight: '800', color: COLORS.brand },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.lineLight,
  },
  packageName: { fontSize: 13, fontWeight: '700', color: COLORS.ink },
  totalPrice: { fontSize: 16, fontWeight: '900', color: COLORS.ink },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  slotText: { fontSize: 11, color: COLORS.inkMuted },
  trackLink: { fontSize: 11, fontWeight: '800', color: COLORS.brand },
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: 32,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  emptyIcon: { fontSize: 40, marginBottom: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: COLORS.ink },
  emptySub: { fontSize: 12, color: COLORS.inkMuted, textAlign: 'center', marginTop: 4, marginBottom: 16 },
  bookNowBtn: { backgroundColor: COLORS.brand, paddingHorizontal: 18, paddingVertical: 10, borderRadius: RADIUS.md },
  bookNowText: { color: '#fff', fontWeight: '800', fontSize: 12 },
});
