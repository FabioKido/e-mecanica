import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

import { colors } from '../../../styles';

export const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
`;

export const FormContainer = styled.View`
  padding: 0 30px;
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

export const EnvelopeIcon = styled(MaterialIcons).attrs({
  name: 'mail-outline',
})`
  color: ${ colors.light_gray};
  font-size: 20px;
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
`;

export const BackToLoginButton = styled.TouchableOpacity`
  margin-top: 30px;
  margin-bottom: 50px;
  align-items: center;
`;

export const BackToLoginButtonText = styled.Text`
  color: ${ colors.darker};
  font-size: 16px;
`;
