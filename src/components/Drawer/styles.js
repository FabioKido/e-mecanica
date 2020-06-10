import styled from 'styled-components/native';

import logoImage from '../../assets/logo.png';

export const Container = styled.SafeAreaView`
  flex: 1;
  background: #000;
  justify-content: center;
`;

export const ScrollDrawer = styled.ScrollView``;

export const Content = styled.View`
  background: #000;
  margin-bottom: 15px;
`;

export const UserName = styled.Text`
  background: #000;
  color: #999;
  margin-bottom: 15px;
  margin-left: 16px;
  font-size: 16;
  font-Weight: bold;
`;

export const Logo = styled.Image.attrs({
  source: logoImage,
})`
  align-self: center;
  margin-bottom: 15px;
`;

export const Logout = styled.TouchableOpacity`
  flex-direction: row;
  margin-left: 16px;
  margin-bottom: 15px;
  align-items: center;
`;

export const LogoutText = styled.Text`
  background: #000;
  color: #f8a920;
  margin-left: 30px;
  font-Weight: bold;
`;
