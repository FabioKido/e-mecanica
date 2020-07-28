import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons } from '@expo/vector-icons';

import { useDispatch } from 'react-redux';

import {
  Container,
  Content,
  FormContainer,
  InputContainer,
  Title,
  Description,
  InputTitle,
  Input,
  SwitchContainer,
  SwitchText,
  ChoiceButton,
  ChoiceText,
  SubmitButton,
  SubmitButtonText,
  DeleteButtonBox,
  DeleteButton,
  DeleteButtonText,
  CancelarButton,
  CancelarButtonText
} from '../styles';

import api from '../../../../../services/api';
import { getAutomovelInfo } from '../../../../../services/infos';

import CheckBox from "../../../../../components/CheckBox";
import LoadGif from '../../../../../assets/loading.gif';

import { loadDashboardRequest } from '../../../../../store/modules/customer/actions';

export default function Auto({ vehicle, setIsVisible, reloadVehicles }) {

  const dispatch = useDispatch();

  const modelInputRef = useRef();
  const yearFabInputRef = useRef();
  const yearModelInputRef = useRef();
  const colorInputRef = useRef();
  const observationsInputRef = useRef();

  const motorInputRef = useRef();
  const fuelInputRef = useRef();
  const carExchangeInputRef = useRef();
  const directionInputRef = useRef();
  const doorsInputRef = useRef();
  const chassisInputRef = useRef();
  const renavamInputRef = useRef();

  const [fabricator, setFabricator] = useState(vehicle.fabricator);
  const [model, setModel] = useState(vehicle.model);
  const [year_fab, setYearFab] = useState(vehicle.year_fab);
  const [year_model, setYearModel] = useState(vehicle.year_model);
  const [color, setColor] = useState(vehicle.color);
  const [observations, setObservations] = useState(vehicle.observations);

  const [board, setBoard] = useState('');
  const [motor, setMotor] = useState('');
  const [fuel, setFuel] = useState('Gasolina');
  const [car_exchange, setCarExchange] = useState('');
  const [direction, setDirection] = useState('');
  const [doors, setDoors] = useState('');
  const [chassis, setChassis] = useState('');
  const [renavam, setRenavam] = useState('');
  const [ar, setAr] = useState(false);

  const [more_info, setMoreInfo] = useState(false);
  const [value_click, setValueClick] = useState(true);

  const [loading, setLoading] = useState(false);
  const [first_loading, setFirstLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setFirstLoading(false), 300);
  });

  async function getInfos() {
    if (value_click) {
      try {
        setLoading(true);

        const response = await getAutomovelInfo(vehicle.id);
        const {
          board,
          motor,
          fuel,
          car_exchange,
          direction,
          doors,
          chassis,
          renavam,
          ar
        } = response.data;

        setBoard(board);
        setMotor(motor);
        setFuel(fuel);
        setCarExchange(car_exchange);
        setDirection(direction);
        setDoors(doors);
        setChassis(chassis);
        setRenavam(renavam);
        setAr(ar);

      } catch (err) {
        console.log(err);
      } finally {
        setValueClick(false);
        setLoading(false);
      }
    }
  }

  const handleDeleteVehicle = async () => {
    try {
      await api.delete(`/vehicles/${vehicle.id}`);

      Alert.alert('Excluído!', 'Veículo deletado com sucesso.');

      dispatch(loadDashboardRequest());
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na exclusão do veículo.'
      );
    } finally {
      reloadVehicles();
      setIsVisible(false);
    }
  }

  const handleUpdateVehicle = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      await api.put(`/vehicles/${vehicle.id}`, {
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
        ar
      });

      Alert.alert('Sucesso!', 'Veículo atualizado com sucesso.');

      dispatch(loadDashboardRequest());
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na atualização de veículo, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadVehicles();
    }
  }, [
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
    ar
  ]);

  if (first_loading) {
    return (
      <LinearGradient
        colors={['#2b475c', '#000']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Image source={LoadGif} resizeMode='contain' style={{ height: 75, width: 75 }} />
      </LinearGradient>
    );
  } else {
    return (
      <LinearGradient
        colors={['#2b475c', '#000']}
        style={{ flex: 1 }}
      >
        <Container>
          <Content keyboardShouldPersistTaps="handled">
            <FormContainer>
              <Title>Veículo - {vehicle.id}</Title>
              <Description>
                Edite ou exclua esse veículo como quiser.
            </Description>

              <InputTitle>Fabricante</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Fabricante do veículo"
                  autoCapitalize="words"
                  autoCorrect={false}
                  maxLength={60}
                  onChangeText={setFabricator}
                  value={fabricator}
                  returnKeyType="next"
                  onSubmitEditing={() => modelInputRef.current.focus()}
                />
                <MaterialIcons name="edit" size={18} color="#999" />
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
                <MaterialIcons name="edit" size={18} color="#999" />
              </InputContainer>

              <InputTitle>Ano de Fabricação</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Ano de fabriccação"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="numeric"
                  maxLength={4}
                  ref={yearFabInputRef}
                  onChangeText={setYearFab}
                  value={year_fab === null ? '' : String(year_fab)}
                  returnKeyType="next"
                  onSubmitEditing={() => yearModelInputRef.current.focus()}
                />
                <MaterialIcons name="edit" size={18} color="#999" />
              </InputContainer>

              <InputTitle>Ano do Modelo</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Ano do modelo"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="numeric"
                  maxLength={4}
                  ref={yearModelInputRef}
                  onChangeText={setYearModel}
                  value={year_model === null ? '' : String(year_model)}
                  returnKeyType="next"
                  onSubmitEditing={() => colorInputRef.current.focus()}
                />
                <MaterialIcons name="edit" size={18} color="#999" />
              </InputContainer>

              <InputTitle>Cor</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Cor do veículo"
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={60}
                  ref={colorInputRef}
                  onChangeText={setColor}
                  value={color}
                  returnKeyType="next"
                  onSubmitEditing={() => observationsInputRef.current.focus()}
                />
                <MaterialIcons name="edit" size={18} color="#999" />
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
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <MaterialIcons name="edit" size={18} color="#999" />
              </InputContainer>

              <ChoiceButton
                onPress={() => {
                  setMoreInfo(ant => !ant)
                  getInfos()
                }}
              >
                <ChoiceText>Informações Extras?</ChoiceText>

                <MaterialIcons name="youtube-searched-for" size={20} color="#f8a920" />
              </ChoiceButton>

              {more_info &&
                <>
                  <InputTitle>Placa</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Placa do veículo"
                      autoCapitalize="characters"
                      autoCorrect={false}
                      maxLength={8}
                      onChangeText={setBoard}
                      value={board}
                      returnKeyType="next"
                      onSubmitEditing={() => motorInputRef.current.focus()}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
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
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>

                  <InputTitle>Combustivel</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Combustivel do veículo"
                      autoCapitalize="none"
                      autoCorrect={false}
                      maxLength={60}
                      ref={fuelInputRef}
                      onChangeText={setFuel}
                      value={fuel}
                      returnKeyType="next"
                      onSubmitEditing={() => carExchangeInputRef.current.focus()}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>

                  <InputTitle>Câmbio</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Câmbio do veículo"
                      autoCapitalize="none"
                      autoCorrect={false}
                      maxLength={60}
                      ref={carExchangeInputRef}
                      onChangeText={setCarExchange}
                      value={car_exchange}
                      returnKeyType="next"
                      onSubmitEditing={() => directionInputRef.current.focus()}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
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
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>

                  <InputTitle>Portas</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Total de portas"
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
                    <MaterialIcons name="edit" size={18} color="#999" />
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
                      placeholder="Chassis do veículo"
                      autoCapitalize="none"
                      autoCorrect={false}
                      maxLength={17}
                      ref={chassisInputRef}
                      onChangeText={setChassis}
                      value={chassis}
                      returnKeyType="next"
                      onSubmitEditing={() => renavamInputRef.current.focus()}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
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
                      onSubmitEditing={handleUpdateVehicle}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>
                </>
              }

              <DeleteButtonBox>
                <DeleteButton onPress={handleDeleteVehicle}>
                  <DeleteButtonText>Excluir</DeleteButtonText>
                </DeleteButton>
                <SubmitButton style={{ width: 125 }} onPress={handleUpdateVehicle}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#333" />
                  ) : (
                      <SubmitButtonText>Salvar</SubmitButtonText>
                    )}
                </SubmitButton>
              </DeleteButtonBox>
              <CancelarButton onPress={() => setIsVisible(false)}>
                <CancelarButtonText>Voltar</CancelarButtonText>
              </CancelarButton>

            </FormContainer>

          </Content>
        </Container>
      </LinearGradient>
    );
  }
}