import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import JogoDados from './components/JogoDados';

export default function App() {
  return (
    <View style={styles.container}>
      <JogoDados />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0e14',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
