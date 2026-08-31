import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { api } from '@/lib/axios';
import { HealthCheckResponse } from '@grocery-shopper/types';
import { useQuery } from '@tanstack/react-query';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  const {
    data: healthCheck,
    isLoading,
    error,
  } = useQuery<HealthCheckResponse>({
    queryKey: ['health'],
    queryFn: async () =>
      api.get<HealthCheckResponse>('/health').then((res) => res.data),
  });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          {isLoading && <ActivityIndicator size='large' color='#FF6b35' />}

          <ThemedText type='title' style={styles.title}>
            Grocery Shopper
          </ThemedText>

          <Text style={styles.subtitle}>Connection Status</Text>

          {healthCheck && (
            <View style={styles.statusBox}>
              <Text style={styles.statusText}>
                API Status: {String(healthCheck.status).toUpperCase()}
              </Text>
              <Text style={styles.timestampText}>
                {new Date(healthCheck.timestamp).toLocaleString()}
              </Text>
            </View>
          )}

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                Could not reach the API. Is the server running?
              </Text>
            </View>
          )}
        </ThemedView>

        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
  code: {
    textTransform: 'uppercase',
  },
  statusBox: {
    backgroundColor: '#F0FFF4',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#22543D',
  },
  timestampText: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
  },
  errorBox: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E53e3e',
    textAlign: 'center',
    lineHeight: 22,
  },
});
