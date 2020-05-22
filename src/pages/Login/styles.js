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

export const Container = styled.View``;

export const Header = styled.View`
  height: 50px;
  padding: 0 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.Text`
  padding: 0 5% 20px 5%;
  line-height: 40px;
  font-size: 36px;
  color: #0C7DC9;
`;

export const FormButton = styled.TouchableOpacity`
  margin: 10px 5%;
  height: 52px;
  width: 90%;
  background: #0C7DC9;
  justify-content: center;
  align-items: center;
  border: 2px solid #0C7DC9;
  border-radius: 6px;
`;

export const ButtonText = styled.Text`
  color: #FFF;
  font-size: 16;
  font-weight: bold
`;

export const HelpText = styled.Text`
  color: #000;
  font-size: 15;
  line-height: 18px;
  margin: 10px 5%;
`;

export const Underline = styled.Text`
  font-weight: bold;
  text-decoration-line: underline;
`;
