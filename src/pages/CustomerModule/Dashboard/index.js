import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ActivityIndicator } from 'react-native';
import { PieChart } from 'react-native-svg-charts';

import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import {
  Container,
  Content,
  FormContainer,
  InputContainer,
  Title,
  Description,
  InputTitle,
  Input,
  ChoiceButton,
  ChoiceText,
  SubmitButton,
  SubmitButtonText,
  CancelarButton,
  CancelarButtonText,
  Cards,
  Card,
  CardInfo,
  CardTitle,
  CardContainer,
  CardName,
  CardSubName,
  CardStatus,
  Empty
} from './styles';

import api from '../../../services/api';

export default function Dashboard() {

  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState([]);

  useEffect(() => {
    async function loadInfos() {
      try {
        setLoading(true);

        const response = await api.get('/dashboard/customers');
        const { customers } = response.data;

        setCustomers(customers);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadInfos();
  }, []);

  if (loading) {
    return (
      <CardInfo>
        <ActivityIndicator />
      </CardInfo>
    );
  } else {

    const pieData = [
      {
        key: 1,
        value: customers[0].count,
        svg: { fill: '#600080' },
        arc: { outerRadius: '110%' }
      },
      {
        key: 2,
        value: customers[1].count,
        svg: { fill: '#9900cc' }
      }
    ]

    return (
      <LinearGradient
        colors={['#600080', '#000']}
        style={{ flex: 1 }}
      >
        <Container>
          <Content keyboardShouldPersistTaps="handled">
            <FormContainer>
              <Title>Visão</Title>
              <Description>
                Informações importantes. Use como forma de melhorar seu negócio.
            </Description>

              <Card>
                <CardInfo>
                  <CardTitle>Rank - Fabricantes</CardTitle>
                  <PieChart
                    style={{ height: 200 }}
                    outerRadius={'70%'}
                    innerRadius={10}
                    data={pieData}
                  />
                  <CardStatus>Homens: {customers[0].count}</CardStatus>
                </CardInfo>
              </Card>

              <Card>
                <CardInfo>
                  <CardTitle>Rank - Modelos</CardTitle>
                  <PieChart
                    style={{ height: 200 }}
                    outerRadius={'70%'}
                    innerRadius={10}
                    data={pieData}
                  />
                  <CardStatus>Homens: {customers[0].count}</CardStatus>
                </CardInfo>
              </Card>

              <Card>
                <CardInfo>
                  <CardTitle>Gênero - Clientes</CardTitle>
                  <PieChart
                    style={{ height: 200 }}
                    outerRadius={'70%'}
                    innerRadius={10}
                    data={pieData}
                  />
                  <CardStatus>Homens: {customers[0].count}</CardStatus>
                </CardInfo>
              </Card>

            </FormContainer>

          </Content>
        </Container>
      </LinearGradient>
    );
  }

}

Dashboard.navigationOptions = {
  tabBarLabel: 'Visão',
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome5 name="user-cog" size={18} color={tintColor} />
  ),
};