import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Alert,
  Keyboard,
  View,
  Modal,
  Picker
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import moment from 'moment';
import DatePicker from 'react-native-datepicker';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import {
  Container,
  Content,
  FormContainer,
  InputContainer,
  InputPicker,
  Title,
  Description,
  InputTitle,
  Input,
  ItemButtonBox,
  AddButton,
  AddItemButton,
  DeleteItemButton,
  AddItemButtonText,
  DeleteItemButtonText,
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

import Placeholder from './Placeholder';
import OrderServiceDetail from './OrderServiceDetail';
import CustonModal from './CustonModal';

import api from '../../../services/api';

export default function Orders() {

  const tanqueInputRef = useRef();
  const internalControlInputRef = useRef();
  const observationsInputRef = useRef();

  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState({});
  const [add_order, setAddOrder] = useState(false);

  const [order_service, setOrderService] = useState(0);

  const [customers, setCustomers] = useState([]);
  const [id_customer, setIdCustomer] = useState();

  const [vehicles, setVehicles] = useState([]);
  const [id_vehicle, setIdVehicle] = useState();

  const [km, setKM] = useState('');
  const [tanque, setTanque] = useState('');
  const [internal_control, setInternalControl] = useState('');
  const [observations, setObservations] = useState('');
  const [prevision_exit, setPrevisionExit] = useState('');

  const [date, setDate] = useState();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);

        const response = await api.get('/order/os-all');
        const { orders } = response.data;

        setOrders(orders);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  useEffect(() => {
    if (add_order) {
      async function loadInfos() {
        try {

          const res_cus = await api.get('/customers');
          const { customers } = res_cus.data;

          const res_veh = await api.get('/vehicles');
          const { vehicles } = res_veh.data;

          setCustomers(customers);
          setVehicles(vehicles);
        } catch (err) {
          console.log(err);
        }
      }

      loadInfos();
    }
  }, [add_order]);

  useEffect(() => {
    if (id_customer) {
      async function loadVehicles() {
        try {

          const response = await api.get(`/customers/vehicles/${id_customer}`);
          const { vehicles } = response.data;

          setVehicles(vehicles);

        } catch (err) {
          console.log(err);
        }
      }

      loadVehicles();
    }
  }, [id_customer]);

  function getOrder(order) {
    setOrder(order);

    setIsVisible(true);
  }

  const onDateChange = date => {
    setDate(date);

    const momentObj = moment(date, 'DD-MM-YYYY');

    setPrevisionExit(momentObj);
  };

  async function reloadOrders() {
    try {
      setRefreshing(true);

      const response = await api.get('/order/os-all');
      const { orders } = response.data;

      setOrders(orders);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de OS, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  const handleSaveOrder = useCallback(async (obj_details) => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const response = await api.post('/order/os', {
        id_vehicle,
        km,
        tanque,
        internal_control,
        prevision_exit,
        observations
      });

      await obj_details.map(obj_detail =>
        api.post(`/order/order-service/${response.data.data.id}`, {
          id_service: obj_detail.id_service,
          type: obj_detail.type,
          commission: obj_detail.commission,
          price: obj_detail.price,
          discount: obj_detail.discount,
          premium: obj_detail.premium,
          approved: obj_detail.approved
        })
      );

      await api.post(`/service/timeline/${response.data.data.id}`);

      Alert.alert('Sucesso!', 'Nova OS registrada com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;
      console.log(err)
      Alert.alert(
        'Ooopsss',
        message || 'Falha no registro da nova os, confira seus dados.'
      );
    } finally {
      reloadOrders();
      setLoading(false);
    }
  }, [
    id_vehicle,
    km,
    tanque,
    internal_control,
    prevision_exit,
    observations
  ]);

  function ViewButton() {
    if (add_order) {
      return (
        <CancelarButton onPress={() => setAddOrder(false)}>
          <CancelarButtonText>Voltar</CancelarButtonText>
        </CancelarButton>
      );
    } else {
      return (
        <>
          {loading ? (
            <Placeholder />
          ) : (
              <Cards
                data={orders}
                renderItem={renderOrders}
                keyExtractor={orders => `order-${orders.id}`}
                showsVerticalScrollIndicator={false}
                onRefresh={reloadOrders}
                refreshing={refreshing}
                ListFooterComponent={<View style={{ height: 20 }} />}
                ListEmptyComponent={<Empty>Nenhuma OS encontrada.</Empty>}
              />
            )}
          <SubmitButton onPress={() => setAddOrder(true)}>
            <SubmitButtonText>Nova Ordem</SubmitButtonText>
          </SubmitButton>
        </>
      );
    }
  }

  function renderOrders({ item: order }) {
    const date_order = moment(order.created_at).format('DD-MM-YYYY');

    return (
      <Card
        onPress={() => getOrder(order)}
      >
        <CardInfo>
          <CardTitle numberOfLines={1}>Ordem de Serviço - {order.id}</CardTitle>
          <CardContainer>
            <CardName>
              Registro {' '}
              <CardSubName>({date_order})</CardSubName>
            </CardName>

            <CardStatus>OS - {order.active ? 'Ativa' : 'Finalizada'}</CardStatus>

          </CardContainer>
        </CardInfo>
      </Card>
    );
  }

  // FIXME A commission e o premium vem da configuração do (DONO ou Colaborador) no app(Usar Redux p/ Incluílas se tiver).
  // TODO Fazer as telas que recebem os ids de diag, prev e Agendamentos.
  // TODO Criar a Page de Ordens Rápidas ou Fast Records.

  return (
    <>
      <LinearGradient
        colors={['#2b475c', '#000']}
        style={{ flex: 1 }}
      >
        <Container>
          <Content keyboardShouldPersistTaps="handled">
            <FormContainer>
              <Title>Ordens de Serviços</Title>
              <Description>
                Veja todas as suas OS. Crie ou exclua uma OS como quiser.
              </Description>

              {add_order &&
                <>
                  <InputTitle>Proprietário</InputTitle>
                  <InputPicker>
                    <Picker
                      selectedValue={id_customer}
                      style={{
                        flex: 1,
                        color: '#f8a920',
                        backgroundColor: 'transparent',
                        fontSize: 17
                      }}
                      onValueChange={(itemValue, itemIndex) => setIdCustomer(itemValue)}
                    >
                      <Picker.Item label="Selecione o Proprietário do Veículo" value="" />
                      {customers && customers.map(customer => <Picker.Item key={customer.id} label={customer.name} value={customer.id} />)}
                    </Picker>
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputPicker>

                  <InputTitle>Veículo</InputTitle>
                  <InputPicker>
                    <Picker
                      selectedValue={id_vehicle}
                      style={{
                        flex: 1,
                        color: '#f8a920',
                        backgroundColor: 'transparent',
                        fontSize: 17
                      }}
                      onValueChange={(itemValue, itemIndex) => setIdVehicle(itemValue)}
                    >
                      <Picker.Item label="Selecione o Veículo" value="" />
                      {vehicles && vehicles.map(vehicle => <Picker.Item key={vehicle.id} label={vehicle.model} value={vehicle.id} />)}
                    </Picker>
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputPicker>

                  <InputTitle>Kilometragem</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite o valor em Kilometros"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="numeric"
                      maxLength={8}
                      onChangeText={setKM}
                      value={km}
                      returnKeyType="next"
                      onSubmitEditing={() => tanqueInputRef.current.focus()}
                    />
                    <MaterialIcons name="person-pin" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>Tanque</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite o valor em litros"
                      autoCapitalize="none"
                      autoCorrect={false}
                      ref={tanqueInputRef}
                      keyboardType="numeric"
                      maxLength={4}
                      onChangeText={setTanque}
                      value={tanque}
                      returnKeyType="next"
                      onSubmitEditing={() => internalControlInputRef.current.focus()}
                    />
                    <MaterialIcons name="person-pin" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>Controle Interno</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite uma descrição"
                      autoCapitalize="none"
                      autoCorrect={false}
                      ref={internalControlInputRef}
                      onChangeText={setInternalControl}
                      value={internal_control}
                      returnKeyType="next"
                      onSubmitEditing={() => observationsInputRef.current.focus()}
                    />
                    <MaterialIcons name="person-pin" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>Previsão de Saída</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Clique no calendário para editar"
                      editable={false}
                      value={date}
                    />
                    <DatePicker
                      date={date}
                      is24Hour={true}
                      format="DD-MM-YYYY"
                      minDate="01-01-2001"
                      maxDate="31-12-2030"
                      hideText={true}
                      iconComponent={<FontAwesome5 name="calendar-alt" size={18} color="#999" />}
                      style={{
                        width: 21
                      }}
                      onDateChange={onDateChange}
                    />
                  </InputContainer>

                  <InputTitle>Observações</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite algo a ser observado"
                      autoCapitalize="none"
                      autoCorrect={false}
                      ref={observationsInputRef}
                      onChangeText={setObservations}
                      value={observations}
                      returnKeyType="next"
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputContainer>

                  {order_service === 0 &&
                    <AddButton onPress={() => setOrderService(ant => ant + 1)}>
                      <AddItemButtonText>Adicionar Serviço</AddItemButtonText>
                    </AddButton>
                  }

                  {order_service > 0 &&
                    <>
                      <ItemButtonBox>
                        <DeleteItemButton onPress={() => setOrderService(ant => ant === 0 ? ant = 0 : ant - 1)}>
                          <DeleteItemButtonText>Deletar</DeleteItemButtonText>
                        </DeleteItemButton>
                        <AddItemButton onPress={() => setOrderService(ant => ant + 1)}>
                          <AddItemButtonText>Adicionar</AddItemButtonText>
                        </AddItemButton>
                      </ItemButtonBox>

                      <OrderServiceDetail order_service={order_service} loading={loading} handleSaveOrder={handleSaveOrder} />
                    </>
                  }
                </>
              }

              <ViewButton />

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
        <CustonModal order={order} setIsVisible={setIsVisible} reloadOrders={reloadOrders} />
      </Modal>
    </>
  );
}

Orders.navigationOptions = {
  tabBarLabel: 'Ordens',
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome5 name="car-crash" size={18} color={tintColor} />
  ),
};