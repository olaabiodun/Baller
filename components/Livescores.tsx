import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

export default function LiveScores({ matches, loading }) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF3B30" />
        <Text style={styles.loadingText}>Loading live scores</Text>
      </View>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No live matches right now</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={matches}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{ paddingBottom: 20 }}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.team}>{item.teams?.home?.name}</Text>
            <Text style={styles.score}>{item.goals?.home} - {item.goals?.away}</Text>
            <Text style={styles.team}>{item.teams?.away?.name}</Text>
          </View>

          <Text style={styles.status}>{item.fixture?.status?.long}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2A2A2B',
    padding: 14,
    borderRadius: 10,
    marginVertical: 6
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  team: {
    fontSize: 16,
    color: '#fff',
    width: '35%'
  },
  score: {
    fontSize: 18,
    color: '#FF3B30',
    fontWeight: 'bold',
    textAlign: 'center',
    width: '30%'
  },
  status: {
    fontSize: 13,
    color: '#AFAFAF',
    textAlign: 'center'
  },
  loadingContainer: {
    marginTop: 40,
    alignItems: 'center'
  },
  loadingText: {
    color: '#fff',
    marginTop: 10
  },
  emptyContainer: {
    marginTop: 40,
    alignItems: 'center'
  },
  emptyText: {
    color: '#fff'
  }
});
