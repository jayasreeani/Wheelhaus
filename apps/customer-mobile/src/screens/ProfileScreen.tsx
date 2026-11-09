import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../theme/theme';

export const ProfileScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Card */}
      <View style={styles.userCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>AM</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.userName}>Arjun Menon</Text>
          <Text style={styles.userPhone}>+91 98950 00000 • Verified</Text>
          <Text style={styles.userLocation}>Technopark Phase 1, Trivandrum</Text>
        </View>
      </View>

      {/* WashPass Subscription Membership Banner */}
      <View style={styles.passCard}>
        <View style={styles.passHeader}>
          <Text style={styles.passTag}>★ WHEELHAUS WASHPASS</Text>
          <Text style={styles.passComingSoon}>Launching Phase 2</Text>
        </View>
        <Text style={styles.passTitle}>Unlimited shine with zero platform fees</Text>
        <Text style={styles.passSub}>
          Includes 2 exterior snow foam washes + 1 deep interior vacuum every month for just ₹999/mo.
        </Text>
      </View>

      {/* Saved Addresses */}
      <Text style={styles.sectionTitle}>Saved Addresses</Text>
      <View style={styles.addressList}>
        <View style={styles.addressCard}>
          <Text style={styles.addressType}>🏠 Home</Text>
          <Text style={styles.addressText}>Skyline Residency, Kazhakoottam, Trivandrum</Text>
        </View>
        <View style={styles.addressCard}>
          <Text style={styles.addressType}>🏢 Office</Text>
          <Text style={styles.addressText}>Technopark Phase 1, Gate 2, Trivandrum</Text>
        </View>
      </View>

      {/* Help & Support */}
      <Text style={[styles.sectionTitle, { marginTop: SPACING.lg }]}>Help & Legal</Text>
      <View style={styles.menuCard}>
        <TouchableOpacity
          onPress={() => Alert.alert('Customer Care', 'Helpline: +91 98470 00000\nEmail: support@wheelhaus.in')}
          style={styles.menuRow}
        >
          <Text style={styles.menuLabel}>📞 24x7 Customer Support & Assistance</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Alert.alert('Cancellation Policy', 'Bookings can be cancelled free of charge before the centre starts vehicle transit or wash.')}
          style={styles.menuRow}
        >
          <Text style={styles.menuLabel}>🛡️ Cancellation & Refund Policy</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Alert.alert('Privacy Policy', 'Your vehicle photos and location are strictly encrypted for detailing dispatch only.')}
          style={[styles.menuRow, { borderBottomWidth: 0 }]}
        >
          <Text style={styles.menuLabel}>📜 Terms of Service & Privacy Policy</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.versionText}>Wheelhaus Mobile • Version 1.0.0 (Production Release)</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: SPACING.lg, paddingBottom: 100 },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.line,
    marginBottom: SPACING.md,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '900', color: COLORS.brand },
  userName: { fontSize: 18, fontWeight: '900', color: COLORS.ink },
  userPhone: { fontSize: 12, fontWeight: '700', color: COLORS.good, marginTop: 1 },
  userLocation: { fontSize: 11, color: COLORS.inkMuted, marginTop: 1 },
  passCard: {
    backgroundColor: COLORS.ink,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  passHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  passTag: { fontSize: 10, fontWeight: '900', color: COLORS.brandHi, letterSpacing: 0.5 },
  passComingSoon: { fontSize: 9, fontWeight: '700', color: COLORS.sun, backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  passTitle: { fontSize: 15, fontWeight: '900', color: '#fff', marginTop: 2 },
  passSub: { fontSize: 11, color: COLORS.inkSubtle, marginTop: 4, lineHeight: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.ink, marginBottom: SPACING.sm },
  addressList: { gap: SPACING.sm },
  addressCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  addressType: { fontSize: 12, fontWeight: '800', color: COLORS.ink },
  addressText: { fontSize: 11, color: COLORS.inkMuted, marginTop: 2 },
  menuCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.line,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lineLight,
  },
  menuLabel: { fontSize: 12, fontWeight: '700', color: COLORS.ink },
  menuArrow: { fontSize: 16, color: COLORS.inkSubtle },
  versionText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.inkSubtle,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
});
