import SelectModal from '@/components/SelectModal';
import { Colors } from '@/constants/Colors';
import { useMode } from '@/context/ModeContext';
import { useThemeCustom } from '@/context/ThemeContext';
import { BLOOD_GROUPS, CITIES_PK } from '@/data/pk';
import { AIAssistant } from '@/lib/ai';
import { acceptRequest, listMyRequests, listRequests } from '@/lib/requests';
import { getUserProfile, getUserStats } from '@/lib/users';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { theme } = useThemeCustom();
  const isDark = theme === 'dark';
  const router = useRouter();
  const { mode } = useMode();
  const [searchCity, setSearchCity] = useState('');
  const [searchGroup, setSearchGroup] = useState('');
  const [openPicker, setOpenPicker] = useState<null | 'city' | 'blood'>(null);
  const [urgent, setUrgent] = useState<any[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [acceptingRequest, setAcceptingRequest] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    (async () => {
      if (mode === 'donor') {
        // For donors: show urgent requests
        const reqs = await listRequests({ status: ['open', 'pending'], includeMatchScores: true });
        // Normalize createdAt to timestamp (number) if it comes as string
        const normalizedReqs = reqs.map(req => ({
          ...req,
          createdAt: typeof req.createdAt === 'string' 
            ? new Date(req.createdAt).getTime() 
            : req.createdAt
        }));
        // Sort by match score if available, otherwise by date
        normalizedReqs.sort((a, b) => {
          const scoreA = a.matchScore?.matchScore ?? 0;
          const scoreB = b.matchScore?.matchScore ?? 0;
          if (scoreA !== scoreB) return scoreB - scoreA;
          return b.createdAt - a.createdAt;
        });
        setUrgent(normalizedReqs.slice(0, 10));
      } else {
        // For patients: show their own requests and stats
        const myReqs = await listMyRequests();
        const normalizedReqs = myReqs.map(req => ({
          ...req,
          createdAt: typeof req.createdAt === 'string' 
            ? new Date(req.createdAt).getTime() 
            : req.createdAt
        }));
        setMyRequests(normalizedReqs);
        
        // Load user stats
        try {
          setLoadingStats(true);
          const stats = await getUserStats();
          setUserStats(stats);
        } catch (error) {
          console.error('Failed to load user stats:', error);
        } finally {
          setLoadingStats(false);
        }
      }
      
      // Load AI suggestion
      loadAISuggestion();
    })();
  }, [mode]);

  const loadAISuggestion = async () => {
    try {
      setLoadingAI(true);
      const userProfile = await getUserProfile();
      const suggestion = await AIAssistant.getPersonalizedRecommendations(userProfile);
      setAiSuggestion(suggestion.insights);
    } catch (error) {
      console.error('Failed to load AI suggestion:', error);
      setAiSuggestion('Welcome to Blood Bank! I can help you with blood donation and requests.');
    } finally {
      setLoadingAI(false);
    }
  };

  const filteredUrgent = useMemo(() => {
    return urgent.filter((r) =>
      (!searchCity || r.city?.toLowerCase().includes(searchCity.toLowerCase())) &&
      (!searchGroup || r.requiredBloodGroup === searchGroup)
    );
  }, [urgent, searchCity, searchGroup]);

  const handleAcceptRequest = async (requestId: string) => {
    if (mode !== 'donor') {
      Alert.alert('Access Denied', 'Only donors can accept requests. Switch to Donor mode in your profile.');
      return;
    }
    
    try {
      setAcceptingRequest(requestId);
      await acceptRequest(requestId);
      Alert.alert('Success', 'Request accepted! The patient will be notified.');
      // Refresh urgent requests
      const reqs = await listRequests({ status: ['open', 'pending'] });
      // Normalize createdAt to timestamp (number) if it comes as string
      const normalizedReqs = reqs.map(req => ({
        ...req,
        createdAt: typeof req.createdAt === 'string' 
          ? new Date(req.createdAt).getTime() 
          : req.createdAt
      }));
      setUrgent(normalizedReqs.slice(0, 10));
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to accept request');
    } finally {
      setAcceptingRequest(null);
    }
  };

  const formatTimeAgo = (timestamp: number | string | Date) => {
    // Convert to timestamp if it's a string or Date object
    let timestampMs: number;
    if (typeof timestamp === 'string') {
      timestampMs = new Date(timestamp).getTime();
    } else if (timestamp instanceof Date) {
      timestampMs = timestamp.getTime();
    } else {
      timestampMs = timestamp;
    }
    
    // Check if timestamp is valid
    if (isNaN(timestampMs) || timestampMs <= 0) {
      return 'Just now';
    }
    
    const now = Date.now();
    const diff = now - timestampMs;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <View style={[styles.container, { paddingTop: 12, backgroundColor: Colors[theme as 'light' | 'dark'].background }]}> 
      <View style={styles.headerBranding}>
        <Image source={require('@/assets/images/logo.jpg')} style={{ width: 40, height: 40, borderRadius: 8 }} />
        <Text style={[styles.title, { color: Colors[theme as 'light' | 'dark'].text }]}>Blood Donation</Text>
      </View>

      {mode === 'donor' && (
        <>
          <View style={styles.searchBox}>
            <TouchableOpacity 
              style={[styles.input, { 
                borderColor: Colors[theme as 'light' | 'dark'].border, 
                backgroundColor: Colors[theme as 'light' | 'dark'].inputBackground 
              }]}
              onPress={() => setOpenPicker('city')}
            >
              <Text style={{ 
                color: searchCity ? Colors[theme as 'light' | 'dark'].text : Colors[theme as 'light' | 'dark'].secondaryText 
              }}>
                {searchCity || 'City'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.input, { 
                borderColor: Colors[theme as 'light' | 'dark'].border, 
                backgroundColor: Colors[theme as 'light' | 'dark'].inputBackground 
              }]}
              onPress={() => setOpenPicker('blood')}
            >
              <Text style={{ 
                color: searchGroup ? Colors[theme as 'light' | 'dark'].text : Colors[theme as 'light' | 'dark'].secondaryText 
              }}>
                {searchGroup || 'Blood Group'}
              </Text>
            </TouchableOpacity>
          </View>

          <SelectModal
            visible={openPicker === 'city'}
            title="Select City"
            options={CITIES_PK}
            onClose={() => setOpenPicker(null)}
            onSelect={(v) => { setSearchCity(v); setOpenPicker(null); }}
          />
          <SelectModal
            visible={openPicker === 'blood'}
            title="Select Blood Group"
            options={BLOOD_GROUPS}
            onClose={() => setOpenPicker(null)}
            onSelect={(v) => { setSearchGroup(v); setOpenPicker(null); }}
          />
        </>
      )}

      {/* AI Assistant Section */}
      <View style={styles.aiSection}>
        <View style={styles.aiHeader}>
          <View style={styles.aiIconContainer}>
            <Ionicons name="sparkles" size={20} color="#E11D48" />
          </View>
          <Text style={[styles.aiTitle, { color: Colors[theme as 'light' | 'dark'].text }]}>
            AI Assistant
          </Text>
          <TouchableOpacity 
            style={styles.aiChatButton}
            onPress={() => router.push('/(tabs)/chat')}
          >
            <Ionicons name="chatbubbles" size={16} color="#E11D48" />
          </TouchableOpacity>
        </View>
        
        <View style={[
          styles.aiSuggestionCard, 
          { 
            backgroundColor: Colors[theme as 'light' | 'dark'].cardBackground,
            borderColor: Colors[theme as 'light' | 'dark'].border
          }
        ]}>
          <Text style={[styles.aiSuggestionText, { color: Colors[theme as 'light' | 'dark'].text }]}>
            {loadingAI ? 'Loading AI insights...' : aiSuggestion}
          </Text>
        </View>
      </View>

      {/* Mode-specific Content */}
      {mode === 'donor' ? (
        /* Donor View: Urgent Requests */
        <View style={{ marginTop: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={[styles.sectionTitle, { color: Colors[theme as 'light' | 'dark'].text }]}>Urgent Requests</Text>
            {filteredUrgent.length > 0 && (
              <Ionicons name="alert-circle" size={20} color="#EF4444" />
            )}
          </View>
          
          {filteredUrgent.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: Colors[theme as 'light' | 'dark'].cardBackground, borderColor: Colors[theme as 'light' | 'dark'].border }]}>
              <Ionicons name="heart" size={32} color={Colors[theme as 'light' | 'dark'].secondaryText} />
              <Text style={{ color: Colors[theme as 'light' | 'dark'].secondaryText, marginTop: 8 }}>No urgent requests at the moment</Text>
            </View>
          ) : (
            <FlatList
              data={filteredUrgent}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
              renderItem={({ item }) => (
                <View style={[styles.urgentCard, { backgroundColor: Colors[theme as 'light' | 'dark'].cardBackground, borderColor: Colors[theme as 'light' | 'dark'].border }]}> 
                  <View style={styles.urgentHeader}>
                    <Text style={[styles.cardTitle, { color: Colors[theme as 'light' | 'dark'].text }]}>{item.patientName}</Text>
                    <Text style={[styles.timeAgo, { color: Colors[theme as 'light' | 'dark'].secondaryText }]}>{formatTimeAgo(item.createdAt)}</Text>
                  </View>
                  
                  <View style={styles.urgentInfo}>
                    <View style={styles.infoRow}>
                      <Ionicons name="water" size={16} color="#EF4444" />
                      <Text style={[styles.cardLine, { color: Colors[theme as 'light' | 'dark'].text }]}>{item.requiredBloodGroup}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Ionicons name="location" size={16} color="#3B82F6" />
                      <Text style={[styles.cardLine, { color: Colors[theme as 'light' | 'dark'].text }]}>{item.city}</Text>
                    </View>
                    {item.hospital && (
                      <View style={styles.infoRow}>
                        <Ionicons name="medical" size={16} color="#10B981" />
                        <Text style={[styles.cardLine, { color: Colors[theme as 'light' | 'dark'].text }]} numberOfLines={1}>{item.hospital}</Text>
                      </View>
                    )}
                    {item.matchScore && (
                      <View style={styles.infoRow}>
                        <Ionicons name="star" size={16} color="#F59E0B" />
                        <Text style={[styles.cardLine, { color: Colors[theme as 'light' | 'dark'].text }]}>
                          {Math.round(item.matchScore.matchScore)}% Match
                          {item.matchScore.distanceKm !== undefined && ` • ${item.matchScore.distanceKm.toFixed(1)} km`}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.urgentActions}>
                    <TouchableOpacity 
                      style={[styles.detailsButton, { borderColor: Colors[theme as 'light' | 'dark'].border }]}
                      onPress={() => router.push(`/request/${item.id}`)}
                    >
                      <Text style={[styles.detailsButtonText, { color: Colors[theme as 'light' | 'dark'].linkText }]}>View Details</Text>
                    </TouchableOpacity>
                    
                    {item.status === 'open' && (
                      <TouchableOpacity 
                        style={[styles.acceptButton, { opacity: acceptingRequest === item.id ? 0.7 : 1 }]}
                        onPress={() => handleAcceptRequest(item.id)}
                        disabled={acceptingRequest === item.id}
                      >
                        <Text style={styles.acceptButtonText}>
                          {acceptingRequest === item.id ? 'Accepting...' : 'Accept'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
            />
          )}
        </View>
      ) : (
        /* Patient View: Stats and My Requests */
        <>
          {/* Stats Section */}
          {userStats && (
            <View style={{ marginTop: 16 }}>
              <Text style={[styles.sectionTitle, { color: Colors[theme as 'light' | 'dark'].text, marginBottom: 12 }]}>My Statistics</Text>
              <View style={[styles.statsCard, { backgroundColor: Colors[theme as 'light' | 'dark'].cardBackground, borderColor: Colors[theme as 'light' | 'dark'].border }]}>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: '#3B82F6' }]}>{userStats.total_requests_created || 0}</Text>
                    <Text style={[styles.statLabel, { color: Colors[theme as 'light' | 'dark'].secondaryText }]}>Requests Created</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: '#10B981' }]}>{myRequests.filter(r => r.status === 'accepted' || r.status === 'fulfilled').length}</Text>
                    <Text style={[styles.statLabel, { color: Colors[theme as 'light' | 'dark'].secondaryText }]}>Accepted</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: '#EF4444' }]}>{myRequests.filter(r => r.status === 'open' || r.status === 'pending').length}</Text>
                    <Text style={[styles.statLabel, { color: Colors[theme as 'light' | 'dark'].secondaryText }]}>Pending</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Quick Actions */}
          <View style={{ marginTop: 16 }}>
            <Text style={[styles.sectionTitle, { color: Colors[theme as 'light' | 'dark'].text, marginBottom: 12 }]}>Quick Actions</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity 
                style={[styles.quickActionButton, { backgroundColor: '#E11D48', flex: 1 }]}
                onPress={() => router.push('/(tabs)/request')}
              >
                <Ionicons name="add-circle" size={24} color="#fff" />
                <Text style={styles.quickActionText}>New Request</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.quickActionButton, { backgroundColor: '#3B82F6', flex: 1 }]}
                onPress={() => router.push('/(tabs)/donors')}
              >
                <Ionicons name="people" size={24} color="#fff" />
                <Text style={styles.quickActionText}>Find Donors</Text>
              </TouchableOpacity>
            </View>
          </View>

        </>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  headerBranding: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  searchBox: { flexDirection: 'row', gap: 8, marginTop: 8 },
  input: { 
    borderWidth: 1, 
    borderRadius: 10, 
    padding: 10, 
    flex: 1,
    justifyContent: 'center',
    minHeight: 44
  },
  actionsRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 4   },
  
  // AI Assistant Section
  aiSection: {
    marginTop: 16,
    marginBottom: 8
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8
  },
  aiIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E11D4820',
    alignItems: 'center',
    justifyContent: 'center'
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1
  },
  aiChatButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E11D48'
  },
  aiSuggestionCard: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#E11D48'
  },
  aiSuggestionText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic'
  },
  
  // Empty state
  emptyCard: { 
    padding: 24, 
    borderWidth: 1, 
    borderRadius: 12, 
    alignItems: 'center', 
    borderStyle: 'dashed' 
  },
  
  // Urgent requests
  urgentCard: { 
    width: 280, 
    padding: 16, 
    borderWidth: 1, 
    borderRadius: 12, 
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444'
  },
  urgentHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start' 
  },
  urgentInfo: { gap: 8 },
  urgentActions: { 
    flexDirection: 'row', 
    gap: 8, 
    marginTop: 4 
  },
  timeAgo: { 
    fontSize: 11, 
    fontWeight: '500' 
  },
  infoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6 
  },
  detailsButton: { 
    flex: 1, 
    borderWidth: 1, 
    paddingVertical: 8, 
    borderRadius: 6, 
    alignItems: 'center' 
  },
  detailsButtonText: { 
    fontSize: 12, 
    fontWeight: '600' 
  },
  acceptButton: { 
    flex: 1, 
    backgroundColor: '#10B981', 
    paddingVertical: 8, 
    borderRadius: 6, 
    alignItems: 'center' 
  },
  acceptButtonText: { 
    color: '#fff', 
    fontSize: 12, 
    fontWeight: '600' 
  },
  
  // Legacy
  card: { width: 220, padding: 12, borderRadius: 12, borderWidth: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardLine: { marginTop: 4 },
  statsCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  quickActionButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  quickActionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  primaryButton: {
    backgroundColor: '#E11D48',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff',
    fontWeight: '600',
  },
});


