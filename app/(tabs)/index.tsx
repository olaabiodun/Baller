import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet, Text, TouchableOpacity,
  View
} from "react-native";
import { Appbar } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

type LeagueItem = {
  id: string;
  name: string;
  image: ImageSourcePropType;
};

type AppRoutes = {
  index: undefined;
  "league/[id]": { id: string; name: string };
};

type Match = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  time: string;
  league: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [leagues, setLeagues] = useState<LeagueItem[]>([
    {
      id: "1",
      name: "Premier League",
      image: require("../../assets/images/pl.jpg"),
    },
    {
      id: "2",
      name: "La Liga",
      image: require("../../assets/images/laliga.jpg"),
    },
    {
      id: "3",
      name: "Serie A",
      image: require("../../assets/images/seriea.jpg"),
    },
    {
      id: "4",
      name: "Ligue 1",
      image: require("../../assets/images/league1.png"),
    },
    {
      id: "5",
      name: "Bundesliga",
      image: require("../../assets/images/Bundesliga.png"),
    },
    {
      id: "6",
      name: "Liga Portugal",
      image: require("../../assets/images/liga.png"),
    },
    { id: "7", name: "SPL", image: require("../../assets/images/spl.jpeg") },
    { id: "8", name: "MLS", image: require("../../assets/images/mls.jpg") },
  ]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLeaguePress = (leagueId: string, leagueName: string) => {
    console.log(`League ${leagueId} pressed`);
    router.push({
      pathname: "/league/[id]",
      params: { id: leagueId, name: leagueName },
    });
  };

  const handleMenuPress = () => {
    setDrawerOpen(true);
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" translucent backgroundColor="transparent" />
        <Appbar.Header style={styles.appBar}>
          <Appbar.Action icon="menu" color="white" onPress={handleMenuPress} />
          <Appbar.Content
            style={styles.appBarContent}
            title="Live"
            color="white"
          />
          <Appbar.Action icon="home" color="white" onPress={() => {}} />
        </Appbar.Header>
        {drawerOpen && (
          <View style={styles.drawerContainer}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Baller</Text>
              <Text style={styles.drawerSubtitle}>Football Live Stream</Text>
            </View>

              
              <TouchableOpacity style={styles.menuItem} onPress={() => { setDrawerOpen(false); router.push('/about'); }}>
                <Text style={styles.menuItemText}>ℹ️ About</Text>
              </TouchableOpacity>
            
            <View style={styles.footer}>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setDrawerOpen(false)}
              >
                <Text style={styles.closeButtonText}>✕ Close</Text>
              </TouchableOpacity>
              <Text style={styles.versionText}>v1.0.0</Text>
            </View>
          </View>
        )}

        <View style={styles.gridContainer}>
          {leagues.map((league) => (
            <TouchableOpacity
              key={league.id}
              activeOpacity={0.4}
              style={styles.box}
              onPress={() => handleLeaguePress(league.id, league.name)}
            >
              <Image source={league.image} style={styles.image} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1B",
  },
  
  appBar: {
    backgroundColor: "transparent",
    elevation: 0,
    marginTop: 0,
    paddingTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#1C1C1CFF",
  },
  appBarContent: {
    alignItems: "center",
  },
  gridContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: "1%",
  },
  box: {
    aspectRatio: 1,
    width: "48%",
    margin: "1%",
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  // Drawer styles
  drawerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#121212',
    width: '80%',
    paddingTop: 50,
    zIndex: 1000,
  },
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D2D',
    marginBottom: 10,
  },
  drawerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  drawerSubtitle: {
    color: '#888',
    fontSize: 14,
  },
  menuContainer: {
    paddingVertical: 10,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#2D2D2D',
    marginVertical: 15,
    marginHorizontal: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2D2D2D',
  },
  closeButton: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  versionText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 12,
  },
});
