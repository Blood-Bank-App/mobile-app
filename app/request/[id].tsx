import { Colors } from '@/constants/Colors';
import { useThemeCustom } from '@/context/ThemeContext';
import { BloodRequest, Comment } from '@/lib/types';
import { CommentAPI, RequestAPI, tokenManager } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RequestDetailScreen() {
  const { theme } = useThemeCustom();
  const isDark = theme === 'dark';
  const { id } = useLocalSearchParams<{ id: string }>();
  const [request, setRequest] = useState<BloodRequest | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [creatorProfile, setCreatorProfile] = useState<any>(null);
  // TODO: Extract current user ID from JWT token
  const currentUid = tokenManager.getAccessToken() ? 'current-user' : null;

  const loadData = async () => {
    if (!id) return;
    try {
      const [req, cmts] = await Promise.all([
        RequestAPI.getRequestById(id),
        CommentAPI.listRequestComments(id),
      ]);
      setRequest(req);
      setComments(cmts);
      
      // TODO: Get creator profile from API
      if (req?.createdBy) {
        // For now, we'll skip getting creator profile
        // const profile = await UserAPI.getProfile(req.createdBy);
        // setCreatorProfile(profile);
      }
    } catch (e) {
      console.error('Failed to load request details', e);
      Alert.alert('Error', 'Failed to load request details');
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const onAddComment = async () => {
    if (!newComment.trim() || !currentUid || !id) return;
    try {
      setLoading(true);
      await CommentAPI.createComment(id, newComment);
      setNewComment('');
      await loadData();
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const onDeleteComment = async (commentId: string) => {
    if (!id) return;
    try {
      await CommentAPI.deleteComment(commentId);
      await loadData();
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to delete comment');
    }
  };

  const onAccept = async () => {
    if (!id) return;
    try {
      setLoading(true);
      await RequestAPI.acceptRequest(id);
      Alert.alert('Accepted', 'Request accepted successfully.');
      await loadData();
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to accept request');
    } finally {
      setLoading(false);
    }
  };

  const onReject = async () => {
    if (!id) return;
    try {
      setLoading(true);
      await RequestAPI.rejectRequest(id);
      Alert.alert('Rejected', 'Request rejected.');
      await loadData();
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to reject request');
    } finally {
      setLoading(false);
    }
  };

  const onCancel = async () => {
    if (!id) return;
    Alert.alert('Cancel Request', 'Are you sure you want to cancel this request?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          try {
            setLoading(true);
            await RequestAPI.cancelRequest(id);
            Alert.alert('Cancelled', 'Request cancelled.');
            await loadData();
          } catch (e: any) {
            Alert.alert('Error', e?.message ?? 'Failed to cancel request');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const onMarkFulfilled = async () => {
    if (!id) return;
    try {
      setLoading(true);
      await RequestAPI.markFulfilled(id);
      Alert.alert('Fulfilled', 'Request marked as fulfilled.');
      await loadData();
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to mark as fulfilled');
    } finally {
      setLoading(false);
    }
  };

  const openMap = () => {
    if (!request?.locationLat || !request?.locationLng) return;
    const url = `https://maps.google.com/?q=${request.locationLat},${request.locationLng}`;
    Linking.openURL(url);
  };

  const callPatient = () => {
    if (!creatorProfile?.phone) return;
    Linking.openURL(`tel:${creatorProfile.phone}`);
  };

  if (!request) {
    return (
      <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
        <Text style={[styles.title, { color: isDark ? '#fff' : Colors[theme].text }]}>Loading...</Text>
      </View>
    );
  }

  const isCreator = currentUid === request.createdBy;
  const isTargetedDonor = currentUid === request.requestedTo;
  const canAccept = request.status === 'open' || (request.status === 'pending' && isTargetedDonor);
  const canReject = request.status === 'pending' && isTargetedDonor;
  const canCancel = isCreator && ['open', 'pending'].includes(request.status);
  const canMarkFulfilled = isCreator && request.status === 'accepted';

  return (
    <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { borderColor: isDark ? '#374151' : '#e5e7eb', backgroundColor: isDark ? '#111827' : '#fff' }]}>
          <Text style={[styles.patientName, { color: isDark ? '#fff' : '#111827' }]}>{request.patientName}</Text>
          
          <View style={styles.statusBadge}>
            <Text style={[styles.statusText, { backgroundColor: getStatusColor(request.status) }]}>
              {request.status.toUpperCase()}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="water" size={16} color="#E11D48" />
            <Text style={[styles.detailText, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>
              {request.requiredBloodGroup} • {request.unitsRequired || 1} units
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location" size={16} color="#E11D48" />
            <Text style={[styles.detailText, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>
              {request.city} • {request.gender}
            </Text>
          </View>

          {request.hospital && (
            <View style={styles.detailRow}>
              <Ionicons name="medical" size={16} color="#E11D48" />
              <Text style={[styles.detailText, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>
                {request.hospital}
              </Text>
            </View>
          )}

          {request.locationAddress && (
            <View style={styles.detailRow}>
              <Ionicons name="map" size={16} color="#E11D48" />
              <TouchableOpacity onPress={openMap}>
                <Text style={[styles.detailText, { color: '#3B82F6', textDecorationLine: 'underline' }]}>
                  {request.locationAddress}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {request.notes && (
            <View style={[styles.notesSection, { borderTopColor: isDark ? '#374151' : '#e5e7eb' }]}>
              <Text style={[styles.notesLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>Notes:</Text>
              <Text style={[styles.notesText, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>
                {request.notes}
              </Text>
            </View>
          )}

          <Text style={[styles.timestamp, { color: isDark ? '#9CA3AF' : '#9CA3AF' }]}>
            Posted {new Date(request.createdAt).toLocaleString()}
          </Text>

          {creatorProfile && (
            <View style={styles.creatorSection}>
              <Link href={{ pathname: '/profile/[uid]', params: { uid: request.createdBy } }} asChild>
                <TouchableOpacity style={[styles.creatorButton, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}>
                  <Ionicons name="person" size={16} color={isDark ? '#D1D5DB' : '#6B7280'} />
                  <Text style={[styles.creatorText, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>
                    View {creatorProfile.name}'s Profile
                  </Text>
                </TouchableOpacity>
              </Link>
              {creatorProfile.phone && (
                <TouchableOpacity style={[styles.creatorButton, { backgroundColor: '#10B981' }]} onPress={callPatient}>
                  <Ionicons name="call" size={16} color="#fff" />
                  <Text style={[styles.creatorText, { color: '#fff' }]}>Call Patient</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Action buttons based on role and status */}
        <View style={styles.actions}>
          {canAccept && (
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#10B981' }]} onPress={onAccept} disabled={loading}>
              <Ionicons name="checkmark" size={16} color="#fff" />
              <Text style={styles.actionText}>Accept</Text>
            </TouchableOpacity>
          )}
          {canReject && (
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#EF4444' }]} onPress={onReject} disabled={loading}>
              <Ionicons name="close" size={16} color="#fff" />
              <Text style={styles.actionText}>Reject</Text>
            </TouchableOpacity>
          )}
          {canCancel && (
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#F59E0B' }]} onPress={onCancel} disabled={loading}>
              <Ionicons name="ban" size={16} color="#fff" />
              <Text style={styles.actionText}>Cancel</Text>
            </TouchableOpacity>
          )}
          {canMarkFulfilled && (
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#8B5CF6' }]} onPress={onMarkFulfilled} disabled={loading}>
              <Ionicons name="checkmark-done" size={16} color="#fff" />
              <Text style={styles.actionText}>Mark Fulfilled</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Comments section */}
        <View style={[styles.commentsSection, { borderTopColor: isDark ? '#374151' : '#e5e7eb' }]}>
          <Text style={[styles.commentsTitle, { color: isDark ? '#fff' : '#111827' }]}>
            Comments ({comments.length})
          </Text>

          <View style={styles.addCommentSection}>
            <TextInput
              style={[styles.commentInput, { 
                color: isDark ? '#fff' : '#111827', 
                borderColor: isDark ? '#374151' : '#e5e7eb', 
                backgroundColor: isDark ? '#111827' : '#fff' 
              }]}
              placeholder="Add a comment..."
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity 
              style={[styles.addCommentButton, { opacity: newComment.trim() ? 1 : 0.5 }]} 
              onPress={onAddComment}
              disabled={!newComment.trim() || loading}
            >
              <Text style={styles.addCommentText}>Post</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ gap: 12 }}
            renderItem={({ item }) => (
              <View style={[styles.commentCard, { borderColor: isDark ? '#374151' : '#e5e7eb', backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}>
                <View style={styles.commentHeader}>
                  <Text style={[styles.commentAuthor, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>
                    User {item.uid.slice(-4)}
                  </Text>
                  <Text style={[styles.commentTime, { color: isDark ? '#9CA3AF' : '#9CA3AF' }]}>
                    {new Date(item.createdAt).toLocaleString()}
                  </Text>
                  {(item.uid === currentUid || isCreator) && (
                    <TouchableOpacity onPress={() => onDeleteComment(item.id)}>
                      <Ionicons name="trash" size={14} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={[styles.commentText, { color: isDark ? '#fff' : '#111827' }]}>
                  {item.text}
                </Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={[styles.noComments, { color: isDark ? '#9CA3AF' : '#9CA3AF' }]}>
                No comments yet. Be the first to comment!
              </Text>
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'open': return '#3B82F6';
    case 'pending': return '#F59E0B';
    case 'accepted': return '#10B981';
    case 'rejected': return '#EF4444';
    case 'fulfilled': return '#8B5CF6';
    case 'cancelled': return '#6B7280';
    default: return '#9CA3AF';
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 16 },
  patientName: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  statusBadge: { alignSelf: 'flex-start', marginBottom: 12 },
  statusText: { color: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: '700' },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  detailText: { fontSize: 16 },
  notesSection: { borderTopWidth: 1, paddingTop: 12, marginTop: 12 },
  notesLabel: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  notesText: { fontSize: 14, fontStyle: 'italic' },
  timestamp: { fontSize: 12, marginTop: 12, opacity: 0.7 },
  creatorSection: { flexDirection: 'row', gap: 8, marginTop: 16 },
  creatorButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, flex: 1 },
  creatorText: { fontWeight: '600', fontSize: 14 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  actionText: { color: '#fff', fontWeight: '600' },
  commentsSection: { borderTopWidth: 1, paddingTop: 24 },
  commentsTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  addCommentSection: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  commentInput: { flex: 1, borderWidth: 1, borderRadius: 8, padding: 12, minHeight: 80, textAlignVertical: 'top' },
  addCommentButton: { backgroundColor: '#E11D48', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, alignSelf: 'flex-start' },
  addCommentText: { color: '#fff', fontWeight: '600' },
  commentCard: { borderWidth: 1, borderRadius: 8, padding: 12 },
  commentHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  commentAuthor: { fontWeight: '600', fontSize: 14 },
  commentTime: { fontSize: 12, opacity: 0.7 },
  commentText: { fontSize: 14, lineHeight: 20 },
  noComments: { textAlign: 'center', marginTop: 16, fontSize: 14, opacity: 0.7 },
});