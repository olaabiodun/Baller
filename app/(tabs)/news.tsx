import ArticleNews from '@/components/article-news';
import { ThemedText } from '@/components/themed-text';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';

export default function TabTwoScreen() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cache for storing news data
  const [newsCache, setNewsCache] = useState<{ [key: number]: any[] }>({});
  const [cacheTimestamps, setCacheTimestamps] = useState<{ [key: number]: number }>({});
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

  const API_KEY = 'api_live_OooIOdPWo0r7SCgyKDVIQzGx3OOQ4ajQvmc6qD3jngzHnNb';
  const CATEGORY_ID = 'medtop:20001065';

  const getApiUrl = () => {
    switch (selectedIndex) {
      case 0: // Popular News
        return `https://api.apitube.io/v1/news/everything?category.id=${CATEGORY_ID}&api_key=${API_KEY}`;
      case 1: // Top News
        return `https://api.apitube.io/v1/news/top-headlines?category.id=${CATEGORY_ID}&api_key=${API_KEY}`;
      default:
        return `https://api.apitube.io/v1/news/everything?category.id=${CATEGORY_ID}&api_key=${API_KEY}`;
    }
  };

  const fetchNews = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const apiUrl = getApiUrl();
      
      if (!apiUrl) {
        // Show PL Table placeholder
        setArticles([{
          id: 'pl-table-placeholder',
          title: 'Premier League Table',
          description: 'Premier League standings and table will be available here soon. Track your favorite teams, positions, points, and match statistics.',
          image: 'https://via.placeholder.com/400x200/FF3B30/FFFFFF?text=PL+Table',
          published_at: new Date().toISOString(),
          isPlaceholder: true
        }]);
        setLoading(false);
        setRefreshing(false);
        return;
      }
      
      // Check cache first (unless refreshing)
      const now = Date.now();
      const cachedData = newsCache[selectedIndex];
      const cacheTime = cacheTimestamps[selectedIndex];
      
      if (!isRefresh && cachedData && cacheTime && (now - cacheTime) < CACHE_TTL) {
        setArticles(cachedData);
        setLoading(false);
        setRefreshing(false);
        return;
      }
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (data.status === 'ok') {
        const articles = data.results || [];
        setArticles(articles);
        
        // Update cache
        setNewsCache(prev => ({ ...prev, [selectedIndex]: articles }));
        setCacheTimestamps(prev => ({ ...prev, [selectedIndex]: now }));
      } else {
        setError('Failed to fetch news');
      }
    } catch (err) {
      setError('Error fetching news');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleIndexChange = (index: number) => {
    setSelectedIndex(index);
    // Reset state and fetch news for new tab
    setArticles([]);
    setError(null);
    fetchNews();
  };

  const onRefresh = useCallback(() => {
    fetchNews(true);
  }, []);

  useEffect(() => {
    fetchNews();
  }, [selectedIndex]);

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.titleContainer}>
          <ThemedText type="title">Football News</ThemedText>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF3B30" />
          <ThemedText style={styles.loadingText}>Loading news...</ThemedText>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.titleContainer}>
          <ThemedText type="title">Football News</ThemedText>
        </View>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.titleContainer}>
        <ThemedText type="title" style={{  }}>
          Football News
        </ThemedText>
      </View>

      <SegmentedControlTab
        values={["Popular News", "Top News"]}
        selectedIndex={selectedIndex}
        onTabPress={handleIndexChange}
        tabsContainerStyle={styles.tabContainer}
        tabStyle={styles.tab}
        activeTabStyle={styles.activeTab}
        tabTextStyle={styles.tabText}
        activeTabTextStyle={styles.activeTabText}
      />
      
      <FlatList
        data={articles}
        renderItem={({ item }) => <ArticleNews article={item} />}
        keyExtractor={(item) => item.id?.toString() || item.title}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF3B30']}
            tintColor="#FF3B30"
          />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>No news articles found</ThemedText>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2
  },
  container: {
    flex: 1,
    backgroundColor: '#1A1A1B',
    paddingHorizontal: 8,
    paddingTop: 60
  },

  tabContainer: {
    marginVertical: 16,
    marginHorizontal: 1,
    borderRadius: 4,
    backgroundColor: '#3A3A3A',
    paddingHorizontal: 3,
    paddingVertical: 2,
  },
  tab: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 7
  },
  activeTab: {
    backgroundColor: '#FF3B30',
    margin: 2,
    borderRadius: 4
  },
  tabText: {
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#FFFFFF'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#8E8E93',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#8E8E93',
    fontSize: 16,
  }
});
