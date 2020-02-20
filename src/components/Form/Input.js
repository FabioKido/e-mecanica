import React, { useRef, useEffect }  from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import { useField } from '@unform/core';

function Input({ name, label, ...rest }) {
  const inputRef = useRef(null);
  const { fieldName, registerField, defaultValue = '', error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: '_lastNativeText',
      getValue(ref) {
        return ref._lastNativeText || '';
      },
      setValue(ref, value) {
        ref.setNativeProps({ text: value });
        ref._lastNativeText = value;
      },
      clearValue(ref) {
        ref.setNativeProps({ text: '' });
        ref._lastNativeText = '';
      }
    })
  }, [fieldName, registerField]);

  return (
  	<>
  	  { error && <Text style={{ color: '#F00' }}>{ error }</Text> }

  	  { label && <Text style={styles.label}>{label}</Text> }
  	  
  	  <TextInput ref={ inputRef } defaultValue={defaultValue} { ...rest } />
    </>
  );
}

const styles = StyleSheet.create({

label: {
  fontWeight: 'bold',
  color: '#0C7CC8',
  marginBottom: 8,
},

});

export default Input;