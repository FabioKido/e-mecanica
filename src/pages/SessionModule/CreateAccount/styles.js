import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

import { colors } from '../../../styles';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding-top: ${Constants.statusBarHeight}px;
`;

export const Title = styled.Text`
  font-size: 28px;
  color: ${ colors.lighter};
  font-weight: bold;
  letter-spacing: 2.8px;
  text-align: center;
`;

export const Description = styled.Text`
  text-align: center;
  color: ${ colors.darker};
  font-size: 15px;
  margin: 5px 0 30px;
  max-width: 260px;
  align-self: center;
`;

export const FormContainer = styled.ScrollView.attrs({
  // contentContainerStyle: { justifyContent: 'center' },
})`
  flex: 1;
  padding: 0 30px;
  margin-top: 30px;
`;

export const InputTitle = styled.Text`
  color: ${ colors.darker};
  font-weight: bold;
`;

export const InputContainer = styled.View`
  flex-direction: row;
  border-bottom-width: ${StyleSheet.hairlineWidth};
  border-color: ${colors.light_gray};
  justify-content: space-between;
  margin-bottom: 30px;
`;

export const Input = styled.TextInput.attrs({
  placeholderTextColor: `${colors.light_gray}`,
})`
  height: 48px;
  font-size: 17px;
  color: ${colors.white};
  flex: 1;
`;

export const SwitchContainer = styled.View`
  margin-bottom: 30px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const SwitchText = styled.Text`
  color: ${ colors.lighter};
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 2.8px;
  text-transform: uppercase;
`;

export const ChoiceText = styled.Text`
  color: ${colors.regular_yellow};
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 2.8px;
  text-transform: uppercase;
`;

export const SubmitButton = styled.TouchableOpacity`
  height: 42px;
  background-color: ${ colors.regular_yellow};
  justify-content: center;
  align-items: center;
  border-radius: 50px;
`;

export const SubmitButtonText = styled.Text`
  color: ${ colors.dark};
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 2.8px;
  text-transform: uppercase;
`;

export const BackToLoginButton = styled.TouchableOpacity`
  margin: 30px 0 50px;
  align-items: center;
`;

export const BackToLoginButtonText = styled.Text`
  color: ${ colors.darker};
  font-size: 16px;
`;
