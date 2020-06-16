import styled from 'styled-components/native';
import { StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';

export const Container = styled.KeyboardAvoidingView.attrs({
  behavior: Platform.OS === 'ios' ? 'padding' : null,
})`
  flex: 1;
  background: #000;
  padding-top: ${Constants.statusBarHeight}px;
`;

export const Content = styled.ScrollView``;

export const FormContainer = styled.View`
  padding: 30px;
`;

export const Title = styled.Text`
  font-size: 18px;
  color: #fff;
  font-weight: bold;
  letter-spacing: 2.8px;
  text-transform: uppercase;
  text-align: center;
`;

export const Description = styled.Text`
  text-align: center;
  color: #999;
  font-size: 15px;
  margin: 5px 0 30px;
  max-width: 260px;
  align-self: center;
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

export const SwitchContainer = styled.View`
  margin-bottom: 30px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const SwitchText = styled.Text`
  color: #e6e6e6;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 2.8px;
  text-transform: uppercase;
`;

export const SubmitButton = styled.TouchableOpacity`
  height: 50px;
  background-color: #38b6ff;
  justify-content: center;
  align-items: center;
  border-radius: 6;
`;

export const SubmitButtonText = styled.Text`
  color: #fff;
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
  color: #f8a920;
  font-size: 16px;
`;

export const CategoryCards = styled.FlatList``;

export const Empty = styled.Text`
  text-align: center;
  color: #999;
  margin-right: 10%;
  font-size: 15px;
`;

export const CategoryCard = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  width: 100%;
  height: 86px;
  align-items: stretch;
  background: #202020;
  margin-bottom: 15px;
  flex-direction: row;
  border-radius: 6;
  overflow: hidden;
`;

export const CategoryInfo = styled.View`
  flex: 1;
  justify-content: space-between;
  padding: 15px 0;
`;

export const CategoryTitle = styled.Text`
  margin: 0 15px 5px;
  color: #38b6ff;
  font-size: 16px;
  font-weight: bold;
`;

export const CategoryContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-left: 15px;
`;

export const CategoryName = styled.Text`
  color: #fff;
  font-size: 13px;
  font-weight: bold;
`;

export const CategoryIndicatorName = styled.Text`
  font-weight: normal;
  color: #999;
`;

export const CategoryStatus = styled.Text`
  color: #f8a920;
  font-size: 12px;
  font-weight: bold;
  margin-right: 15px;
`;