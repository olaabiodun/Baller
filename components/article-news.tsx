import { ThemedText } from '@/components/themed-text';
import { Image, StyleSheet, View } from "react-native";

interface ArticleNewsProps {
    article: any;
}

export default function ArticleNews({ article }: ArticleNewsProps) {
    return (
        <View style={styles.container}>
            <Image 
                source={{ uri: article.image || 'https://via.placeholder.com/400x200' }} 
                style={styles.image}
                resizeMode="cover"
            />
            <ThemedText style={styles.title}>{article.title}</ThemedText>
            <ThemedText style={styles.source}>
                Updated on {new Date(article.published_at).toLocaleDateString()}
            </ThemedText>
            <ThemedText style={styles.description} numberOfLines={3}>
                {article.description}
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 7,
        backgroundColor: '#3A3A3A',
        borderRadius: 8,
        marginBottom: 8,
    },
    title: {
        fontSize: 23,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#FFFFFF',
    },
    source: {
        fontSize: 12,
        color: '#8E8E93',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#BDBDBD',
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 8,
    },
});