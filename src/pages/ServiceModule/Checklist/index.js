import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Alert,
  ActivityIndicator,
  Keyboard,
  View,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import * as Yup from 'yup';

import { MaterialIcons } from '@expo/vector-icons';

import {
  Container,
  Content,
  FormContainer,
  Title,
  Description,
  SwitchContainer,
  InputContainer,
  InputTitle,
  Input,
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

import Placeholder from './Placeholder';
import CustonModal from './CustonModal';

import CheckBox from '../../../components/CheckBox';

import api from '../../../services/api';
import NavigationService from '../../../services/navigation';

export default function ChecklistDetail({ navigation }) {

  const [checklist_details, setChecklistDetails] = useState([]);
  const [checklist_detail, setChecklistDetail] = useState({});
  const [add_checklist_detail, setAddChecklistDetail] = useState(false);

  const [checklist, setChecklist] = useState({});

  const [diagnostic, setDiagnostic] = useState(navigation.state.params);

  const [title, setTitle] = useState('');
  const [checked, setChecked] = useState(false);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadChecklistDetails() {
      try {
        setLoading(true);

        const res_check = await api.get(`/service/checklist/${diagnostic}`);
        const { checklist } = res_check.data;

        const res_det = await api.get('/service/checklist-details', {
          params: { id_checklist: checklist.id }
        });
        const { checklist_details } = res_det.data;

        setChecklist(checklist);
        setChecklistDetails(checklist_details);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadChecklistDetails();
  }, []);

  async function reloadChecklistDetails() {
    try {
      setRefreshing(true);

      const response = await api.get('/service/checklist-details', {
        params: { id_checklist: checklist.id }
      });
      const { checklist_details } = response.data;

      setChecklistDetails(checklist_details);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de items do checklist, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  function getChecklistDetail(checklist_detail) {
    setChecklistDetail(checklist_detail);

    setIsVisible(true);
  }

  const handleSaveDetailChecklist = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const schema = Yup.object().shape({
        title: Yup.string().required('O título é obrigatório')
      });

      await schema.validate({ title }, {
        abortEarly: false,
      });

      await api.post(`/service/checklist/detail/${checklist.id}`, {
        title,
        checked
      });

      Alert.alert('Sucesso!', 'Novo item registrado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha no registro de novo item, confira seus dados.'
      );
    } finally {
      reloadChecklistDetails();
      setLoading(false);
    }
  }, [
    title,
    checked
  ]);

  function ViewButton() {
    if (add_checklist_detail) {
      return (
        <>
          <SubmitButton onPress={handleSaveDetailChecklist}>
            {loading ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
                <SubmitButtonText>Salvar</SubmitButtonText>
              )}
          </SubmitButton>
          <CancelarButton onPress={() => setAddChecklistDetail(false)}>
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
                data={checklist_details}
                renderItem={renderChecklistDetails}
                keyExtractor={checklist_details => `details-${checklist_details.id}`}
                showsVerticalScrollIndicator={false}
                onRefresh={reloadChecklistDetails}
                refreshing={refreshing}
                ListFooterComponent={<View style={{ height: 20 }} />}
                ListEmptyComponent={<Empty>Não foi possivel encontrar itens</Empty>}
              />
            )}
          <SubmitButton onPress={() => setAddChecklistDetail(true)}>
            <SubmitButtonText>Novo Item</SubmitButtonText>
          </SubmitButton>
          <CancelarButton onPress={() => NavigationService.goBack()}>
            <CancelarButtonText>Voltar</CancelarButtonText>
          </CancelarButton>
        </>
      );
    }
  }


  function renderChecklistDetails({ item: checklist_detail }) {
    return (
      <Card
        onPress={() => getChecklistDetail(checklist_detail)}
      >
        <CardInfo>
          <CardTitle numberOfLines={1}>{checklist_detail.title}</CardTitle>
          <CardContainer>
            <CardName>
              Item do Veículo {' '}
              <CardSubName>({checklist_detail.title})</CardSubName>
            </CardName>

            <CardStatus>{checklist_detail.checked ? 'Já realizada' : 'á Realizar'}</CardStatus>

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
              <Title>Checklist</Title>
              <Description>
                Veja os itens do checklist ou crie um item. Atualize como quiser.
              </Description>

              {add_checklist_detail &&
                <>
                  <InputTitle>Título</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Título do item, ex: Pneus, Freios..."
                      autoCapitalize="words"
                      autoCorrect={false}
                      maxLength={100}
                      onChangeText={setTitle}
                      value={title}
                      returnKeyType="next"
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                    <MaterialIcons name="lock" size={20} color="#999" />
                  </InputContainer>

                  <SwitchContainer>
                    <ChoiceText>Checagem Realizada?</ChoiceText>

                    <CheckBox
                      iconColor="#f8a920"
                      checkColor="#f8a920"
                      value={checked}
                      onChange={() => setChecked(!checked)}
                    />
                  </SwitchContainer>
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
        <CustonModal checklist_detail={checklist_detail} setIsVisible={setIsVisible} reloadChecklistDetails={reloadChecklistDetails} />
      </Modal>
    </>
  );
}