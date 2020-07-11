import * as React from "react";
import { StyleSheet, View } from "react-native";

const size = 200;
const styles = StyleSheet.create({
  container: {
    width: size,
    height: size,
    flexDirection: "row",
    flexWrap: "wrap",
    transform: [{ rotate: "45deg" }]
  },
  square: {
    width: size / 2,
    height: size / 2,
    borderRadius: size * 0.1,
    borderWidth: 3,
    borderColor: "white"
  },
  a: {
    backgroundColor: "#592f2a"
  },
  b: {
    backgroundColor: "#2b5b2e"
  },
  c: {
    backgroundColor: "#600080"
  },
  d: {
    backgroundColor: "#2b475c"
  }
});

export default () => (
  <View style={styles.container}>
    <View style={[styles.square, styles.a]} />
    <View style={[styles.square, styles.b]} />
    <View style={[styles.square, styles.c]} />
    <View style={[styles.square, styles.d]} />
  </View>
);

