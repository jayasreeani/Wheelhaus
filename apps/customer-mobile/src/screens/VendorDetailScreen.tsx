import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useCustomer } from '../context/CustomerContext';
import { WashPackageId, ServiceMode } from '../types';
import { COLORS, SPACING, RADIUS } from '../theme/theme';

interface VendorDetailScreenProps {
  onProceedToBooking: (pkg: WashPackageId, mode: ServiceMode) => void;
  onBack: () => void;
}

export const VendorDetailScreen: React.FC<VendorDetailScreenProps> = ({
  onProceedToBooking,
  onBack,
}) => {
  const { selectedVendor, currentVehicle } = useCustomer();
  if (!selectedVendor) return null;

  const [chosenPkg, setChosenPkg] = useState<WashPackageId>('full');
  const [chosenMode, setChosenMode] = useState<ServiceMode>('pickup');

  const packagesList: {
    id: WashPackageId;
    title: string;
    duration: string;
    desc: string;
    inclusions: string[];
  }[] = [
    {
      id: 'ext',
      title: 'Exterior Foam Wash',
      duration: '30 mins',
      desc: 'Snow foam pre-wash, high-pressure rinse, alloy degreasing & tyre gloss shine.',
      inclusions: ['Snow Foam Pre-Soak', 'High-Pressure Rinse', 'Microfiber Dry', 'Tyre & Trim Dressing'],
    },
    {
      id: 'int',
      title: 'Interior Deep Vacuum & Polish',
      duration: '45 mins',
      desc: 'Deep upholstery extraction, dashboard UV protection, foot mats washed, and AC vent disinfection.',
      inclusions: ['Upholstery Vacuum', 'Dashboard Conditioning', 'Glass De-Smear', 'Antibacterial Odour Clean'],
    },
    {
      id: 'full',
      title: 'Full Comprehensive Spa Wash',
      duration: '75 mins',
      desc: 'Complete exterior foam wash + underbody blast + full interior deep vacuum & conditioning.',
      inclusions: ['Exterior Snow Foam', 'Underbody Chassis Flush', 'Interior Deep Extraction', 'Engine Bay Blowdown'],
    },
    {
      id: 'cer',
      title: 'Ceramic Sealant & Hydrophobic Polish',
      duration: '150 mins',
      desc: 'Machine polish with 6-month ceramic sealant, hydrophobic water beading, and rain repellant.',
      inclusions: ['Machine Buff Polish', 'Ceramic Sealant Coat', 'Rain-X Windshield Treatment', 'Leather Conditioner'],
    },
  ];

  const ti = ['Hatchback', 'Sedan', 'SUV', 'Bike'].indexOf(currentVehicle?.type || 'SUV');
  const currentPkgPrice = (selectedVendor?.prices && selectedVendor.prices[chosenPkg]?.[ti]) || 699;
  const currentModeFee = chosenMode === 'walkin' ? 0 : ((selectedVendor?.modes && (selectedVendor.modes[chosenMode] as any)?.fee) || 0);
  const grandTotal = currentPkgPrice + currentModeFee;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Top Header Navigation */}
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>‹ All Centres</Text>
        </TouchableOpacity>

        {/* Hero Card */}
        <View style={[styles.heroCard, { backgroundColor: selectedVendor.color }]}>
          <Text style={styles.verifiedTag}>✓ VERIFIED PARTNER CENTRE</Text>
          <Text style={styles.heroName}>{selectedVendor.name}</Text>
          <Text style={styles.heroArea}>{selectedVendor.area}</Text>

          <View style={styles.heroMetaRow}>
            <View style={styles.heroRatingBox}>
              <Text style={styles.heroStar}>★</Text>
              <Text style={styles.heroRatingVal}>{selectedVendor.rating.toFixed(1)}</Text>
              <Text style={styles.heroReviews}>({selectedVendor.reviews} reviews)</Text>
            </View>
            <Text style={styles.heroDist}>• {selectedVendor.dist} km away</Text>
          </View>
        </View>

        {/* Operating Hours & Safety Bar */}
        <View style={styles.infoStrip}>
          <Text style={styles.infoText}>🕒 {selectedVendor.hours}</Text>
          <Text style={styles.infoDivider}>•</Text>
          <Text style={styles.infoText}>🛡️ Scratch-free Guarantee</Text>
        </View>

        {/* Section 1: Service Mode Picker */}
        <Text style={styles.sectionHeader}>How should it be washed?</Text>
        <View style={styles.modePicker}>
          {(['walkin', 'pickup', 'home'] as ServiceMode[]).map(m => {
            const modeObj = selectedVendor.modes[m];
            const isAvail = modeObj?.on;
            const isSelected = chosenMode === m;

            const titles: Record<ServiceMode, string> = {
              walkin: 'At Centre',
              pickup: 'Pick & Drop',
              home: 'At Doorstep',
            };
            const feeText = m === 'walkin' ? 'Free (Drive-in)' : `+₹${(modeObj as any)?.fee || 100}`;

            return (
              <TouchableOpacity
                key={m}
                disabled={!isAvail}
                onPress={() => setChosenMode(m)}
                style={[
                  styles.modeCard,
                  isSelected && styles.modeCardSelected,
                  !isAvail && styles.modeCardDisabled,
                ]}
              >
                <Text style={styles.modeCardTitle}>{titles[m]}</Text>
                <Text style={[styles.modeCardFee, isSelected && { color: COLORS.brand }]}>
                  {isAvail ? feeText : 'Unavailable'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Section 2: Choose Wash Package */}
        <View style={styles.pkgHeaderRow}>
          <Text style={styles.sectionHeader}>Choose Package</Text>
          <Text style={styles.carBadge}>{currentVehicle?.name || 'Vehicle'} ({currentVehicle?.type || 'Car'})</Text>
        </View>

        <View style={styles.pkgList}>
          {packagesList.map(p => {
            const price = selectedVendor.prices[p.id]?.[ti];
            if (!price) return null;
            const isSelected = chosenPkg === p.id;

            return (
              <TouchableOpacity
                key={p.id}
                onPress={() => setChosenPkg(p.id)}
                style={[styles.pkgCard, isSelected && styles.pkgCardSelected]}
                activeOpacity={0.8}
              >
                <View style={styles.pkgTopRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.pkgTitle}>{p.title}</Text>
                    <Text style={styles.pkgDuration}>⏱ {p.duration}</Text>
                  </View>
                  <Text style={styles.pkgPrice}>₹{price}</Text>
                </View>

                <Text style={styles.pkgDesc}>{p.desc}</Text>

                <View style={styles.inclusionsBox}>
                  {p.inclusions.map((inc, i) => (
                    <Text key={i} style={styles.inclusionItem}>✓ {inc}</Text>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Customer Reviews Preview */}
        <Text style={[styles.sectionHeader, { marginTop: SPACING.lg }]}>Customer Reviews</Text>
        <View style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <Text style={styles.reviewAuthor}>Nikhil T. (Technopark Phase 1)</Text>
            <Text style={styles.reviewStars}>★★★★★</Text>
          </View>
          <Text style={styles.reviewBody}>
            "Driver took 4 photos before and after the wash. Creta came back spotless, smells fresh like new!"
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Sticky Booking Action */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomTotalLabel}>Total Estimate</Text>
          <Text style={styles.bottomTotalAmount}>₹{grandTotal}</Text>
          <Text style={styles.bottomTotalNote}>Incl. service & delivery</Text>
        </View>

        <TouchableOpacity
          onPress={() => onProceedToBooking(chosenPkg, chosenMode)}
          style={styles.bookButton}
        >
          <Text style={styles.bookButtonText}>Select Slot & Book ›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: SPACING.lg, paddingBottom: 110 },
  backButton: { marginBottom: SPACING.md },
  backText: { fontSize: 13, fontWeight: '800', color: COLORS.brand },
  heroCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  verifiedTag: { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 0.5, opacity: 0.9 },
  heroName: { fontSize: 20, fontWeight: '900', color: '#fff', marginTop: 2 },
  heroArea: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  heroMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  heroRatingBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  heroStar: { color: COLORS.sun, fontSize: 11, marginRight: 2 },
  heroRatingVal: { color: '#fff', fontWeight: '800', fontSize: 11 },
  heroReviews: { color: 'rgba(255,255,255,0.7)', fontSize: 10, marginLeft: 4 },
  heroDist: { color: 'rgba(255,255,255,0.85)', fontSize: 11, marginLeft: 8 },
  infoStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  infoText: { fontSize: 11, fontWeight: '700', color: COLORS.inkMuted },
  infoDivider: { marginHorizontal: 8, color: COLORS.inkSubtle },
  sectionHeader: { fontSize: 15, fontWeight: '800', color: COLORS.ink, marginBottom: SPACING.sm },
  modePicker: { flexDirection: 'row', gap: 8, marginBottom: SPACING.lg },
  modeCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.line,
  },
  modeCardSelected: { borderColor: COLORS.brand, backgroundColor: COLORS.brandSoft },
  modeCardDisabled: { opacity: 0.4, backgroundColor: COLORS.surfaceSubtle },
  modeCardTitle: { fontSize: 11, fontWeight: '800', color: COLORS.ink },
  modeCardFee: { fontSize: 10, color: COLORS.inkMuted, fontWeight: '700', marginTop: 2 },
  pkgHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: SPACING.sm },
  carBadge: { fontSize: 11, fontWeight: '700', color: COLORS.brand },
  pkgList: { gap: SPACING.md },
  pkgCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.line,
  },
  pkgCardSelected: { borderColor: COLORS.brand, backgroundColor: '#fffaf6' },
  pkgTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pkgTitle: { fontSize: 14, fontWeight: '800', color: COLORS.ink },
  pkgDuration: { fontSize: 10, color: COLORS.brand, fontWeight: '700', marginTop: 1 },
  pkgPrice: { fontSize: 18, fontWeight: '900', color: COLORS.ink },
  pkgDesc: { fontSize: 11, color: COLORS.inkMuted, marginTop: 4, lineHeight: 16 },
  inclusionsBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  inclusionItem: { fontSize: 10, color: COLORS.inkMuted, fontWeight: '600' },
  reviewCard: { backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.line },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewAuthor: { fontSize: 12, fontWeight: '700', color: COLORS.ink },
  reviewStars: { color: COLORS.sun, fontSize: 12 },
  reviewBody: { fontSize: 11, color: COLORS.inkMuted, marginTop: 4, fontStyle: 'italic' },
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
  bottomTotalLabel: { fontSize: 10, color: COLORS.inkSubtle },
  bottomTotalAmount: { fontSize: 18, fontWeight: '900', color: COLORS.ink },
  bottomTotalNote: { fontSize: 9, color: COLORS.inkMuted },
  bookButton: {
    backgroundColor: COLORS.brand,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
  },
  bookButtonText: { fontSize: 13, fontWeight: '800', color: '#fff' },
});
