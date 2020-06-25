import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Switch
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons } from '@expo/vector-icons';

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

import { getBikeInfo } from '../../../../../services/infos';

export default function Bike({ vehicle, setIsVisible, reloadVehicles }) {

  const modelInputRef = useRef();
  const yearFabInputRef = useRef();
  const yearModelInputRef = useRef();
  const colorInputRef = useRef();
  const observationsInputRef = useRef();

  const [fabricator, setFabricator] = useState(vehicle.fabricator);
  const [model, setModel] = useState(vehicle.model);
  const [year_fab, setYearFab] = useState(vehicle.year_fab);
  const [year_model, setYearModel] = useState(vehicle.year_model);
  const [color, setColor] = useState(vehicle.color);
  const [observations, setObservations] = useState(vehicle.observations);

  const [hand_brake, setHandBrake] = useState(false);

  const [more_info, setMoreInfo] = useState(false);
  const [value_click, setValueClick] = useState(true);

  const [loading, setLoading] = useState(false);

  async function getInfos() {
    if (value_click) {
      try {
        setLoading(true);

        const response = await getBikeInfo(vehicle.id);
        const {
          hand_brake
        } = response.data;

        setHandBrake(hand_brake)

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
        hand_brake
      });

      Alert.alert('Sucesso!', 'Veículo atualizado com sucesso.');
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
    hand_brake
  ]);

  return (
    <LinearGradient
      colors={['#2b475c', '#000']}
      style={{ flex: 1 }}
    >
      <Container>
        <Content keyboardShouldPersistTaps="handled">
          <FormContainer>
            <Title>{vehicle.id_customer}</Title>
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
              <MaterialIcons name="lock" size={20} color="#999" />
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
              <MaterialIcons name="lock" size={20} color="#999" />
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
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              <MaterialIcons name="lock" size={20} color="#999" />
            </InputContainer>

            <ChoiceButton
              onPress={() => {
                setMoreInfo(ant => !ant)
                getInfos()
              }}
            >
              <ChoiceText>Informações Adicionais?</ChoiceText>
            </ChoiceButton>

            {more_info &&
              <SwitchContainer>
                <SwitchText>Freio de Mão</SwitchText>

                <Switch
                  thumbColor="#f8a920"
                  trackColor={{ true: '#f8a920', false: '#2b475c' }}
                  value={hand_brake}
                  onValueChange={setHandBrake}
                />
              </SwitchContainer>
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