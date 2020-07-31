import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Alert,
  View,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import moment from 'moment';

import {
  Container,
  Content,
  FormContainer,
  Title,
  Description,
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

import Placeholder from './Placeholder';
import CustonModal from './CustonModal';

import api from '../../../services/api';
import NavigationService from '../../../services/navigation';

export default function Parcel({ navigation }) {

  const [parcels, setParcels] = useState([]);
  const [parcel, setParcel] = useState({});

  const [payment, setPayment] = useState(navigation.state.params);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadParcels() {
      try {
        setLoading(true);

        const response = await api.get('/order/parcels/', {
          params: { id_payment: payment.id }
        });
        const { parcels } = response.data;

        setParcels(parcels);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadParcels();
  }, []);

  async function reloadParcels() {
    try {
      setRefreshing(true);

      const response = await api.get('/order/parcels/', {
        params: { id_payment: payment.id }
      });
      const { parcels } = response.data;

      setParcels(parcels);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de parcelas, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  function getParcel(parcel) {
    setParcel(parcel);

    setIsVisible(true);
  }

  function renderParcels({ item: parcel }) {
    const parcel_date = moment(parcel.vencimento).format('DD-MM-YYYY');

    return (
      <Card
        onPress={() => getParcel(parcel)}
      >
        <CardInfo>
          <CardTitle numberOfLines={2}>R$ {parcel.value}</CardTitle>
          <CardContainer>
            <CardName>
              Vencimento: {' '}
              <CardSubName>({parcel_date})</CardSubName>
            </CardName>

            <CardStatus>{parcel.paid_out ? 'Paga' : 'á Pagar'}</CardStatus>

          </CardContainer>
        </CardInfo>
      </Card>
    );
  }

  return (
    <>
      <LinearGradient
        colors={['#2b475c', '#000']}
        style={{ flex: 1 }}
      >
        <Container>
          <Content keyboardShouldPersistTaps="handled">
            <FormContainer>
              <Title>Pagamento - {payment.id}</Title>
              <Description>
                Veja os detalhes da(s) parcela(s) deste pagamento. Atualize como quiser.
              </Description>

              {loading ? (
                <Placeholder />
              ) : (
                  <Cards
                    data={parcels}
                    renderItem={renderParcels}
                    keyExtractor={parcels => `details-${parcels.id}`}
                    showsVerticalScrollIndicator={false}
                    onRefresh={reloadParcels}
                    refreshing={refreshing}
                    ListFooterComponent={<View style={{ height: 20 }} />}
                    ListEmptyComponent={<Empty>Não foi possivel encontrar parcelas</Empty>}
                  />
                )}

              <CancelarButton onPress={() => NavigationService.goBack()}>
                <CancelarButtonText>Voltar</CancelarButtonText>
              </CancelarButton>

            </FormContainer>

          </Content>
        </Container>
      </LinearGradient>

      <Modal
        animationType={'slide'}
        transparent={false}
        visible={is_visible}
        onRequestClose={() => setIsVisible(false)}
      >
        <CustonModal parcel={parcel} setIsVisible={setIsVisible} reloadParcels={reloadParcels} id_payment={payment.id} />
      </Modal>
    </>
  );
}