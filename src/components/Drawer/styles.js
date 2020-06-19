import styled from 'styled-components/native';

import { colors } from '../../styles';

import logoImage from '../../assets/logo.png';

export const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
`;

export const ScrollDrawer = styled.ScrollView``;

export const Content = styled.View`
  background: transparent;
  margin-bottom: 15px;
`;

export const UserContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

export const UserName = styled.Text`
  color: ${colors.regular_yellow};
  margin-bottom: 15px;
  font-size: 20;
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
  color: ${colors.regular_yellow};
  margin-left: 30px;
  font-Weight: bold;
`;
