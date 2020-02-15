import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';

export default function Dashboard() {

  useEffect(() => {
    
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text>Logado</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});