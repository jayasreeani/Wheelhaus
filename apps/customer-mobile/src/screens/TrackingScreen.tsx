import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import { useCustomer } from '../context/CustomerContext';
import { COLORS, SPACING, RADIUS } from '../theme/theme';

export const TrackingScreen: React.FC = () => {
  const { activeBooking, submitBookingReview, setActiveTab, setSelectedVendor, vendors } = useCustomer();
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!activeBooking) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🚗</Text>
        <Text style={styles.emptyTitle}>No Active Booking</Text>
        <Text style={styles.emptySub}>Select a car wash centre from Explore to schedule a wash.</Text>
        <TouchableOpacity onPress={() => setActiveTab('explore')} style={styles.exploreBtn}>
          <Text style={styles.exploreBtnText}>Find Centres Near Me</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const steps = [
    { key: 'requested', label: '1. Wash Requested' },
    { key: 'accepted', label: '2. Centre Confirmed' },
    { key: 'picked_up', label: '3. Vehicle Collected' },
    { key: 'in_progress', label: '4. Spa Wash in Progress' },
    { key: 'completed', label: '5. Handed Over & Ready' },
  ];

  const getStepIndex = (s: string) => {
    const map: Record<string, number> = {
      requested: 0,
      accepted: 1,
      checked_in: 2,
      picked_up: 2,
      on_the_way: 2,
      in_progress: 3,
      ready: 4,
      out_for_delivery: 4,
      completed: 5,
    };
    return map[s] ?? 0;
  };

  const currentIdx = getStepIndex(activeBooking.status);

  const handleSendReview = async () => {
    await submitBookingReview(activeBooking.id, reviewRating, reviewText);
    setReviewSubmitted(true);
    Alert.alert('Thank You!', 'Your review has been published on the centre page.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <Text style={styles.bookingId}>ORDER WK-{activeBooking.id}</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>{activeBooking.status.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.vendorName}>{activeBooking.vendorName}</Text>
        <Text style={styles.pkgDetails}>
          {activeBooking.packageName} • {activeBooking.mode.toUpperCase()} • {activeBooking.carType}
        </Text>
        <Text style={styles.slotTime}>Scheduled for: {activeBooking.slot}</Text>
      </View>

      {/* 10-Minute SLA Warning for Requested */}
      {activeBooking.status === 'requested' && (
        <View style={styles.slaCard}>
          <Text style={styles.slaIcon}>⏳</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.slaTitle}>Centre Acceptance in Progress</Text>
            <Text style={styles.slaSub}>
              {activeBooking.vendorName} has 10 minutes to review bay capacity and confirm.
            </Text>
          </View>
        </View>
      )}

      {/* Fallback if rejected / expired */}
      {(activeBooking.status === 'rejected' || activeBooking.status === 'expired') && (
        <View style={styles.rejectedCard}>
          <Text style={styles.rejectedTitle}>
            {activeBooking.status === 'rejected' ? 'Slot Unavailable at Centre' : 'Request Expired'}
          </Text>
          <Text style={styles.rejectedSub}>
            Nothing was charged to your card/UPI. You can instantly book at these nearby live spas:
          </Text>

          <View style={{ gap: 8, marginTop: 10 }}>
            {vendors.slice(0, 2).map(alt => (
              <TouchableOpacity
                key={alt.id}
                onPress={() => setSelectedVendor(alt)}
                style={styles.altCard}
              >
                <View>
                  <Text style={styles.altName}>{alt.name}</Text>
                  <Text style={styles.altDist}>★ {alt.rating.toFixed(1)} • {alt.dist} km</Text>
                </View>
                <Text style={styles.altBtn}>Book Here ›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Handover OTP Card */}
      {['accepted', 'picked_up', 'in_progress', 'ready', 'out_for_delivery'].includes(activeBooking.status) && (
        <View style={styles.otpCard}>
          <View>
            <Text style={styles.otpLabel}>HANDOVER OTP CODE</Text>
            <Text style={styles.otpDesc}>
              Share ONLY when meeting the verified driver or collecting car
            </Text>
          </View>
          <Text style={styles.otpCode}>{activeBooking.otp}</Text>
        </View>
      )}

      {/* Driver Contact Card for Pickup */}
      {activeBooking.driver && ['accepted', 'picked_up', 'out_for_delivery'].includes(activeBooking.status) && (
        <View style={styles.driverCard}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverAvatarText}>SK</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.driverName}>{activeBooking.driver.name}</Text>
            <Text style={styles.driverSub}>Assigned Driver • {activeBooking.driver.reg}</Text>
          </View>
          <TouchableOpacity
            onPress={() => Linking.openURL(`tel:${activeBooking.driver?.phone}`)}
            style={styles.callBtn}
          >
            <Text style={styles.callBtnText}>📞 Call Driver</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Vertical Stepper Timeline */}
      <View style={styles.stepperCard}>
        <Text style={styles.stepperTitle}>Service Progression</Text>
        <View style={styles.stepList}>
          {steps.map((st, i) => {
            const isCompleted = i <= currentIdx;
            const isCurrent = i === currentIdx;

            return (
              <View key={st.key} style={styles.stepRow}>
                <View style={[styles.stepBullet, isCompleted && styles.stepBulletDone, isCurrent && styles.stepBulletCurrent]}>
                  <Text style={styles.stepCheck}>{isCompleted ? '✓' : ''}</Text>
                </View>
                <View style={styles.stepTextCol}>
                  <Text style={[styles.stepLabel, isCompleted && styles.stepLabelDone]}>
                    {st.label}
                  </Text>
                  {isCurrent && <Text style={styles.stepNowTag}>In progress right now</Text>}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Post-Wash Rating Modal/Form */}
      {activeBooking.status === 'completed' && (
        <View style={styles.reviewBox}>
          <Text style={styles.reviewTitle}>How did your car look?</Text>
          <Text style={styles.reviewSub}>Rate your detailing service with {activeBooking.vendorName}</Text>

          {reviewSubmitted || activeBooking.review ? (
            <View style={styles.thankYouBox}>
              <Text style={styles.starsDisplay}>{'★'.repeat(activeBooking.review?.stars || reviewRating)}</Text>
              <Text style={styles.thankYouText}>Thank you! Your feedback helps the Technopark community.</Text>
            </View>
          ) : (
            <View>
              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map(star => (
                  <TouchableOpacity key={star} onPress={() => setReviewRating(star)}>
                    <Text style={[styles.starBtn, reviewRating >= star && styles.starBtnActive]}>
                      ★
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                value={reviewText}
                onChangeText={setReviewText}
                placeholder="Share what impressed you (cleanliness, shine, punctuality)..."
                placeholderTextColor={COLORS.inkSubtle}
                multiline
                numberOfLines={2}
                style={styles.reviewInput}
              />

              <TouchableOpacity onPress={handleSendReview} style={styles.submitReviewBtn}>
                <Text style={styles.submitReviewText}>Submit Review</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: SPACING.lg, paddingBottom: 100 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: COLORS.ink },
  emptySub: { fontSize: 12, color: COLORS.inkMuted, textAlign: 'center', marginTop: 4, marginBottom: 20 },
  exploreBtn: { backgroundColor: COLORS.brand, paddingHorizontal: 20, paddingVertical: 12, borderRadius: RADIUS.md },
  exploreBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  headerCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.line,
    marginBottom: SPACING.md,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bookingId: { fontSize: 11, fontWeight: '800', color: COLORS.inkMuted },
  statusPill: { backgroundColor: COLORS.brandSoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusPillText: { fontSize: 10, fontWeight: '800', color: COLORS.brand },
  vendorName: { fontSize: 18, fontWeight: '900', color: COLORS.ink, marginTop: 4 },
  pkgDetails: { fontSize: 12, color: COLORS.inkMuted, marginTop: 2 },
  slotTime: { fontSize: 11, color: COLORS.brand, fontWeight: '700', marginTop: 4 },
  slaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warnSoft,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#fbd5bd',
    marginBottom: SPACING.md,
  },
  slaIcon: { fontSize: 24, marginRight: 10 },
  slaTitle: { fontSize: 12, fontWeight: '800', color: COLORS.warn },
  slaSub: { fontSize: 11, color: COLORS.inkMuted, marginTop: 1 },
  rejectedCard: {
    backgroundColor: COLORS.badSoft,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#f8d7da',
    marginBottom: SPACING.md,
  },
  rejectedTitle: { fontSize: 13, fontWeight: '800', color: COLORS.bad },
  rejectedSub: { fontSize: 11, color: COLORS.inkMuted, marginTop: 2 },
  altCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  altName: { fontSize: 12, fontWeight: '800', color: COLORS.ink },
  altDist: { fontSize: 10, color: COLORS.inkMuted },
  altBtn: { fontSize: 12, fontWeight: '800', color: COLORS.brand },
  otpCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.brandSoft,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.brandLine,
    marginBottom: SPACING.md,
  },
  otpLabel: { fontSize: 10, fontWeight: '800', color: COLORS.brand, letterSpacing: 0.5 },
  otpDesc: { fontSize: 10, color: COLORS.inkMuted, maxWidth: 180, marginTop: 2 },
  otpCode: { fontSize: 24, fontWeight: '900', color: COLORS.brand, letterSpacing: 3 },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.line,
    marginBottom: SPACING.md,
  },
  driverAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.ink, alignItems: 'center', justifyContent: 'center' },
  driverAvatarText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  driverName: { fontSize: 13, fontWeight: '800', color: COLORS.ink },
  driverSub: { fontSize: 11, color: COLORS.inkMuted },
  callBtn: { backgroundColor: COLORS.surfaceSubtle, paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.md },
  callBtnText: { fontSize: 11, fontWeight: '700', color: COLORS.ink },
  stepperCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.line,
    marginBottom: SPACING.md,
  },
  stepperTitle: { fontSize: 14, fontWeight: '800', color: COLORS.ink, marginBottom: SPACING.md },
  stepList: { gap: 14 },
  stepRow: { flexDirection: 'row', alignItems: 'center' },
  stepBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  stepBulletDone: { backgroundColor: COLORS.good, borderColor: COLORS.good },
  stepBulletCurrent: { borderColor: COLORS.brand, backgroundColor: COLORS.brandSoft },
  stepCheck: { fontSize: 11, color: '#fff', fontWeight: '900' },
  stepTextCol: { flex: 1 },
  stepLabel: { fontSize: 12, fontWeight: '600', color: COLORS.inkSubtle },
  stepLabelDone: { color: COLORS.ink, fontWeight: '800' },
  stepNowTag: { fontSize: 10, color: COLORS.brand, fontWeight: '700' },
  reviewBox: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  reviewTitle: { fontSize: 15, fontWeight: '800', color: COLORS.ink },
  reviewSub: { fontSize: 11, color: COLORS.inkMuted, marginTop: 1, marginBottom: 12 },
  starRow: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  starBtn: { fontSize: 26, color: COLORS.line },
  starBtnActive: { color: COLORS.sun },
  reviewInput: {
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: RADIUS.md,
    padding: 10,
    fontSize: 12,
    color: COLORS.ink,
    minHeight: 50,
    marginBottom: 10,
  },
  submitReviewBtn: { backgroundColor: COLORS.brand, paddingVertical: 12, borderRadius: RADIUS.md, alignItems: 'center' },
  submitReviewText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  thankYouBox: { padding: 12, backgroundColor: COLORS.goodSoft, borderRadius: RADIUS.md, alignItems: 'center' },
  starsDisplay: { fontSize: 18, color: COLORS.sun, marginBottom: 4 },
  thankYouText: { fontSize: 11, fontWeight: '700', color: COLORS.good, textAlign: 'center' },
});
