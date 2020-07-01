import React from 'react';
import Icon from "react-native-vector-icons/FontAwesome";
import { View, TouchableOpacity, StyleSheet } from 'react-native';

export default function CheckBox(props) {

  function handleChange() {
    const { onChange } = props;
    if (onChange) {
      return onChange();
    }
  }

  return (
    <View style={styles.WrapperCheckBox}>

      <TouchableOpacity onPress={handleChange} style={[
        styles.CheckBox,
        { borderColor: props.checkColor ? props.checkColor : '#fff' }
      ]}>

        {
          props.value ? <Icon name="check"
            style={{
              fontSize: 16,
              color: props.iconColor ? props.iconColor : '#fff'
            }}
          /> : null
        }

      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  CheckBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  WrapperCheckBox: {
    flexDirection: "row",
    alignItems: "center"
  }
});