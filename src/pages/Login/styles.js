import styled from 'styled-components/native';

export const Loading = styled.ActivityIndicator.attrs({
  size: 'small',
  color: '#999'
})`
  margin: 30px 0;
`;

export const Wrapper = styled.SafeAreaView`
  background: #fff;
  flex: 1;
`;

export const Container = styled.ScrollView``;

export const Header = styled.View`
  height: 50px;
  padding: 0 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.Text`
  padding: 0 16px;
  line-height: 40px;
  font-size: 36px;
  color: #0C7DC9;
`;

export const FormInput = styled.TextInput.attrs({
  placeholderTextColor: '#000',
})`
  margin: 20px 16px;
  padding-left: 16px;
  border-radius: 6px;
  color: #000;
  width: 100%;
  height: 52px;
  border: 1px solid #000;
  font-size: 15px;
  line-height: 18px;
`;

export const FormButton = styled.TouchableOpacity`
  height: 52px;
  background: #0C7DC9;
  justify-content: center;
  align-items: center;
  border: 2px solid #0C7DC9;
  border-radius: 6px;
`;

export const ButtonText = styled.Text`
  color: #FFF;
  font-size: 16;
`;

export const HelpText = styled.Text`
  color: #ddd;
  font-size: 16;
`;

export const Underline = styled.Text`
  font-weight: bold;
`;
