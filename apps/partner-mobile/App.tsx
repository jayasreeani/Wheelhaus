import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';

const API_BASE_URL = 'http://10.0.2.2:4000/api';

export default function PartnerApp() {
  const [partnerCentre, setPartnerCentre] = useState({
    id: 'v1',
    name: 'BlueDrop Car Spa',
    area: 'Kazhakoottam Bypass',
    commission: 15,
    rating: 4.6,
    reviews: 212,
  });

  const [activeTab, setActiveTab] = useState<'requests' | 'jobs' | 'services' | 'earnings'>('requests');
  const [otpInputs, setOtpInputs] = useState<Record<number, string>>({});

  const [requests, setRequests] = useState([
    {
      id: 1041,
      customer: 'Rahul Nair',
      carType: 'Hatchback',
      pkg: 'Interior Deep Clean',
      mode: 'Pick & Drop',
      slot: 'Today, 14:00',
      address: 'Skyline Residency, Kazhakoottam',
      netPayout: 526,
      deadlineSec: 450,
      otp: '9042',
    },
  ]);

  const [jobs, setJobs] = useState([
    {
      id: 1040,
      customer: 'Meera J',
      carType: 'Sedan',
      pkg: 'Exterior Foam Wash',
      mode: 'Walk-in',
      slot: 'Today, 11:00',
      status: 'in_progress',
      otp: '8814',
    },
  ]);

  const [completedList, setCompletedList] = useState([
    { id: 1031, customer: 'Arjun Menon', pkg: 'Full Wash', net: 764 },
    { id: 1036, customer: 'Vishnu M', pkg: 'Exterior Wash', net: 296 },
  ]);

  const handleAcceptRequest = (reqId: number) => {
    const item = requests.find(r => r.id === reqId);
    if (!item) return;

    setRequests(requests.filter(r => r.id !== reqId));
    setJobs([
      ...jobs,
      {
        id: item.id,
        customer: item.customer,
        carType: item.carType,
        pkg: item.pkg,
        mode: item.mode,
        slot: item.slot,
        status: 'accepted',
        otp: item.otp,
      },
    ]);
    setActiveTab('jobs');
    Alert.alert('Booking Accepted', `Order WK-${reqId} moved to live jobs. Customer notified on WhatsApp.`);
  };

  const handleAdvanceJob = (jobId: number) => {
    const j = jobs.find(x => x.id === jobId);
    if (!j) return;

    // Check OTP validation for completion
    const entered = otpInputs[jobId] || '';
    if (j.status === 'in_progress' && entered !== j.otp) {
      Alert.alert('Handover OTP Required', `Please enter the 4-digit OTP (${j.otp}) provided by the customer.`);
      return;
    }

    if (j.status === 'accepted') {
      j.status = 'in_progress';
      setJobs([...jobs]);
      Alert.alert('Status Updated', 'Wash started. Customer timeline updated.');
    } else {
      // Completed!
      setJobs(jobs.filter(x => x.id !== jobId));
      setCompletedList([
        { id: j.id, customer: j.customer, pkg: j.pkg, net: 650 },
        ...completedList,
      ]);
      Alert.alert('Job Completed!', `WK-${jobId} finished. Payout added to Monday settlement.`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Partner Mobile Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerRole}>PARTNER GARAGE CONSOLE</Text>
          <Text style={styles.headerTitle}>{partnerCentre.name}</Text>
          <Text style={styles.headerArea}>{partnerCentre.area}</Text>
        </View>
        <View style={styles.onlineBadge}>
          <Text style={styles.onlineText}>● Accepting Orders</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ================= TAB: REQUESTS ================= */}
        {activeTab === 'requests' && (
          <View>
            <Text style={styles.sectionTitle}>
              Incoming Orders ({requests.length})
            </Text>

            {requests.map(r => (
              <View key={r.id} style={styles.requestCard}>
                <View style={styles.rowBetween}>
                  <Text style={styles.customerName}>{r.customer}</Text>
                  <View style={styles.timerPill}>
                    <Text style={styles.timerText}>⏳ 07:30</Text>
                  </View>
                </View>

                <Text style={styles.orderDetails}>
                  {r.pkg} • {r.carType} • {r.mode}
                </Text>
                <Text style={styles.orderSlot}>Slot: {r.slot}</Text>
                {r.address ? <Text style={styles.orderAddr}>📍 {r.address}</Text> : null}

                <View style={styles.payoutLine}>
                  <Text style={styles.payoutLabel}>Your Net Earnings</Text>
                  <Text style={styles.payoutValue}>₹{r.netPayout}</Text>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    onPress={() => setRequests(requests.filter(x => x.id !== r.id))}
                    style={styles.declineButton}
                  >
                    <Text style={styles.declineText}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleAcceptRequest(r.id)}
                    style={styles.acceptButton}
                  >
                    <Text style={styles.acceptText}>Accept Order</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {requests.length === 0 && (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No pending requests right now.</Text>
              </View>
            )}
          </View>
        )}

        {/* ================= TAB: LIVE JOBS ================= */}
        {activeTab === 'jobs' && (
          <View>
            <Text style={styles.sectionTitle}>Jobs In Progress ({jobs.length})</Text>

            {jobs.map(j => (
              <View key={j.id} style={styles.jobCard}>
                <View style={styles.rowBetween}>
                  <Text style={styles.customerName}>{j.customer}</Text>
                  <View style={styles.jobBadge}>
                    <Text style={styles.jobBadgeText}>{j.status.toUpperCase()}</Text>
                  </View>
                </View>

                <Text style={styles.orderDetails}>
                  WK-{j.id} • {j.pkg} ({j.carType})
                </Text>
                <Text style={styles.orderSlot}>{j.mode} • {j.slot}</Text>

                {j.status === 'in_progress' && (
                  <View style={styles.otpInputBox}>
                    <Text style={styles.otpPrompt}>
                      Enter Customer Handover OTP (Demo: {j.otp})
                    </Text>
                    <TextInput
                      style={styles.otpInput}
                      maxLength={4}
                      placeholder="4-digit OTP"
                      value={otpInputs[j.id] || ''}
                      onChangeText={val => setOtpInputs({ ...otpInputs, [j.id]: val })}
                    />
                  </View>
                )}

                <TouchableOpacity
                  onPress={() => handleAdvanceJob(j.id)}
                  style={styles.advanceButton}
                >
                  <Text style={styles.advanceButtonText}>
                    {j.status === 'accepted' ? 'Start Wash' : 'Complete Handover (Verify OTP)'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

            {jobs.length === 0 && (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No active jobs running.</Text>
              </View>
            )}
          </View>
        )}

        {/* ================= TAB: SERVICES ================= */}
        {activeTab === 'services' && (
          <View>
            <Text style={styles.sectionTitle}>Service Radius & Offerings</Text>

            <View style={styles.serviceSetting}>
              <Text style={styles.serviceTitle}>At Centre (Walk-in)</Text>
              <Text style={styles.serviceDesc}>Customers drive to your garage at slot time.</Text>
              <Text style={styles.activeTag}>✓ Active</Text>
            </View>

            <View style={styles.serviceSetting}>
              <Text style={styles.serviceTitle}>Pick & Drop Delivery</Text>
              <Text style={styles.serviceDesc}>Driver collects & returns vehicle (Up to 5 km radius, +₹120).</Text>
              <Text style={styles.activeTag}>✓ Active</Text>
            </View>

            <View style={styles.serviceSetting}>
              <Text style={styles.serviceTitle}>Doorstep Wash</Text>
              <Text style={styles.serviceDesc}>Washer travels to customer location.</Text>
              <Text style={styles.inactiveTag}>○ Paused</Text>
            </View>
          </View>
        )}

        {/* ================= TAB: EARNINGS ================= */}
        {activeTab === 'earnings' && (
          <View>
            <Text style={styles.sectionTitle}>Weekly Earnings & Settlement</Text>

            <View style={styles.earningsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Completed</Text>
                <Text style={styles.statVal}>{completedList.length}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Next Payout</Text>
                <Text style={[styles.statVal, { color: '#18865a' }]}>₹1,410</Text>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Completed Orders</Text>
            {completedList.map(c => (
              <View key={c.id} style={styles.completedCard}>
                <View>
                  <Text style={styles.completedCustomer}>{c.customer}</Text>
                  <Text style={styles.completedPkg}>WK-{c.id} • {c.pkg}</Text>
                </View>
                <Text style={styles.completedNet}>+₹{c.net}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom Partner Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => setActiveTab('requests')} style={styles.navItem}>
          <Text style={[styles.navText, activeTab === 'requests' && styles.navTextActive]}>
            Requests
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('jobs')} style={styles.navItem}>
          <Text style={[styles.navText, activeTab === 'jobs' && styles.navTextActive]}>
            Jobs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('services')} style={styles.navItem}>
          <Text style={[styles.navText, activeTab === 'services' && styles.navTextActive]}>
            Services
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('earnings')} style={styles.navItem}>
          <Text style={[styles.navText, activeTab === 'earnings' && styles.navTextActive]}>
            Earnings
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f3ef' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ece6e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRole: { fontSize: 9, fontWeight: '800', color: '#c9450c', letterSpacing: 0.5 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#1a1f36' },
  headerArea: { fontSize: 11, color: '#5b6078' },
  onlineBadge: { backgroundColor: '#e2f5ec', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  onlineText: { color: '#18865a', fontWeight: '800', fontSize: 11 },
  scrollContent: { padding: 16, paddingBottom: 80 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1a1f36', marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ece6e0',
  },
  customerName: { fontSize: 15, fontWeight: '800', color: '#1a1f36' },
  timerPill: { backgroundColor: '#fff3dc', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  timerText: { color: '#a65d00', fontWeight: '800', fontSize: 11 },
  orderDetails: { fontSize: 13, fontWeight: '700', color: '#1a1f36', marginTop: 6 },
  orderSlot: { fontSize: 12, color: '#5b6078', marginTop: 2 },
  orderAddr: { fontSize: 11, color: '#c9450c', marginTop: 2 },
  payoutLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ece6e0',
    borderStyle: 'dashed',
    marginTop: 10,
    paddingTop: 8,
  },
  payoutLabel: { fontSize: 12, color: '#5b6078' },
  payoutValue: { fontSize: 17, fontWeight: '800', color: '#18865a' },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  declineButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ece6e0',
    alignItems: 'center',
  },
  declineText: { color: '#c2352b', fontWeight: '700', fontSize: 13 },
  acceptButton: { flex: 2, paddingVertical: 10, borderRadius: 12, backgroundColor: '#c9450c', alignItems: 'center' },
  acceptText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ece6e0',
  },
  jobBadge: { backgroundColor: '#e2f5ec', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  jobBadgeText: { color: '#18865a', fontWeight: '800', fontSize: 10 },
  otpInputBox: { marginVertical: 10 },
  otpPrompt: { fontSize: 11, fontWeight: '700', color: '#5b6078', marginBottom: 4 },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ece6e0',
    borderRadius: 10,
    padding: 8,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 4,
    textAlign: 'center',
  },
  advanceButton: {
    backgroundColor: '#1a1f36',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  advanceButtonText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  serviceSetting: { backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10 },
  serviceTitle: { fontSize: 14, fontWeight: '800', color: '#1a1f36' },
  serviceDesc: { fontSize: 11, color: '#5b6078', marginTop: 2 },
  activeTag: { fontSize: 11, fontWeight: '800', color: '#18865a', marginTop: 6 },
  inactiveTag: { fontSize: 11, fontWeight: '700', color: '#8f95b2', marginTop: 6 },
  earningsGrid: { flexDirection: 'row', gap: 10 },
  statBox: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 14, alignItems: 'center' },
  statLabel: { fontSize: 11, color: '#5b6078', fontWeight: '600' },
  statVal: { fontSize: 20, fontWeight: '800', color: '#1a1f36', marginTop: 2 },
  completedCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completedCustomer: { fontSize: 13, fontWeight: '700', color: '#1a1f36' },
  completedPkg: { fontSize: 11, color: '#5b6078', marginTop: 1 },
  completedNet: { fontSize: 14, fontWeight: '800', color: '#18865a' },
  emptyCard: { backgroundColor: '#fff', padding: 24, borderRadius: 16, alignItems: 'center' },
  emptyText: { color: '#5b6078', fontSize: 13 },
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
