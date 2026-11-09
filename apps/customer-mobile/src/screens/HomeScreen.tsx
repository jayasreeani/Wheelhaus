import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useCustomer } from '../context/CustomerContext';
import { Vendor, ServiceMode } from '../types';
import { COLORS, SPACING, RADIUS } from '../theme/theme';

export const HomeScreen: React.FC = () => {
  const {
    vendors = [],
    currentVehicle,
    setSelectedVendor,
    activeBooking,
    openBookingTracking,
  } = useCustomer();

  const [modeFilter, setModeFilter] = useState<ServiceMode | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate pricing based on vehicle safely
  const getStartingPrice = (v: Vendor) => {
    if (!v || !v.prices) return 349;
    const vType = currentVehicle?.type || 'SUV';
    const ti = ['Hatchback', 'Sedan', 'SUV', 'Bike'].indexOf(vType);
    const valid = Object.values(v.prices)
      .map(arr => (Array.isArray(arr) && ti >= 0 ? arr[ti] : undefined))
      .filter(p => typeof p === 'number');
    return valid.length ? Math.min(...valid) : 349;
  };

  const filtered = (vendors || [])
    .filter(v => {
      if (!v) return false;
      if (modeFilter === 'all') return true;
      return v.modes && v.modes[modeFilter]?.on;
    })
    .filter(v => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const vName = v.name?.toLowerCase() || '';
      const vArea = v.area?.toLowerCase() || '';
      return vName.includes(q) || vArea.includes(q);
    });

  const carName = currentVehicle?.name || 'Your Vehicle';
  const carType = currentVehicle?.type || 'Vehicle';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search car spa, foam wash, or area..."
          placeholderTextColor={COLORS.inkSubtle}
          style={styles.searchInput}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Active Order Banner if order is in progress */}
      {activeBooking && !['completed', 'rejected', 'expired'].includes(activeBooking.status) && (
        <TouchableOpacity
          onPress={() => openBookingTracking(activeBooking.id)}
          style={styles.activeOrderBanner}
          activeOpacity={0.9}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.liveTagRow}>
              <View style={styles.livePulse} />
              <Text style={styles.liveTagText}>ACTIVE SERVICE</Text>
            </View>
            <Text style={styles.activeOrderVendor}>{activeBooking.vendorName}</Text>
            <Text style={styles.activeOrderSub}>
              {activeBooking.packageName} • OTP: <Text style={{ fontWeight: '800' }}>{activeBooking.otp}</Text>
            </Text>
          </View>
          <View style={styles.trackButton}>
            <Text style={styles.trackButtonText}>Track Live ›</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Hero Card */}
      <View style={styles.heroCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heroPre}>TECHNOPARK & KAZHAKOOTTAM</Text>
          <Text style={styles.heroTitle}>Premium vehicle care right at your fingertips</Text>
          <Text style={styles.heroSub}>
            Snow foam wash, deep interior extraction, and doorstep detailing for your {carName}.
          </Text>
        </View>
        <Text style={styles.heroWatermark}>🚿</Text>
      </View>

      {/* Categories Grid */}
      <View style={styles.categoryRow}>
        <TouchableOpacity style={styles.catCard}>
          <Text style={styles.catIcon}>🫧</Text>
          <Text style={styles.catTitle}>Foam Wash</Text>
          <Text style={styles.catPrice}>from ₹349</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.catCard}>
          <Text style={styles.catIcon}>🪑</Text>
          <Text style={styles.catTitle}>Deep Interior</Text>
          <Text style={styles.catPrice}>from ₹499</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.catCard}>
          <Text style={styles.catIcon}>✨</Text>
          <Text style={styles.catTitle}>Ceramic Shine</Text>
          <Text style={styles.catPrice}>from ₹1,499</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.catCard}>
          <Text style={styles.catIcon}>🏠</Text>
          <Text style={styles.catTitle}>Doorstep</Text>
          <Text style={styles.catPrice}>Waterless kit</Text>
        </TouchableOpacity>
      </View>

      {/* Section Title & Filter Chips */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Verified Centres Near You</Text>
        <Text style={styles.sectionCount}>{filtered.length} available</Text>
      </View>

      {/* Mode Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {[
          { key: 'all', label: 'All Modes' },
          { key: 'walkin', label: 'At Centre (Drive-in)' },
          { key: 'pickup', label: 'Pick & Drop Driver' },
          { key: 'home', label: 'At Doorstep' },
        ].map(f => {
          const isActive = modeFilter === f.key;

          return (
            <TouchableOpacity
              key={f.key}
              onPress={() => setModeFilter(f.key as any)}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Vendor Cards List */}
      <View style={styles.vendorList}>
        {filtered.map(v => {
          const fromPrice = getStartingPrice(v);
          const vRating = typeof v.rating === 'number' ? v.rating.toFixed(1) : '4.5';

          return (
            <TouchableOpacity
              key={v.id}
              onPress={() => setSelectedVendor(v)}
              style={styles.vCard}
              activeOpacity={0.8}
            >
              <View style={[styles.vAvatar, { backgroundColor: v.color || COLORS.brand }]}>
                <Text style={styles.vAvatarText}>{v.name ? v.name.substring(0, 2).toUpperCase() : 'WH'}</Text>
              </View>

              <View style={styles.vInfo}>
                <View style={styles.vTopRow}>
                  <Text style={styles.vName} numberOfLines={1}>
                    {v.name}
                  </Text>
                  <View style={styles.vRatingPill}>
                    <Text style={styles.vRatingStar}>★</Text>
                    <Text style={styles.vRatingVal}>{vRating}</Text>
                  </View>
                </View>

                <Text style={styles.vArea}>{v.area}</Text>

                <View style={styles.vMetaRow}>
                  <Text style={styles.vMetaText}>📍 {v.dist || 1.2} km</Text>
                  <Text style={styles.vMetaDot}>•</Text>
                  <Text style={styles.vMetaText}>🕒 {v.hours || '7 AM - 8 PM'}</Text>
                </View>

                {/* Service Modes Tags */}
                <View style={styles.tagRow}>
                  {v.modes?.walkin?.on && <Text style={styles.modeTag}>Centre</Text>}
                  {v.modes?.pickup?.on && <Text style={styles.modeTag}>Pick & Drop</Text>}
                  {v.modes?.home?.on && <Text style={styles.modeTag}>Doorstep</Text>}
                </View>
              </View>

              <View style={styles.vPriceCol}>
                <Text style={styles.vPriceLabel}>Starts at</Text>
                <Text style={styles.vPriceVal}>₹{fromPrice}</Text>
                <Text style={styles.vPriceType}>for {carType}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: SPACING.lg, paddingBottom: 100 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.line,
    marginBottom: SPACING.md,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 13, color: COLORS.ink, fontWeight: '600' },
  clearText: { fontSize: 14, color: COLORS.inkMuted, paddingHorizontal: 4 },
  activeOrderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.ink,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  liveTagRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  livePulse: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.brandHi, marginRight: 6 },
  liveTagText: { fontSize: 9, fontWeight: '800', color: COLORS.brandHi, letterSpacing: 0.5 },
  activeOrderVendor: { fontSize: 14, fontWeight: '800', color: '#fff' },
  activeOrderSub: { fontSize: 11, color: COLORS.inkSubtle, marginTop: 1 },
  trackButton: {
    backgroundColor: COLORS.brand,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
  },
  trackButtonText: { fontSize: 11, fontWeight: '800', color: '#fff' },
  heroCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.ink,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  heroPre: { fontSize: 9, fontWeight: '800', color: COLORS.brandHi, letterSpacing: 0.5, marginBottom: 2 },
  heroTitle: { fontSize: 16, fontWeight: '900', color: '#fff', lineHeight: 22 },
  heroSub: { fontSize: 11, color: COLORS.inkSubtle, marginTop: 4, lineHeight: 16 },
  heroWatermark: { fontSize: 60, position: 'absolute', right: -10, bottom: -10, opacity: 0.15 },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  catCard: {
    width: '23%',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  catIcon: { fontSize: 22, marginBottom: 4 },
  catTitle: { fontSize: 11, fontWeight: '800', color: COLORS.ink },
  catPrice: { fontSize: 9, color: COLORS.brand, fontWeight: '700', marginTop: 2 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: SPACING.sm,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.ink },
  sectionCount: { fontSize: 11, color: COLORS.inkMuted, fontWeight: '600' },
  filterScroll: { flexDirection: 'row', marginBottom: SPACING.md },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.line,
    marginRight: 8,
  },
  filterChipActive: { backgroundColor: COLORS.brand, borderColor: COLORS.brand },
  filterChipText: { fontSize: 11, fontWeight: '700', color: COLORS.inkMuted },
  filterChipTextActive: { color: '#fff' },
  vendorList: { gap: SPACING.sm },
  vCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  vAvatar: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vAvatarText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  vInfo: { flex: 1, marginLeft: 12 },
  vTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  vName: { fontSize: 13, fontWeight: '800', color: COLORS.ink, flex: 1, marginRight: 6 },
  vRatingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.sunSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  vRatingStar: { color: COLORS.sun, fontSize: 10, marginRight: 2 },
  vRatingVal: { color: COLORS.ink, fontWeight: '800', fontSize: 10 },
  vArea: { fontSize: 11, color: COLORS.inkMuted, marginTop: 1 },
  vMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  vMetaText: { fontSize: 10, color: COLORS.inkMuted },
  vMetaDot: { fontSize: 10, color: COLORS.inkSubtle, marginHorizontal: 4 },
  tagRow: { flexDirection: 'row', gap: 4, marginTop: 4 },
  modeTag: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.inkMuted,
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  vPriceCol: { alignItems: 'flex-end', marginLeft: 8 },
  vPriceLabel: { fontSize: 9, color: COLORS.inkSubtle },
  vPriceVal: { fontSize: 16, fontWeight: '900', color: COLORS.ink },
  vPriceType: { fontSize: 9, color: COLORS.brand, fontWeight: '700' },
});
