import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export function VehicleSkeleton() {

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4].map(idx => (
        <View key={idx} style={styles.card}>
          <View style={styles.avatar} />
          <View style={styles.textGroup}>
            <View style={styles.title} />
            <View style={styles.subtitle} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: { padding: theme.spacing.md, gap: theme.spacing.md },
  card: { flexDirection: 'row', backgroundColor: theme.colors.surface, padding: theme.spacing.md, borderRadius: theme.radii.lg },
  avatar: { width: 40, height: 40, borderRadius: theme.radii.full, backgroundColor: theme.colors.border, marginRight: theme.spacing.md },
  textGroup: { flex: 1, justifyContent: 'center' },
  title: { width: '80%', height: 16, backgroundColor: theme.colors.border, borderRadius: theme.radii.sm, marginBottom: theme.spacing.xs },
  subtitle: { width: '50%', height: 12, backgroundColor: theme.colors.border, borderRadius: theme.radii.sm },
}));
