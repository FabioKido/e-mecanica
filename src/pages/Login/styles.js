import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

import logoImage from '../../assets/logo.png';

export const Container = styled.SafeAreaView`
  flex: 1;
  background: #999;
  justify-content: center;
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
  color: #000;
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
  placeholderTextColor: '#000',
})`
  height: 48px;
  font-size: 17px;
  color: #fff;
  flex: 1;
`;

export const EnvelopeIcon = styled(MaterialIcons).attrs({
  name: 'mail-outline',
})`
  color: #000;
  font-size: 20px;
`;

export const LockIcon = styled(MaterialIcons).attrs({
  name: 'lock-outline',
})`
  color: #000;
  font-size: 20px;
`;

export const SubmitButton = styled.TouchableOpacity`
  height: 50px;
  background-color: #0C7DC9;
  justify-content: center;
  align-items: center;
`;

export const SubmitButtonText = styled.Text`
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 2.8px;
`;

export const NewAccountButton = styled.TouchableOpacity`
  height: 42px;
  background-color: #F6AC2D;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

export const NewAccountButtonText = styled.Text`
  color: #fff;
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 2.8px;
`;

export const ForgotPasswordButton = styled.TouchableOpacity`
  margin: 30px 0 50px;
  align-items: center;
`;

export const ForgotPasswordButtonText = styled.Text`
  color: #000;
  font-size: 16px;
`;
