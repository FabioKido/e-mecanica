import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';
import { PieChart, BarChart, XAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale';

import { LinearGradient } from 'expo-linear-gradient';

import { FontAwesome5 } from '@expo/vector-icons';

import { useSelector, useDispatch } from 'react-redux';

import {
  Container,
  Content,
  FormContainer,
  Title,
  Description,
  Card,
  CardInfo,
  CardTitle,
  CardName
} from './styles';

import LoadGif from '../../../assets/loading.gif';

import { loadDashboardRequest } from '../../../store/modules/customer/actions';

export default function Dashboard() {

  const dispatch = useDispatch();
  const loading = useSelector(state => state.customer.loading);

  const customers = useSelector(state => state.customer.customers);
  const fabricators = useSelector(state => state.customer.fabricators);
  const models = useSelector(state => state.customer.models);

  const [customer_label, setCustomerLabel] = useState('');
  const [customer_type, setCustomerType] = useState('');
  const [customer_value, setCustomerValue] = useState(0);
  const [customer_index, setCustomerIndex] = useState(0);
  const [fabricator_value, setFabricatorValue] = useState('');
  const [fabricator_index, setFabricatorIndex] = useState(1);
  const [model_label, setModelLabel] = useState('');
  const [model_value, setModelValue] = useState(0);
  const [model_index, setModelIndex] = useState(0);

  useEffect(() => {
    async function loadInfos() {
      dispatch(loadDashboardRequest());
    }

    loadInfos();
  }, []);

  // TODO Resolver o loading, com gradient e lottie talves.
  // TODO Resolver quando estiver sem informações.
  // TODO Resolver quando fabricators ou models não tiver nome.

  function getCustomerLabel(label) {
    if (label === 'M') {
      setCustomerType('Homens -');
    } else if (label === 'F') {
      setCustomerType('Mulheres -');
    } else {
      setCustomerType('Não definido');
    }
  }

  if (loading) {
    return (
      <LinearGradient
        colors={['#600080', '#000']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Image source={LoadGif} resizeMode='contain' style={{ height: 75, width: 75 }} />
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

    const custData = customers.map(({ sex: key, count }, index) => {
      return {
        key,
        value: count,
        svg: { fill: colors[index] },
        onPress: () => {
          setCustomerLabel(key)
          setCustomerValue(count)
          setCustomerIndex(index)
          getCustomerLabel(key)
        }
      }
    });

    const fabData = fabricators.map(({ fabricator: label, count }, index) => {
      return {
        label,
        value: count,
        svg: {
          fill: colors[index], onPress: () => {
            setFabricatorValue(count)
            setFabricatorIndex(index)
          }
        },
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
          setModelIndex(index)
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
              <Title>Visão Geral</Title>
              <Description>
                Informações importantes do módulo de clientes. Use como forma de melhorar seu negócio.
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
                  {fabricator_value ?
                    <CardName style={{ color: colors[fabricator_index], alignSelf: 'center' }}>
                      {`Veículos - ${fabricator_value}`}
                    </CardName>
                    :
                    <CardName style={{ color: colors[fabricator_index], alignSelf: 'center' }}>
                      Clique na Cor
                    </CardName>
                  }

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
                      Clique na cor
                    </CardName>
                    :
                    <CardName style={{ color: colors[model_index], alignSelf: 'center' }}>
                      {model_label} - {model_value}
                    </CardName>
                  }
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

                  {customer_value === 0 ?
                    <CardName style={{ color: '#9900cc', alignSelf: 'center' }}>
                      Clique na cor
                    </CardName>
                    :
                    <CardName style={{ color: colors[customer_index], alignSelf: 'center' }}>
                      {customer_type} {customer_value}
                    </CardName>
                  }
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
  tabBarLabel: 'Dashboard',
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome5 name="user-cog" size={18} color={tintColor} />
  ),
};