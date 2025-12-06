import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'react-native';
export function Collapsible({ children, title, logo }: PropsWithChildren & { title: string; logo: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? 'light';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.7}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <IconSymbol
              name="chevron.right"
              size={18}
              weight="medium"
              color={Colors[theme].text}
              style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
            />
            <ThemedText type="defaultSemiBold">{title}</ThemedText>
          </View>
          <Image 
            source={{ uri: logo }} 
            style={styles.logo} 
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 6,
  },
  heading: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 30,
    height: 30,
  },
  content: {
    paddingHorizontal: 1,
    
  },
});