import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState, useEffect } from "react";
import { guessLeague } from "../../utils/leagueHelper";
// --- FIX: We MUST use WebView for an 'embedUrl'
import { WebView } from "react-native-webview";
// --- FIX: Remove expo-video, it can't play a webpage
// import { useVideoPlayer, VideoView } from "expo-video";

interface Team {
  id: number;
  name: string;
}

interface Match {
  id: number;
  teams: {
    home: Team;
    away: Team;
  };
  date: string;
  sources?: any[];
}

// This will be the object from the array
interface StreamDetails {
  embedUrl: string;
  hd: boolean;
  id: string;
  language: string;
  source: string;
}

export default function LeagueDetail() {
  const { id, name } = useLocalSearchParams();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [matchData, setMatchData] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  // --- FIX: This will hold the stream object, e.g., { embedUrl: "..." }
  const [selectedStream, setSelectedStream] = useState<StreamDetails | null>(
    null
  );

  const [isListLoading, setIsListLoading] = useState(true);
  const [isStreamLoading, setIsStreamLoading] = useState(false);

  // --- FIX: This state will hold the 'embedUrl'
  const [streamUrl, setStreamUrl] = useState<string | null>(null);

  // --- FIX: All 'useVideoPlayer' and 'useEvent' hooks are removed.
  // They are not needed for a WebView.

  const openModal = (match: Match) => {
    setSelectedMatch(match);
    setSelectedStream(null);
    setStreamUrl(null); // --- FIX: Clear the previous stream URL
    setModalVisible(true);
  };

  const handleStreamSelect = (stream: StreamDetails) => {
    setSelectedStream(stream);
    setIsStreamLoading(false);
  };

  const formatMatchDate = (timestamp: string | number) => {
    try {
      const date = new Date(Number(timestamp));
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Time TBD";
    }
  };

  const fetchMatchData = async () => {
    // ... (This function was correct, no change needed)
    try {
      const response = await fetch(
        "https://streami.su/api/matches/football/popular",
        {
          headers: {
            maxAge: "432000",
          },
        }
      );
      const data = await response.json();
      const filteredData = (data || []).filter((m: any) => {
        const homeName = m?.teams?.home?.name;
        const awayName = m?.teams?.away?.name;
        return (
          (homeName && guessLeague(homeName) === name) ||
          (awayName && guessLeague(awayName) === name)
        );
      });

      setMatchData(filteredData);
      return filteredData;
    } catch (error) {
      console.error("Error fetching match data:", error);
      throw error;
    }
  };

  // --- FIX: This function is now corrected to handle the API response
  const fetchSelectedServer = async (source: any) => {
    try {
      setSelectedStream(null);
      setStreamUrl(null);
      setIsStreamLoading(true);

      const response = await fetch(
        `https://streamed.pk/api/stream/${source.source}/${source.id}`
      );
      const data = await response.json(); // data is an array: [] or [{"embedUrl": ...}]
      console.log("Fetched stream data:", data);

      // Check if data is an array and has at least one element
      if (Array.isArray(data) && data.length > 0) {
        const streamDetails = data[0]; // Get the first object

        // Check for 'embedUrl'
        if (streamDetails.embedUrl) {
          setStreamUrl(streamDetails.embedUrl); // Set the URL for the WebView
          handleStreamSelect(streamDetails); // Pass the full stream object
        } else {
          console.error("Stream object missing 'embedUrl' property:", streamDetails);
          setIsStreamLoading(false); // Stop loading
        }
      } else {
        // This handles the '[]' case
        console.error("No stream data returned (empty array):", data);
        setIsStreamLoading(false); // Stop loading
      }
    } catch (error) {
      console.error("Error fetching selected server:", error);
      setIsStreamLoading(false);
    }
  };

  const onRefresh = async () => {
    // ... (This function was correct, no change needed)
    setRefreshing(true);
    try {
      await fetchMatchData();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // ... (This function was correct, no change needed)
    const loadData = async () => {
      setIsListLoading(true);
      try {
        await fetchMatchData();
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsListLoading(false);
      }
    };

    loadData();
  }, []);

  useFocusEffect(
    // ... (This function was correct, no change needed)
    useCallback(() => {
      navigation.setOptions({
        title: name ? String(name) : "League Matches",
        headerStatusBarHeight: 0,
        headerStyle: {
          backgroundColor: "#1A1A1B",
          elevation: 0,
          shadowOpacity: 0,
          height:
            (Platform.OS === "ios" ? 44 : 56) + (StatusBar.currentHeight || 0),
          marginTop: 50,
        },
      });
    }, [name, navigation])
  );

  if (isListLoading && !refreshing) {
    // ... (This function was correct, no change needed)
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF5F57" />
          <Text style={styles.loadingText}>Loading Matches...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={matchData}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No matches available</Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#FF5F57"]}
              tintColor="#FF5F57"
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.matchCard}
              onPress={() => {
                openModal(item);
              }}
            >
              {/* ... (match card JSX, no changes) ... */}
              <View style={styles.teamsContainer}>
                <View style={styles.teamContainer}>
                  <Text style={styles.teamName}>
                    {item?.teams?.home?.name || "Home"}
                  </Text>
                </View>

                <View style={styles.vsContainer}>
                  <Text style={styles.vsText}>VS</Text>
                </View>

                <View style={styles.teamContainer}>
                  <Text style={styles.teamName}>
                    {item?.teams?.away?.name || "Away"}
                  </Text>
                </View>
              </View>

              <View style={styles.matchInfo}>
                <Text style={styles.matchDetails}>
                  {item?.date ? formatMatchDate(item.date) : "Time TBD"}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* --- Modal --- */}
        <Modal
          onRequestClose={() => setModalVisible(false)}
          visible={modalVisible}
          style={{
            backgroundColor: "#1A1A1B",
            padding: 10,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
          animationType="slide"
        >
          <View
            style={{
              backgroundColor: "#1A1A1B",
              padding: 10,
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#fff",
                  alignSelf: "center",
                }}
              >
                Available Server
              </Text>
            </View>
            {selectedMatch ? (
              <>
                {isStreamLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FF5F57" />
                    <Text style={styles.loadingText}>Loading Stream...</Text>
                  </View>
                ) : // --- FIX: Show WebView only if a stream AND streamUrl are ready
                selectedStream && streamUrl ? (
                  <>
                    <View style={styles.streamContainer}>
                      {/* --- FIX: Replaced VideoView with WebView --- */}
                      <WebView
                        style={styles.webview}
                        source={{ uri: streamUrl }}
                        allowsInlineMediaPlayback
                        mediaPlaybackRequiresUserAction={false} 
                        
                        onShouldStartLoadWithRequest={(request) => {
                          const { url, isTopFrame } = request;
                          if (url === streamUrl){
                            return true;
                          }
                          if (isTopFrame){
                            return false;
                          }
                          return false;
                        }}
                      />
                    </View>
                    <View style={styles.streamInfo}>
                      <Text style={styles.streamText}>
                        {selectedStream.source} • {selectedStream.language}
                      </Text>
                      <Text style={styles.streamText}>
                        {selectedStream.hd ? "HD" : "SD"}
                      </Text>
                    </View>
                  </>
                ) : selectedMatch.sources && selectedMatch.sources.length > 0 ? (
                  selectedMatch.sources.map((src: any, index: number) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => fetchSelectedServer(src)}
                      style={styles.serverButton}
                    >
                      <Text style={styles.serverButtonText}>
                        {src.source.charAt(0).toUpperCase() +
                          src.source.slice(1)}{" "}
                        Server
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noStreamsText}>
                    No streams available for this match.
                  </Text>
                )}
              </>
            ) : (
              <Text style={{ color: "#ccc", marginBottom: 10 }}>
                Loading match info...
              </Text>
            )}

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (All other styles are the same, except for streamInfo)
  safeArea: {
    flex: 1,
    backgroundColor: "#1A1A1B",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#FF5F57",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
  },
  streamContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    marginTop: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
    width: "100%",
    backgroundColor: "#000", // WebView background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1A1A1B",
    minHeight: 250,
  },
  loadingText: {
    color: "#FFFFFF",
    marginTop: 10,
  },
  streamInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#262626",
    width: "100%",
    marginTop: 5, // Give it space from the WebView
    borderRadius: 4,
  },
  streamText: {
    color: "#fff",
    fontSize: 14,
  },
  serverButton: {
    height: 60,
    width: "100%",
    backgroundColor: "#262626",
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  serverButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  noStreamsText: {
    color: "#ccc",
    marginVertical: 20,
    textAlign: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    width: "100%",
    paddingTop: 5,
    paddingHorizontal: 5,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 100,
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
  },
  matchCard: {
    width: "100%",
    marginTop: 5,
    backgroundColor: "#1E1E23",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  teamsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  teamContainer: {
    flex: 1,
    alignItems: "center",
  },
  teamName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",

  },
  vsContainer: {
    backgroundColor: "#2A2A30",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 70,
    alignItems: "center",
    marginHorizontal: 10,
  },
  vsText: {
    color: "#FF5F57",
    fontSize: 16,
    fontWeight: "bold",
  },
  matchInfo: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  matchDetails: {
    color: "#A0A0A0",
    fontSize: 13,
    fontWeight: "500",
  },
});