import styled from 'styled-components/native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '../../../../styles';

const Placeholder = styled(ShimmerPlaceHolder).attrs({
  colorShimmer: [`${colors.terciary}`, `${colors.lighter}`, `${colors.terciary}`],
  duration: 1000
})``;

export const Cards = styled.ScrollView``;

export const Container = styled.View`
  width: 100%;
  height: 86px;
  margin-bottom: 15px;

  overflow: hidden;
`;

export const Card = styled(LinearGradient).attrs({
  colors: [`${colors.terciary}`, `${colors.lighter}`],
  start: { x: 0, y: 0.75 },
  end: { x: 1, y: 0.25 },
  locations: [0, 1]
})`
  width: 100%;
  height: 86px;
  border-radius: 6;
  justify-content: center;
  padding: 30px 0 30px 8px;
`;

export const TitlePlaceholder = styled(Placeholder)`
  width: 90%;
  height: 16px;
  margin: 0 15px 5px;
`;

export const DescriptionPlaceholder = styled(Placeholder)`
  width: 90%;
  height: 16px;
  margin-left: 15;
`;

export const Content = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 15px;
  margin-left: 15px;
`;

export const PicturePlaceholder = styled(Placeholder)`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  margin-right: 5px;
`;

export const DescPlaceholder = styled(Placeholder)`
  width: 99px;
  height: 12px;
`;
