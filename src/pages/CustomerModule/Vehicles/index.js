import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  View,
  Modal,
  Picker
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useDispatch } from 'react-redux';

import * as Yup from 'yup';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import {
  Container,
  Content,
  FormContainer,
  InputPicker,
  InputContainer,
  Title,
  Description,
  InputTitle,
  Input,
  ChoiceButton,
  ChoiceText,
  SwitchContainer,
  SwitchText,
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
import CustonModal from './CustonModal';

import api from '../../../services/api';
import CheckBox from "../../../components/CheckBox";

import { loadDashboardRequest } from '../../../store/modules/customer/actions';

export default function Vehicles() {

  const dispatch = useDispatch();

  const fabricatorInputRef = useRef();
  const modelInputRef = useRef();
  const yearFabInputRef = useRef();
  const yearModelInputRef = useRef();
  const colorInputRef = useRef();
  const observationsInputRef = useRef();

  const boardInputRef = useRef();
  const motorInputRef = useRef();
  const fuelInputRef = useRef();
  const carExchangeInputRef = useRef();
  const directionInputRef = useRef();
  const doorsInputRef = useRef();
  const chassisInputRef = useRef();
  const renavamInputRef = useRef();

  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState({});
  const [add_vehicle, setAddVehicle] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [id_customer, setIdCustomer] = useState();

  const [fabricator, setFabricator] = useState('');
  const [model, setModel] = useState('');
  const [year_fab, setYearFab] = useState();
  const [year_model, setYearModel] = useState();
  const [color, setColor] = useState('');
  const [observations, setObservations] = useState('');

  const [board, setBoard] = useState('');
  const [motor, setMotor] = useState('');
  const [fuel, setFuel] = useState('Gasolina');
  const [car_exchange, setCarExchange] = useState('');
  const [direction, setDirection] = useState('');
  const [doors, setDoors] = useState('');
  const [chassis, setChassis] = useState('');
  const [renavam, setRenavam] = useState('');
  const [ar, setAr] = useState(false);

  const [hand_brake, setHandBrake] = useState(false);

  const [automovel, setAutomovel] = useState(false);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadVehicles() {
      try {
        setLoading(true);

        const response = await api.get('/vehicles');
        const { vehicles } = response.data;

        setVehicles(vehicles);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadVehicles();
  }, []);

  useEffect(() => {
    if (add_vehicle) {
      async function loadCustomers() {
        try {

          const response = await api.get('/customers');
          const { customers } = response.data;

          setCustomers(customers);
        } catch (err) {
          console.log(err);
        }
      }

      loadCustomers();
    }
  }, [add_vehicle]);

  async function reloadVehicles() {
    try {
      setRefreshing(true);

      const response = await api.get('/vehicles');
      const { vehicles } = response.data;

      setVehicles(vehicles);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de veículos, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  function getVehicle(vehicle) {
    setVehicle(vehicle);

    setIsVisible(true);
  }

  const handleSaveVehicle = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const schema = Yup.object().shape({
        id_customer: Yup.number().required('Cliente é obrigatório'),
        fuel: Yup.string().required('Combustível é obrigatório')
      });

      await schema.validate({ id_customer, fuel }, {
        abortEarly: false,
      });

      await api.post(`/vehicles/${id_customer}/add`, {
        id_customer,
        fabricator,
        model,
        year_fab,
        year_model,
        color,
        observations,
        board,
        motor,
        fuel,
        car_exchange,
        direction,
        doors,
        chassis,
        renavam,
        ar,
        hand_brake,
        automovel
      });

      Alert.alert('Sucesso!', 'Novo veículo registrado com sucesso.');

      dispatch(loadDashboardRequest());
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha no registro de novo veículo, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadVehicles();
    }
  }, [
    id_customer,
    fabricator,
    model,
    year_fab,
    year_model,
    color,
    observations,
    board,
    motor,
    fuel,
    car_exchange,
    direction,
    doors,
    chassis,
    renavam,
    ar,
    hand_brake,
    automovel
  ]);

  function ViewButton() {
    if (add_vehicle) {
      return (
        <>
          <SubmitButton onPress={handleSaveVehicle}>
            {loading ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
                <SubmitButtonText>Salvar</SubmitButtonText>
              )}
          </SubmitButton>
          <CancelarButton onPress={() => setAddVehicle(false)}>
            <CancelarButtonText>Voltar</CancelarButtonText>
          </CancelarButton>
        </>
      );
    } else {
      return (
        <>
          {loading ? (
            <Placeholder />
          ) : (
              <Cards
                data={vehicles}
                renderItem={renderVehicles}
                keyExtractor={vehicles => `vehicle-${vehicles.id}`}
                showsVerticalScrollIndicator={false}
                onRefresh={reloadVehicles}
                refreshing={refreshing}
                ListFooterComponent={<View style={{ height: 20 }} />}
                ListEmptyComponent={<Empty>Nenhum veículo encontrado.</Empty>}
              />
            )}
          <SubmitButton onPress={() => setAddVehicle(true)}>
            <SubmitButtonText>Novo veículo</SubmitButtonText>
          </SubmitButton>
        </>
      );
    }
  }

  function renderVehicles({ item: vehicle }) {
    return (
      <Card
        onPress={() => getVehicle(vehicle)}
      >
        <CardInfo>
          <CardTitle numberOfLines={2}>{vehicle.fabricator}</CardTitle>
          <CardContainer>
            <CardName>
              Modelo{' '}
              <CardSubName>{vehicle.model}</CardSubName>
            </CardName>

            <CardStatus>{vehicle.year_model || ''}</CardStatus>

          </CardContainer>
        </CardInfo>
      </Card>
    );
  }

  // TODO Resolver a margin left do combobox/select.
  // TODO Adcionar o proprietário do veículo.

  return (
    <>
      <LinearGradient
        colors={['#2b475c', '#000']}
        style={{ flex: 1 }}
      >
        <Container>
          <Content keyboardShouldPersistTaps="handled">
            <FormContainer>
              <Title>Veículos</Title>
              <Description>
                Veja todos os seus veículos. Crie ou exclua um veículo como quiser.
              </Description>

              {add_vehicle &&
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
                      <Picker.Item label="Selecione o Proprietário" value="" />
                      {customers && customers.map(customer => <Picker.Item key={customer.id} label={customer.name} value={customer.id} />)}
                    </Picker>
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputPicker>

                  <InputTitle>Fabricante</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Fabricante do veículo"
                      autoCapitalize="words"
                      autoCorrect={false}
                      maxLength={60}
                      ref={fabricatorInputRef}
                      onChangeText={setFabricator}
                      value={fabricator}
                      returnKeyType="next"
                      onSubmitEditing={() => modelInputRef.current.focus()}
                    />
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>Modelo</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Modelo do veículo"
                      autoCapitalize="words"
                      autoCorrect={false}
                      maxLength={60}
                      ref={modelInputRef}
                      onChangeText={setModel}
                      value={model}
                      returnKeyType="next"
                      onSubmitEditing={() => yearFabInputRef.current.focus()}
                    />
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>Ano de Fabricação</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite o ano de fabriccação"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="numeric"
                      maxLength={4}
                      ref={yearFabInputRef}
                      onChangeText={setYearFab}
                      value={year_fab}
                      returnKeyType="next"
                      onSubmitEditing={() => yearModelInputRef.current.focus()}
                    />
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>Ano do Modelo</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite o ano do modelo"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="numeric"
                      maxLength={4}
                      ref={yearModelInputRef}
                      onChangeText={setYearModel}
                      value={year_model}
                      returnKeyType="next"
                      onSubmitEditing={() => colorInputRef.current.focus()}
                    />
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>Cor</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Qual a cor do veículo?"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onChangeText={setColor}
                      maxLength={60}
                      ref={colorInputRef}
                      value={color}
                      returnKeyType="next"
                      onSubmitEditing={() => observationsInputRef.current.focus()}
                    />
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputContainer>

                  <InputTitle>Observações</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Algo importante sobre o veículo"
                      autoCapitalize="none"
                      autoCorrect={false}
                      ref={observationsInputRef}
                      onChangeText={setObservations}
                      value={observations}
                      returnKeyType="next"
                      onSubmitEditing={() =>
                        automovel
                          ? boardInputRef.current.focus()
                          : ''
                      }
                    />
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputContainer>

                  <ChoiceButton
                    onPress={() => setAutomovel(ant => !ant)}
                  >
                    {automovel ? <ChoiceText>Bicicleta?</ChoiceText> : <ChoiceText>Automóvel?</ChoiceText>}
                  </ChoiceButton>

                  {automovel ? (
                    <>
                      <InputTitle>Placa</InputTitle>
                      <InputContainer>
                        <Input
                          placeholder="Digite a placa do veículo"
                          autoCapitalize="characters"
                          autoCorrect={false}
                          maxLength={8}
                          ref={boardInputRef}
                          onChangeText={setBoard}
                          value={board}
                          returnKeyType="next"
                          onSubmitEditing={() => motorInputRef.current.focus()}
                        />
                        <MaterialIcons name="lock" size={20} color="#999" />
                      </InputContainer>

                      <InputTitle>Motor</InputTitle>
                      <InputContainer>
                        <Input
                          placeholder="Informações do motor, ex: nome/etc"
                          autoCapitalize="none"
                          autoCorrect={false}
                          maxLength={100}
                          ref={motorInputRef}
                          onChangeText={setMotor}
                          value={motor}
                          returnKeyType="next"
                          onSubmitEditing={() => fuelInputRef.current.focus()}
                        />
                        <MaterialIcons name="lock" size={20} color="#999" />
                      </InputContainer>

                      <InputTitle>Combustivel</InputTitle>
                      <InputContainer>
                        <Input
                          placeholder="O combustivel do veículo é?"
                          autoCapitalize="none"
                          autoCorrect={false}
                          maxLength={60}
                          ref={fuelInputRef}
                          onChangeText={setFuel}
                          value={fuel}
                          returnKeyType="next"
                          onSubmitEditing={() => carExchangeInputRef.current.focus()}
                        />
                        <MaterialIcons name="lock" size={20} color="#999" />
                      </InputContainer>

                      <InputTitle>Câmbio</InputTitle>
                      <InputContainer>
                        <Input
                          placeholder="Tipo de câmbio do veículo"
                          autoCapitalize="none"
                          autoCorrect={false}
                          maxLength={60}
                          ref={carExchangeInputRef}
                          onChangeText={setCarExchange}
                          value={car_exchange}
                          returnKeyType="next"
                          onSubmitEditing={() => directionInputRef.current.focus()}
                        />
                        <MaterialIcons name="lock" size={20} color="#999" />
                      </InputContainer>

                      <InputTitle>Direção</InputTitle>
                      <InputContainer>
                        <Input
                          placeholder="Ex: hidráulica/eletrica..."
                          autoCapitalize="none"
                          autoCorrect={false}
                          maxLength={60}
                          ref={directionInputRef}
                          onChangeText={setDirection}
                          value={direction}
                          returnKeyType="next"
                          onSubmitEditing={() => doorsInputRef.current.focus()}
                        />
                        <MaterialIcons name="lock" size={20} color="#999" />
                      </InputContainer>

                      <InputTitle>Portas</InputTitle>
                      <InputContainer>
                        <Input
                          placeholder="Possui quantas portas?"
                          autoCapitalize="none"
                          autoCorrect={false}
                          keyboardType="numeric"
                          maxLength={2}
                          ref={doorsInputRef}
                          onChangeText={setDoors}
                          value={doors}
                          returnKeyType="next"
                          onSubmitEditing={() => chassisInputRef.current.focus()}
                        />
                        <MaterialIcons name="lock" size={20} color="#999" />
                      </InputContainer>

                      <SwitchContainer>
                        <SwitchText>Possui Ar?</SwitchText>
                        <CheckBox
                          iconColor="#fff"
                          checkColor="#fff"
                          value={ar}
                          onChange={() => setAr(!ar)}
                        />
                      </SwitchContainer>

                      <InputTitle>Chassis</InputTitle>
                      <InputContainer>
                        <Input
                          placeholder="Insira o chassis do veículo"
                          autoCapitalize="none"
                          autoCorrect={false}
                          maxLength={17}
                          ref={chassisInputRef}
                          onChangeText={setChassis}
                          value={chassis}
                          returnKeyType="next"
                          onSubmitEditing={() => renavamInputRef.current.focus()}
                        />
                        <MaterialIcons name="lock" size={20} color="#999" />
                      </InputContainer>

                      <InputTitle>Renavam</InputTitle>
                      <InputContainer>
                        <Input
                          placeholder="Renavam do veículo"
                          autoCapitalize="none"
                          autoCorrect={false}
                          maxLength={11}
                          ref={renavamInputRef}
                          onChangeText={setRenavam}
                          value={renavam}
                          returnKeyType="send"
                          onSubmitEditing={handleSaveVehicle}
                        />
                        <MaterialIcons name="lock" size={20} color="#999" />
                      </InputContainer>
                    </>
                  ) : (
                      <>
                        <SwitchContainer>
                          <SwitchText>É a Freio de Mão?</SwitchText>
                          <CheckBox
                            iconColor="#fff"
                            checkColor="#fff"
                            value={hand_brake}
                            onChange={() => setHandBrake(!hand_brake)}
                          />
                        </SwitchContainer>
                      </>
                    )}
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
        <CustonModal vehicle={vehicle} setIsVisible={setIsVisible} reloadVehicles={reloadVehicles} />
      </Modal>
    </>
  );
}

Vehicles.navigationOptions = {
  tabBarLabel: 'Veículos',
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome5 name="user-cog" size={18} color={tintColor} />
  ),
};