import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

import logoImage from '../../../assets/logo.png';

export const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  background: #000;
`;

export const Logo = styled.Image.attrs({
  source: logoImage,
})`
  align-self: center;
  margin-bottom: 50px;
`;

export const FormContainer = styled.View`
  padding: 0 30px;
`;

export const InputTitle = styled.Text`
  color: #999;
  font-weight: bold;
`;

export const InputContainer = styled.View`
  flex-direction: row;
  border-bottom-width: ${StyleSheet.hairlineWidth};
  border-color: rgba(255, 255, 255, 0.2);
  justify-content: space-between;
  margin-bottom: 30px;
`;

export const Input = styled.TextInput.attrs({
  placeholderTextColor: '#999',
})`
  height: 48px;
  font-size: 17px;
  color: #fff;
  flex: 1;
`;

export const EnvelopeIcon = styled(MaterialIcons).attrs({
  name: 'mail-outline',
})`
  color: #999;
  font-size: 20px;
`;

export const SubmitButton = styled.TouchableOpacity`
  height: 50px;
  background-color: #f8a920;
  justify-content: center;
  align-items: center;
  border-radius: 6;
`;

export const SubmitButtonText = styled.Text`
  color: #000;
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
  color: #999;
  font-size: 16px;
`;
