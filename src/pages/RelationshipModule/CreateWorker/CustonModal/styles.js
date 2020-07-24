import styled from 'styled-components/native';
import { StyleSheet, Platform } from 'react-native';
import Constants from 'expo-constants';

import { colors } from '../../../../styles';

export const Container = styled.KeyboardAvoidingView.attrs({
  behavior: Platform.OS === 'ios' ? 'padding' : null,
})`
  flex: 1;
  padding-top: ${Constants.statusBarHeight}px;
`;

export const Content = styled.ScrollView``;

export const FormContainer = styled.View`
  padding: 30px;
`;

export const Title = styled.Text`
  font-size: 24px;
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

export const TitleSection = styled.Text`
  font-size: 16px;
  color: ${ colors.lighter};
  margin-bottom: 30px;
  font-weight: bold;
  letter-spacing: 2.8px;
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
  color: ${colors.lighter};
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 2.8px;
  text-transform: uppercase;
`;

export const ChoiceButton = styled.TouchableOpacity`
  margin-bottom: 30px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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

export const DeleteButtonBox = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const DeleteButton = styled.TouchableOpacity`
  height: 42px;
  width: 125px;
  background-color: transparent;
  justify-content: center;
  align-items: center;
  border: 1px solid ${colors.lighter};
  border-radius: 50px;
`;

export const DeleteButtonText = styled.Text`
  color: ${ colors.lighter};
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 2.8px;
  text-transform: uppercase;
`;

export const CancelarButton = styled.TouchableOpacity`
  margin-top: 30px;
  margin-bottom: 50px;
  align-items: center;
`;

export const CancelarButtonText = styled.Text`
  color: ${ colors.darker};
  font-size: 16px;
`;