import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>About Baller</ThemedText>
          <ThemedText style={styles.subtitle}>Version 1.0.0</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>App Description</ThemedText>
          <ThemedText style={styles.sectionText}>
            Baller is your ultimate football companion, bringing you the latest news, 
            live scores, and Premier League standings all in one place. Stay updated 
            with real-time football action and never miss a moment of the beautiful game.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Features</ThemedText>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="newspaper" size={20} color="#FF3B30" />
              <ThemedText style={styles.featureText}>Latest Football News</ThemedText>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="trophy" size={20} color="#FF3B30" />
              <ThemedText style={styles.featureText}>Premier League Table</ThemedText>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="refresh" size={20} color="#FF3B30" />
              <ThemedText style={styles.featureText}>Real-time Updates</ThemedText>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="save" size={20} color="#FF3B30" />
              <ThemedText style={styles.featureText}>Smart Caching</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Data Sources</ThemedText>
          <ThemedText style={styles.sectionText}>
            News data is powered by API Tube, providing comprehensive football coverage 
            from trusted sources worldwide.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Developer</ThemedText>
          <ThemedText style={styles.sectionText}>
            Created with passion for football fans everywhere.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Contact & Support</ThemedText>
          <View style={styles.contactList}>
            <View style={styles.contactItem}>
              <Ionicons name="mail" size={20} color="#8E8E93" />
              <ThemedText 
                style={styles.linkText}
                onPress={() => Linking.openURL('mailto:abiodun2035@gmail.com')}
              >
                abiodun2035@gmail.com
              </ThemedText>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="globe" size={20} color="#8E8E93" />
              <ThemedText 
                style={styles.linkText}
                onPress={() => Linking.openURL('https://baller.app')}
              >
                abiodun.onrender.com</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            © 2025 Baller. All rights reserved.
          </ThemedText>
          <ThemedText style={styles.footerText}>
            Made with ❤️ for football fans
          </ThemedText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1B',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#FFFFFF',
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#E0E0E0',
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#E0E0E0',
  },
  contactList: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  linkText: {
    fontSize: 16,
    color: '#FF3B30',
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#3A3A3A',
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 4,
  },
});
