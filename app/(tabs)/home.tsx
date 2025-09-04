import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={[styles.container, { paddingTop: 32 }]}> 
      <Image source={require('@/assets/images/icon.png')} style={{ width: 96, height: 96, alignSelf: 'center', marginBottom: 12 }} />
      <Text style={styles.title}>Blood Donation</Text>
      <Text style={styles.subtitle}>Search donors, post requests, save lives.</Text>
      <View style={styles.actions}>
        <Link href="/(tabs)/request" asChild>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryText}>Request Blood</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/(tabs)/donors" asChild>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>Find Donors</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  actions: {
    marginTop: 24,
    gap: 12,
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
    fontSize: 16,
  },
  secondaryButton: {
    borderColor: '#E11D48',
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#E11D48',
    fontWeight: '600',
    fontSize: 16,
  },
});


