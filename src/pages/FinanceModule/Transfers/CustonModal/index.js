import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import moment from 'moment';

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
  SubmitButton,
  SubmitButtonText,
  DeleteButtonBox,
  DeleteButton,
  DeleteButtonText,
  CancelarButton,
  CancelarButtonText
} from './styles';

import api from '../../../../services/api';
import LoadGif from '../../../../assets/loading.gif';

export default function CustonModal({ transfer, setIsVisible, reloadTransfers, }) {

  const descriptionInputRef = useRef();
  const observationsInputRef = useRef();

  const [description, setDescription] = useState(transfer.description);
  const [observations, setObservations] = useState(transfer.observations);
  const [date_transfer, setDateTransfer] = useState(() => moment(transfer.date).format('DD-MM-YYYY'));

  const [category, setCategory] = useState('');
  const [account_origin, setAccountOrigin] = useState('');
  const [account_destiny, setAccountDestiny] = useState('');

  const [loading, setLoading] = useState(false);
  const [first_loading, setFirstLoading] = useState(true);

  useEffect(() => {

    async function loadInfos() {
      try {

        if (transfer.id_category) {
          const res_cat = await api.get(`/finance/category/${transfer.id_category}`);
          const { category } = res_cat.data;

          setCategory(category.description);
        }

        const res_ori = await api.get(`/finance/account/${transfer.id_account_origin}`);
        const { account: acc_ori } = res_ori.data;

        const res_des = await api.get(`/finance/account/${transfer.id_account_destiny}`);
        const { account: acc_des } = res_des.data;

        setAccountOrigin(acc_ori.title);
        setAccountDestiny(acc_des.title);
      } catch (err) {
        console.log(err);
      } finally {
        setFirstLoading(false);
      }
    }

    setTimeout(loadInfos, 1000);
  }, []);

  const handleDeleteTransfer = async () => {
    try {
      await api.delete(`/finance/transfer/${transfer.id}`);

      Alert.alert('Excluído!', 'Transferência deletada com sucesso. As contas permanecem intactas!');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na exclusão da transferência.'
      );
    } finally {
      setIsVisible(false);
      reloadTransfers();
    }
  }

  const handleUpdateTransfer = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      await api.put(`/finance/transfer/${transfer.id}`, {
        description,
        observations
      });

      Alert.alert('Sucesso!', 'Transfêrencia atualizada com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na atualização da Transferência, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadTransfers();
    }
  }, [
    description,
    observations
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
              <Title>{transfer.description}</Title>
              <Description>
                Edite ou exclua essa transferência. Alguns valores não podem ser alterados, por questão de integridade das informações.
              </Description>

              <InputTitle>Categoria</InputTitle>
              <InputPicker>
                <Input
                  editable={false}
                  style={{ color: '#f8a920' }}
                  value={category || 'Sem categoria'}
                />
                <MaterialIcons name="info" size={20} color="#999" />
              </InputPicker>

              <InputTitle>Conta de Origem</InputTitle>
              <InputContainer>
                <Input
                  editable={false}
                  style={{ color: '#592f2a' }}
                  value={account_origin}
                />
                <MaterialIcons name="info" size={20} color="#999" />
              </InputContainer>

              <InputTitle>Conta de destino</InputTitle>
              <InputContainer>
                <Input
                  editable={false}
                  style={{ color: '#2b5b2e' }}
                  value={account_destiny}
                />
                <MaterialIcons name="info" size={20} color="#999" />
              </InputContainer>

              <InputTitle>Valor Total</InputTitle>
              <InputContainer>
                <Input
                  editable={false}
                  style={{ color: '#f8a920' }}
                  value={String(transfer.total_value)}
                />
                <MaterialIcons name="block" size={20} color="#999" />
              </InputContainer>

              <InputTitle>Transferência</InputTitle>
              <InputContainer>
                <Input
                  editable={false}
                  value={date_transfer}
                />
                <FontAwesome5 name="calendar-alt" size={18} color="#999" />
              </InputContainer>

              <InputTitle>Descrição</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Breve descrição"
                  autoCapitalize="words"
                  autoCorrect={false}
                  ref={descriptionInputRef}
                  onChangeText={setDescription}
                  value={description}
                  returnKeyType="next"
                  onSubmitEditing={() => observationsInputRef.current.focus()}
                />
                <MaterialIcons name="edit" size={18} color="#999" />
              </InputContainer>

              <InputTitle>Observações</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Algo a ser observado"
                  autoCapitalize="none"
                  autoCorrect={false}
                  ref={observationsInputRef}
                  onChangeText={setObservations}
                  value={observations}
                  returnKeyType="send"
                  onSubmitEditing={handleUpdateTransfer}
                />
                <MaterialIcons name="edit" size={18} color="#999" />
              </InputContainer>

              <DeleteButtonBox>
                <DeleteButton onPress={handleDeleteTransfer}>
                  <DeleteButtonText>Excluir</DeleteButtonText>
                </DeleteButton>
                <SubmitButton style={{ width: 125 }} onPress={handleUpdateTransfer}>
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