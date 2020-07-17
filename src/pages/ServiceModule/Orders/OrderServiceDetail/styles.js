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

export const SwitchContainer = styled.View`
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

export const InputPicker = styled.View`
  flex-direction: row;
  border-bottom-width: ${StyleSheet.hairlineWidth};
  border-color: ${colors.light_gray};
  margin-bottom: 30px;
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

export const CancelarButton = styled.TouchableOpacity`
  margin-top: 30px;
  margin-bottom: 50px;
  align-items: center;
`;

export const CancelarButtonText = styled.Text`
  color: ${ colors.darker};
  font-size: 16px;
`;

export const Cards = styled.FlatList``;

export const Empty = styled.Text`
  text-align: center;
  color: #999;
  margin-right: 10%;
  font-size: 15px;
`;

export const Card = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  width: 100%;
  height: 86px;
  align-items: stretch;
  background: ${ colors.secondary};
  margin-bottom: 15px;
  flex-direction: row;
  border-radius: 6;
  overflow: hidden;
`;

export const CardInfo = styled.View`
  flex: 1;
  justify-content: space-between;
  padding: 15px 0;
`;

export const CardTitle = styled.Text`
  margin: 0 15px 5px;
  color: ${ colors.darker};
  font-size: 16px;
  font-weight: bold;
`;

export const CardContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-left: 15px;
`;

export const CardName = styled.Text`
  color: #fff;
  font-size: 13px;
  font-weight: bold;
`;

export const CardSubName = styled.Text`
  font-weight: normal;
  color: #999;
`;

export const CardStatus = styled.Text`
  color: #f8a920;
  font-size: 12px;
  font-weight: bold;
  margin-right: 15px;
`;