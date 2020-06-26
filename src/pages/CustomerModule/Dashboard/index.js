import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { PieChart, BarChart, XAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale';

import { LinearGradient } from 'expo-linear-gradient';

import { FontAwesome5 } from '@expo/vector-icons';

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

export default function Dashboard({ navigation }) {

  const [customers, setCustomers] = useState([]);
  const [fabricators, setFabricators] = useState([]);
  const [models, setModels] = useState([]);

  const [fabricator_value, setFabricatorValue] = useState('Clique na Cor');
  const [model_label, setModelLabel] = useState('');
  const [model_value, setModelValue] = useState(0);

  const [loading, setLoading] = useState([]);

  useEffect(() => {
    async function loadInfos() {
      try {
        setLoading(true);

        const response = await api.get('/dashboard/customers');
        const { customers, fabricators, models } = response.data;

        setCustomers(customers);
        setFabricators(fabricators);
        setModels(models);

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadInfos();
  }, []);

  // TODO Resolver o loading, com gradient e lottie talves.

  if (loading) {
    return (
      <LinearGradient
        colors={['#600080', '#000']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator />
      </LinearGradient>
    );
  } else {

    const colors = [
      '#600080',
      '#9900cc',
      '#c61aff',
      '#d966ff',
      '#ecb3ff'
    ]

    const custData = [
      {
        key: 1,
        value: customers[0] ? customers[0].count : 0,
        svg: { fill: customers[0].sex === 'M' ? '#600080' : '#9900cc' },
        arc: { outerRadius: '110%' }
      },
      {
        key: 2,
        value: customers[1] ? customers[1].count : 0,
        svg: { fill: customers[1].sex === 'M' ? '#600080' : '#9900cc' }
      }
    ]

    const fabData = fabricators.map(({ fabricator: label, count }, index) => {
      return {
        label,
        value: count,
        svg: { fill: colors[index], onPress: () => setFabricatorValue(count) },
      }
    });

    const modelData = models.map(({ model: key, count }, index) => {
      return {
        key,
        value: count,
        svg: { fill: colors[index] },
        arc: { outerRadius: (70 + count) + '%', padAngle: model_label === key ? 0.1 : 0 },
        onPress: () => {
          setModelLabel(key)
          setModelValue(count)
        }
      }
    });

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
                  <CardTitle>Top 3 - Fabricantes</CardTitle>
                  <BarChart
                    style={{ flex: 1, marginTop: 15, width: 250, alignSelf: 'center' }}
                    data={fabData}
                    yAccessor={({ item }) => item.value}
                    gridMin={0}
                  />
                  <XAxis
                    style={{ marginTop: 10, width: 250, alignSelf: 'center' }}
                    data={fabData}
                    scale={scale.scaleBand}
                    formatLabel={(_, index) => fabData[index].label}
                  />
                  <CardName style={{ color: '#9900cc', alignSelf: 'center' }}>
                    {fabricator_value}
                  </CardName>
                </CardInfo>
              </Card>

              <Card>
                <CardInfo>
                  <CardTitle>Top 5 - Modelos</CardTitle>
                  <PieChart
                    style={{ flex: 1 }}
                    outerRadius={'80%'}
                    innerRadius={'45%'}
                    data={modelData}
                  />
                  {model_value === 0 ?
                    <CardName style={{ color: '#9900cc', alignSelf: 'center' }}>
                      Clique na cor - Informações
                    </CardName>
                    :
                    <CardName style={{ color: '#9900cc', alignSelf: 'center' }}>
                      {model_label} - {model_value}
                    </CardName>}
                </CardInfo>
              </Card>

              <Card>
                <CardInfo>
                  <CardTitle>Gênero - Clientes</CardTitle>
                  <PieChart
                    style={{ flex: 1 }}
                    outerRadius={'70%'}
                    innerRadius={10}
                    data={custData}
                  />
                  <CardContainer>
                    <CardName style={{ color: customers[0].sex === 'M' ? '#600080' : '#9900cc' }}>
                      {customers[0].sex === 'M' ? 'Homens:' : 'Mulheres'} {customers[0].count}
                    </CardName>
                    <CardName style={{ color: customers[1].sex === 'M' ? '#600080' : '#9900cc' }}>
                      {customers[1].sex === 'M' ? 'Homens:' : 'Mulheres'} {customers[1].count}
                    </CardName>
                  </CardContainer>
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