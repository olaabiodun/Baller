import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Change this to your backend URL based on your environment
// For iOS Simulator: use localhost
// For Android Emulator: use 10.0.2.2
// For Physical Device: use your computer's local IP (e.g., 192.168.1.100)
// Find your IP: Windows (ipconfig), Mac/Linux (ifconfig)

const getApiUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      // For Android emulator
      return 'http://10.0.2.2:8000/prem-table';
    } else if (Platform.OS === 'ios') {
      // For iOS simulator
      return 'http://localhost:8000/prem-table';
    }
  }
  // Default to localhost for development
  return 'http://127.0.0.1:8000/prem-table';
};

const API_URL = getApiUrl();

interface TeamData {
  position: number;
  team: string;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_diff: number;
  points: number;
}

export default function PLTable() {
  const [tableData, setTableData] = useState<TeamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTable = async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError(null);

      // Force refresh if user manually refreshes
      const url = isRefresh ? `${API_URL}?force_refresh=true` : API_URL;
      
      // Log the URL being called for debugging
      console.log('Fetching from:', url);
      console.log('Platform:', Platform.OS);
      console.log('Dev mode:', __DEV__);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Data received successfully');
      console.log('Data success:', data.success);
      console.log('Table length:', data.table?.length);

      if (data.success && data.table) {
        setTableData(data.table);
      } else {
        throw new Error(data.error || 'Failed to load table');
      }
    } catch (err) {
      let errorMessage = 'Failed to load table.';
      
      if (err instanceof Error) {
        console.error('Error type:', err.name);
        console.error('Error message:', err.message);
        
        if (err.message.includes('Network request failed')) {
          errorMessage = `Cannot connect to server at ${API_URL}\n\nChecklist:\n• Backend server is running on port 8000\n• IP address ${getApiUrl().split('://')[1].split(':')[0]} is correct\n• Phone and computer on same WiFi\n• Firewall allows port 8000\n• Backend listening on 0.0.0.0\n\nTry opening in browser:\n${API_URL}`;
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      console.error('Full error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    console.log('Component mounted, fetching table...');
    console.log('API URL:', API_URL);
    fetchTable();
  }, []);

  const onRefresh = () => {
    console.log('Manual refresh triggered');
    fetchTable(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF3B30" />
        <Text style={styles.loadingText}>Loading Premier League table...</Text>
        <Text style={styles.debugText}>URL: {API_URL}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>⚠️ Connection Error</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchTable()}>
          <Text style={styles.retryButtonText}>Retry Connection</Text>
        </TouchableOpacity>
        <Text style={styles.helpText}>
          Need help? Check console logs for details
        </Text>
      </View>
    );
  }

  if (tableData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No table data available</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchTable()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF3B30" />
      }
      horizontal={true}
      showsHorizontalScrollIndicator={true}
    >
      <View>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, styles.positionCell]}>Pos</Text>
          <Text style={[styles.headerCell, styles.teamCell]}>Team</Text>
          <Text style={[styles.headerCell, styles.statCell]}>P</Text>
          <Text style={[styles.headerCell, styles.statCell]}>W</Text>
          <Text style={[styles.headerCell, styles.statCell]}>D</Text>
          <Text style={[styles.headerCell, styles.statCell]}>L</Text>
          <Text style={[styles.headerCell, styles.statCell]}>GF</Text>
          <Text style={[styles.headerCell, styles.statCell]}>GA</Text>
          <Text style={[styles.headerCell, styles.statCell]}>GD</Text>
          <Text style={[styles.headerCell, styles.pointsCell]}>Pts</Text>
        </View>

        {/* Table Rows */}
        {tableData.map((team, index) => {
          const isTopFour = team.position <= 4;
          const isRelegation = team.position >= tableData.length - 2;

          return (
            <View
              key={index}
              style={[
                styles.dataRow,
                isTopFour && styles.topFourRow,
                isRelegation && styles.relegationRow,
              ]}
            >
              <Text style={[styles.dataCell, styles.positionCell]}>
                {team.position}
              </Text>
              <Text style={[styles.dataCell, styles.teamCell]} numberOfLines={1}>
                {team.team}
              </Text>
              <Text style={[styles.dataCell, styles.statCell]}>{team.played}</Text>
              <Text style={[styles.dataCell, styles.statCell]}>{team.won}</Text>
              <Text style={[styles.dataCell, styles.statCell]}>{team.draw}</Text>
              <Text style={[styles.dataCell, styles.statCell]}>{team.lost}</Text>
              <Text style={[styles.dataCell, styles.statCell]}>{team.goals_for}</Text>
              <Text style={[styles.dataCell, styles.statCell]}>{team.goals_against}</Text>
              <Text
                style={[
                  styles.dataCell,
                  styles.statCell,
                  team.goal_diff > 0 && styles.positiveGD,
                  team.goal_diff < 0 && styles.negativeGD,
                ]}
              >
                {team.goal_diff > 0 ? '+' : ''}
                {team.goal_diff}
              </Text>
              <Text style={[styles.dataCell, styles.pointsCell, styles.pointsText]}>
                {team.points}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1B',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1B',
    padding: 20,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  debugText: {
    color: '#888',
    marginTop: 10,
    fontSize: 12,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1B',
    padding: 20,
  },
  errorTitle: {
    color: '#FF3B30',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 20,
    lineHeight: 20,
  },
  helpText: {
    color: '#888',
    fontSize: 12,
    marginTop: 15,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1B',
    padding: 20,
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#2A2A2B',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#FF3B30',
  },
  dataRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D2D',
  },
  topFourRow: {
    backgroundColor: '#1a2e1a',
  },
  relegationRow: {
    backgroundColor: '#2e1a1a',
  },
  headerCell: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  dataCell: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
  },
  positionCell: {
    width: 40,
    fontWeight: '600',
  },
  teamCell: {
    width: 140,
    textAlign: 'left',
    fontWeight: '500',
  },
  statCell: {
    width: 35,
  },
  pointsCell: {
    width: 45,
    fontWeight: 'bold',
  },
  pointsText: {
    color: '#FF3B30',
    fontSize: 14,
  },
  positiveGD: {
    color: '#4CAF50',
  },
  negativeGD: {
    color: '#FF3B30',
  },
});