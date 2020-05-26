import React, { useRef, useEffect }  from 'react';
import { Text, StyleSheet } from 'react-native';
import { useField } from '@unform/core';

import { FormInput, ErrorInput } from './styles';

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
      {error ?
        (<ErrorInput ref={ inputRef } defaultValue={defaultValue} { ...rest } />)
        :
        (<FormInput ref={ inputRef } defaultValue={defaultValue} { ...rest } />)
      }
    </>
  );
}

export default Input;
