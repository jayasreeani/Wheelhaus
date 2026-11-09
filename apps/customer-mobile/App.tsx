import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  Alert,
} from 'react-native';

const API_BASE_URL = 'http://10.0.2.2:4000/api'; // Android Emulator alias or localhost

export default function CustomerApp() {
  const [vehicles, setVehicles] = useState([
    { id: 'c1', name: 'Hyundai Creta', type: 'SUV', reg: 'KL-01 CK 2231' },
    { id: 'c2', name: 'Maruti Swift', type: 'Hatchback', reg: 'KL-22 M 908' },
    { id: 'c3', name: 'Honda Activa', type: 'Bike', reg: 'KL-01 BW 5520' },
  ]);
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]);

  const [vendors, setVendors] = useState([
    {
      id: 'v1',
      name: 'BlueDrop Car Spa',
      area: 'Kazhakoottam, NH 66 bypass',
      dist: 0.8,
      rating: 4.6,
      reviews: 212,
      hours: '7 AM to 8 PM',
      color: '#c9450c',
      modes: { walkin: { on: true }, pickup: { on: true, fee: 120, radius: 5 }, home: { on: false } },
      prices: { ext: [349, 399, 449, 159], int: [499, 549, 649, 219], full: [699, 799, 899, 299], cer: [1499, 1799, 2199, 799] },
    },
    {
      id: 'v4',
      name: 'Shine Bay Detailing',
      area: 'Kulathoor Junction',
      dist: 3.9,
      rating: 4.8,
      reviews: 301,
      hours: '8 AM to 9 PM',
      color: '#7a3fb0',
      modes: { walkin: { on: true }, pickup: { on: true, fee: 150, radius: 6 }, home: { on: true, fee: 120, radius: 5 } },
      prices: { ext: [449, 499, 549, 199], int: [599, 649, 749, 269], full: [849, 949, 1099, 379], cer: [1699, 1999, 2399, 899] },
    },
  ]);

  const [activeTab, setActiveTab] = useState<'explore' | 'bookings' | 'profile'>('explore');
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);
  const [selectedPkg, setSelectedPkg] = useState('full');
  const [selectedMode, setSelectedMode] = useState('pickup');
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [activeBooking, setActiveBooking] = useState<any | null>(null);

  // Auto-connect to backend API if available
  useEffect(() => {
    fetch(`${API_BASE_URL}/vendors`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setVendors(data);
      })
      .catch(() => {
        // Run with pre-seeded offline data
      });
  }, []);

  const handleBookNow = () => {
    const ti = ['Hatchback', 'Sedan', 'SUV', 'Bike'].indexOf(selectedVehicle.type);
    const base = selectedVendor.prices[selectedPkg][ti];
    const modeFee = selectedMode === 'walkin' ? 0 : 120;
    const total = base + modeFee + 19;
    const newId = Math.floor(1000 + Math.random() * 9000);

    const booking = {
      id: newId,
      vendorName: selectedVendor.name,
      pkgName: selectedPkg === 'full' ? 'Full Wash' : 'Exterior Foam Wash',
      carType: selectedVehicle.type,
      mode: selectedMode,
      slot: 'Today, 14:00',
      total,
      otp: String(Math.floor(1000 + Math.random() * 9000)),
      status: 'requested',
    };

    setActiveBooking(booking);
    setBookingModalVisible(false);
    setSelectedVendor(null);
    setActiveTab('bookings');

    Alert.alert(
      'Wash Requested!',
      `Booking WK-${booking.id} sent to ${selectedVendor.name}. The centre has 10 minutes to accept.`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f6f3ef" />

      {/* Top Mobile App Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>CURRENT VEHICLE</Text>
          <View style={styles.vehiclePill}>
            <Text style={styles.vehicleTitle}>{selectedVehicle.name}</Text>
            <Text style={styles.vehicleReg}>• {selectedVehicle.reg}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            const nextIdx = (vehicles.indexOf(selectedVehicle) + 1) % vehicles.length;
            setSelectedVehicle(vehicles[nextIdx]);
          }}
          style={styles.switchButton}
        >
          <Text style={styles.switchButtonText}>Switch Car</Text>
        </TouchableOpacity>
      </View>

      {/* Main Tab Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'explore' && !selectedVendor && (
          <View>
            <View style={styles.heroBanner}>
              <Text style={styles.heroGreeting}>Hello Arjun 👋</Text>
              <Text style={styles.heroHeadline}>
                Book verified car & bike wash near Technopark
              </Text>
            </View>

            {/* Quick Categories */}
            <View style={styles.quickGrid}>
              <TouchableOpacity style={[styles.quickCard, { backgroundColor: '#c9450c' }]}>
                <Text style={styles.quickIcon}>✨</Text>
                <Text style={styles.quickTextWhite}>Wash</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickCardDisabled}>
                <Text style={styles.quickIcon}>🚨</Text>
                <Text style={styles.quickTextMuted}>SOS</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickCardDisabled}>
                <Text style={styles.quickIcon}>🔧</Text>
                <Text style={styles.quickTextMuted}>Parts</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickCardDisabled}>
                <Text style={styles.quickIcon}>🛍️</Text>
                <Text style={styles.quickTextMuted}>Accessories</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Verified Centres Near You</Text>

            {vendors.map(v => (
              <TouchableOpacity
                key={v.id}
                onPress={() => setSelectedVendor(v)}
                style={styles.vendorCard}
              >
                <View style={[styles.vendorAvatar, { backgroundColor: v.color }]}>
                  <Text style={styles.vendorAvatarText}>{v.name.substring(0, 2).toUpperCase()}</Text>
                </View>
                <View style={styles.vendorInfo}>
                  <Text style={styles.vendorName}>{v.name}</Text>
                  <Text style={styles.vendorArea}>{v.area}</Text>
                  <View style={styles.vendorMeta}>
                    <Text style={styles.ratingText}>★ {v.rating.toFixed(1)}</Text>
                    <Text style={styles.metaDivider}>•</Text>
                    <Text style={styles.distText}>{v.dist} km away</Text>
                  </View>
                </View>
                <View style={styles.priceCol}>
                  <Text style={styles.priceFromLabel}>from</Text>
                  <Text style={styles.priceValue}>₹349</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Vendor Detail View */}
        {selectedVendor && (
          <View style={styles.vendorDetail}>
            <TouchableOpacity onPress={() => setSelectedVendor(null)} style={styles.backButton}>
              <Text style={styles.backButtonText}>‹ Back to centres</Text>
            </TouchableOpacity>

            <View style={[styles.detailHero, { backgroundColor: selectedVendor.color }]}>
              <Text style={styles.detailHeroTitle}>{selectedVendor.name}</Text>
              <Text style={styles.detailHeroSub}>{selectedVendor.area}</Text>
              <Text style={styles.detailHeroMeta}>
                ★ {selectedVendor.rating.toFixed(1)} ({selectedVendor.reviews} reviews) • {selectedVendor.dist} km
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Select Package for {selectedVehicle.type}</Text>

            {['ext', 'int', 'full', 'cer'].map(pkgKey => {
              const titles: Record<string, string> = {
                ext: 'Exterior Snow Foam Wash',
                int: 'Interior Deep Vacuum & Polish',
                full: 'Full Comprehensive Spa Wash',
                cer: 'Ceramic Sealant & Hydrophobic Coat',
              };
              const ti = ['Hatchback', 'Sedan', 'SUV', 'Bike'].indexOf(selectedVehicle.type);
              const p = selectedVendor.prices[pkgKey]?.[ti] || 499;

              return (
                <TouchableOpacity
                  key={pkgKey}
                  onPress={() => setSelectedPkg(pkgKey)}
                  style={[
                    styles.pkgCard,
                    selectedPkg === pkgKey && styles.pkgCardActive,
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.pkgName}>{titles[pkgKey]}</Text>
                    <Text style={styles.pkgDesc}>30-75 mins • High pressure rinse & premium shine</Text>
                  </View>
                  <Text style={styles.pkgPrice}>₹{p}</Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              onPress={() => setBookingModalVisible(true)}
              style={styles.bookCta}
            >
              <Text style={styles.bookCtaText}>Book Wash Appointment</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Active Booking Tracker */}
        {activeTab === 'bookings' && (
          <View>
            <Text style={styles.sectionTitle}>My Active Bookings</Text>
            {activeBooking ? (
              <View style={styles.trackerCard}>
                <View style={styles.trackerHeader}>
                  <Text style={styles.trackerId}>Booking #{activeBooking.id}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>{activeBooking.status.toUpperCase()}</Text>
                  </View>
                </View>

                <Text style={styles.trackerVendor}>{activeBooking.vendorName}</Text>
                <Text style={styles.trackerDetails}>
                  {activeBooking.pkgName} • {activeBooking.mode.toUpperCase()} • {activeBooking.slot}
                </Text>

                {/* Handover OTP Badge */}
                <View style={styles.otpCard}>
                  <View>
                    <Text style={styles.otpLabel}>HANDOVER OTP</Text>
                    <Text style={styles.otpSub}>Share with driver upon vehicle handover</Text>
                  </View>
                  <Text style={styles.otpCode}>{activeBooking.otp}</Text>
                </View>

                {/* Vertical Step Tracker */}
                <View style={styles.stepper}>
                  <Text style={styles.stepActive}>✓ 1. Request Received</Text>
                  <Text style={styles.stepPending}>⏳ 2. Centre Confirmation</Text>
                  <Text style={styles.stepPending}>🚗 3. Vehicle Picked Up</Text>
                  <Text style={styles.stepPending}>✨ 4. Wash in Progress</Text>
                  <Text style={styles.stepPending}>🏁 5. Handover Complete</Text>
                </View>

                <Text style={styles.trackerPrice}>Total: ₹{activeBooking.total}</Text>
              </View>
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No active bookings right now.</Text>
              </View>
            )}
          </View>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <View style={styles.profileView}>
            <View style={styles.userCard}>
              <Text style={styles.userName}>Arjun Menon</Text>
              <Text style={styles.userPhone}>+91 98950 00000</Text>
              <Text style={styles.userLocation}>Technopark Phase 1, Trivandrum</Text>
            </View>

            <Text style={styles.sectionTitle}>Saved Garage Vehicles</Text>
            {vehicles.map(v => (
              <View key={v.id} style={styles.garageCard}>
                <Text style={styles.garageName}>{v.name}</Text>
                <Text style={styles.garageReg}>{v.reg} ({v.type})</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Booking Modal */}
      <Modal visible={bookingModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Your Booking</Text>
            <Text style={styles.modalSub}>
              {selectedVendor?.name} • {selectedVehicle.name}
            </Text>

            <Text style={styles.inputLabel}>Delivery Mode</Text>
            <View style={styles.modeRow}>
              {['walkin', 'pickup', 'home'].map(m => (
                <TouchableOpacity
                  key={m}
                  onPress={() => setSelectedMode(m)}
                  style={[styles.modeButton, selectedMode === m && styles.modeButtonActive]}
                >
                  <Text
                    style={[
                      styles.modeButtonText,
                      selectedMode === m && styles.modeButtonTextActive,
                    ]}
                  >
                    {m === 'walkin' ? 'At Centre' : m === 'pickup' ? 'Pick & Drop' : 'At Home'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity onPress={handleBookNow} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Send Booking Request</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setBookingModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Mobile Tab Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => {
            setActiveTab('explore');
            setSelectedVendor(null);
          }}
          style={styles.navItem}
        >
          <Text style={[styles.navText, activeTab === 'explore' && styles.navTextActive]}>
            Explore
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('bookings')} style={styles.navItem}>
          <Text style={[styles.navText, activeTab === 'bookings' && styles.navTextActive]}>
            Bookings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('profile')} style={styles.navItem}>
          <Text style={[styles.navText, activeTab === 'profile' && styles.navTextActive]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f3ef' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ece6e0',
  },
  headerSubtitle: { fontSize: 10, fontWeight: '700', color: '#5b6078' },
  vehiclePill: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  vehicleTitle: { fontSize: 15, fontWeight: '800', color: '#1a1f36' },
  vehicleReg: { fontSize: 12, fontWeight: '600', color: '#5b6078', marginLeft: 4 },
  switchButton: {
    backgroundColor: '#fff0e5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  switchButtonText: { color: '#c9450c', fontWeight: '700', fontSize: 12 },
  scrollContent: { padding: 16, paddingBottom: 80 },
  heroBanner: { marginBottom: 16 },
  heroGreeting: { fontSize: 14, fontWeight: '600', color: '#5b6078' },
  heroHeadline: { fontSize: 20, fontWeight: '800', color: '#1a1f36', marginTop: 2 },
  quickGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  quickCard: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickCardDisabled: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ece6e0',
    opacity: 0.6,
  },
  quickIcon: { fontSize: 22 },
  quickTextWhite: { fontSize: 11, fontWeight: '800', color: '#fff', marginTop: 4 },
  quickTextMuted: { fontSize: 11, fontWeight: '700', color: '#5b6078', marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1a1f36', marginBottom: 12 },
  vendorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ece6e0',
  },
  vendorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vendorAvatarText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  vendorInfo: { flex: 1, marginLeft: 12 },
  vendorName: { fontSize: 14, fontWeight: '800', color: '#1a1f36' },
  vendorArea: { fontSize: 11, color: '#5b6078', marginTop: 1 },
  vendorMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  ratingText: { color: '#e08a00', fontWeight: '700', fontSize: 12 },
  metaDivider: { color: '#5b6078', marginHorizontal: 4 },
  distText: { color: '#5b6078', fontSize: 12 },
  priceCol: { alignItems: 'flex-end' },
  priceFromLabel: { fontSize: 10, color: '#8f95b2' },
  priceValue: { fontSize: 16, fontWeight: '800', color: '#1a1f36' },
  vendorDetail: { marginBottom: 20 },
  backButton: { marginBottom: 10 },
  backButtonText: { color: '#c9450c', fontWeight: '700', fontSize: 13 },
  detailHero: { borderRadius: 20, padding: 18, marginBottom: 16 },
  detailHeroTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  detailHeroSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  detailHeroMeta: { fontSize: 12, fontWeight: '700', color: '#ffb020', marginTop: 6 },
  pkgCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ece6e0',
  },
  pkgCardActive: { borderColor: '#c9450c', backgroundColor: '#fffaf6' },
  pkgName: { fontSize: 13, fontWeight: '800', color: '#1a1f36' },
  pkgDesc: { fontSize: 11, color: '#5b6078', marginTop: 2 },
  pkgPrice: { fontSize: 15, fontWeight: '800', color: '#1a1f36', marginLeft: 8 },
  bookCta: {
    backgroundColor: '#c9450c',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  bookCtaText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  trackerCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ece6e0',
  },
  trackerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trackerId: { fontSize: 12, fontWeight: '700', color: '#5b6078' },
  statusBadge: { backgroundColor: '#fff3dc', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusBadgeText: { color: '#a65d00', fontWeight: '800', fontSize: 11 },
  trackerVendor: { fontSize: 18, fontWeight: '800', color: '#1a1f36', marginTop: 6 },
  trackerDetails: { fontSize: 12, color: '#5b6078', marginTop: 2 },
  otpCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff0e5',
    borderRadius: 14,
    padding: 12,
    marginVertical: 14,
  },
  otpLabel: { fontSize: 10, fontWeight: '800', color: '#c9450c' },
  otpSub: { fontSize: 11, color: '#5b6078', marginTop: 1 },
  otpCode: { fontSize: 22, fontWeight: '900', color: '#c9450c', letterSpacing: 3 },
  stepper: { paddingVertical: 8 },
  stepActive: { fontSize: 13, fontWeight: '700', color: '#18865a', marginBottom: 4 },
  stepPending: { fontSize: 13, color: '#8f95b2', marginBottom: 4 },
  trackerPrice: { fontSize: 15, fontWeight: '800', color: '#1a1f36', marginTop: 8 },
  emptyCard: { backgroundColor: '#fff', padding: 24, borderRadius: 16, alignItems: 'center' },
  emptyText: { color: '#5b6078', fontSize: 13 },
  profileView: { paddingVertical: 8 },
  userCard: { backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 16 },
  userName: { fontSize: 18, fontWeight: '800', color: '#1a1f36' },
  userPhone: { fontSize: 13, color: '#5b6078', marginTop: 2 },
  userLocation: { fontSize: 12, color: '#8f95b2', marginTop: 1 },
  garageCard: { backgroundColor: '#fff', borderRadius: 14, padding: 12, marginBottom: 8 },
  garageName: { fontSize: 14, fontWeight: '700', color: '#1a1f36' },
  garageReg: { fontSize: 12, color: '#5b6078', marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#1a1f36' },
  modalSub: { fontSize: 13, color: '#5b6078', marginTop: 2, marginBottom: 16 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#5b6078', marginBottom: 8 },
  modeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modeButton: { flex: 1, paddingVertical: 10, borderWidth: 1, borderColor: '#ece6e0', borderRadius: 10, alignItems: 'center', marginHorizontal: 2 },
  modeButtonActive: { backgroundColor: '#c9450c', borderColor: '#c9450c' },
  modeButtonText: { fontSize: 12, fontWeight: '700', color: '#1a1f36' },
  modeButtonTextActive: { color: '#fff' },
  confirmButton: { backgroundColor: '#c9450c', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  confirmButtonText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  cancelButton: { paddingVertical: 12, alignItems: 'center', marginTop: 6 },
  cancelButtonText: { color: '#5b6078', fontWeight: '700', fontSize: 13 },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ece6e0',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: { padding: 8 },
  navText: { fontSize: 12, fontWeight: '700', color: '#5b6078' },
  navTextActive: { color: '#c9450c' },
});
