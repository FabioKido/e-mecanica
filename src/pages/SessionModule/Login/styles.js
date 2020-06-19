import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

import { colors } from '../../../styles';

export const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
`;

export const Title = styled.Text`
  align-self: center;
  color: ${colors.lighter};
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 2.8px;
  margin-bottom: 50px;
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

export const LockIcon = styled(MaterialIcons).attrs({
  name: 'lock-outline',
})`
  color: ${ colors.light_gray};
  font-size: 20px;
`;

export const SubmitButton = styled.TouchableOpacity`
  height: 50px;
  background-color: transparent;
  justify-content: center;
  align-items: center;
  border: 1px solid ${colors.lighter};
  border-radius: 50px;
`;

export const SubmitButtonText = styled.Text`
  color: ${ colors.lighter};
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 2.8px;
`;

export const NewAccountButton = styled.TouchableOpacity`
  height: 42px;
  background-color: ${ colors.regular_yellow};
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  border-radius: 50px;
`;

export const NewAccountButtonText = styled.Text`
  color: ${ colors.dark};
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 2.8px;
`;

export const ForgotPasswordButton = styled.TouchableOpacity`
  margin: 30px 0 50px;
  align-items: center;
`;

export const ForgotPasswordButtonText = styled.Text`
  color: ${ colors.darker};
  font-size: 16px;
`;
