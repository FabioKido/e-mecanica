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

export default function TimelineDetail({ navigation }) {

  const [timeline_details, setTimelineDetails] = useState([]);
  const [timeline_detail, setTimelineDetail] = useState({});
  const [add_timeline_detail, setAddTimelineDetail] = useState(false);

  const [timeline, setTimeline] = useState({});

  const [order, setOrder] = useState(navigation.state.params);

  const [title, setTitle] = useState('');
  const [complete, setComplete] = useState(false);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadTimelineDetails() {
      try {
        setLoading(true);

        const res_time = await api.get(`/service/timeline/${order}`);
        const { timeline } = res_time.data;

        const res_det = await api.get('/service/timeline-details', {
          params: { id_timeline: timeline.id }
        });
        const { timeline_details } = res_det.data;

        setTimeline(timeline);
        setTimelineDetails(timeline_details);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadTimelineDetails();
  }, []);

  async function reloadTimelineDetails() {
    try {
      setRefreshing(true);

      const response = await api.get('/service/timeline-details', {
        params: { id_timeline: timeline.id }
      });
      const { timeline_details } = response.data;

      setTimelineDetails(timeline_details);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de items da timeline, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  function getTimelineDetail(timeline_detail) {
    setTimelineDetail(timeline_detail);

    setIsVisible(true);
  }

  const handleSaveTimelineDetail = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const schema = Yup.object().shape({
        title: Yup.string().required('O título é obrigatório')
      });

      await schema.validate({ title }, {
        abortEarly: false,
      });

      await api.post(`/service/timeline/detail/${timeline.id}`, {
        title,
        complete
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
      reloadTimelineDetails();
      setLoading(false);
    }
  }, [
    title,
    complete
  ]);

  function ViewButton() {
    if (add_timeline_detail) {
      return (
        <>
          <SubmitButton onPress={handleSaveTimelineDetail}>
            {loading ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
                <SubmitButtonText>Salvar</SubmitButtonText>
              )}
          </SubmitButton>
          <CancelarButton onPress={() => setAddTimelineDetail(false)}>
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
                data={timeline_details}
                renderItem={renderTimelineDetails}
                keyExtractor={timeline_details => `details-${timeline_details.id}`}
                showsVerticalScrollIndicator={false}
                onRefresh={reloadTimelineDetails}
                refreshing={refreshing}
                ListFooterComponent={<View style={{ height: 20 }} />}
                ListEmptyComponent={<Empty>Não foi possivel encontrar itens</Empty>}
              />
            )}
          <SubmitButton onPress={() => setAddTimelineDetail(true)}>
            <SubmitButtonText>Novo Item</SubmitButtonText>
          </SubmitButton>
          <CancelarButton onPress={() => NavigationService.goBack()}>
            <CancelarButtonText>Voltar</CancelarButtonText>
          </CancelarButton>
        </>
      );
    }
  }


  function renderTimelineDetails({ item: timeline_detail }) {
    return (
      <Card
        onPress={() => getTimelineDetail(timeline_detail)}
      >
        <CardInfo>
          <CardTitle numberOfLines={1}>{timeline_detail.title}</CardTitle>
          <CardContainer>
            <CardName>
              Item da Timeline
            </CardName>

            <CardStatus>{timeline_detail.complete ? 'Completo' : 'Incompleto'}</CardStatus>

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
              <Title>Timeline</Title>
              <Description>
                Veja os itens da timeline da OS ou crie um item. Siga uma ordem bem definida.
              </Description>

              {add_timeline_detail &&
                <>
                  <InputTitle>Título</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Título do item, ex: iniciando, etc..."
                      autoCapitalize="words"
                      autoCorrect={false}
                      maxLength={60}
                      onChangeText={setTitle}
                      value={title}
                      returnKeyType="next"
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>

                  <SwitchContainer>
                    <ChoiceText>Objetivo Completo?</ChoiceText>

                    <CheckBox
                      iconColor="#f8a920"
                      checkColor="#f8a920"
                      value={complete}
                      onChange={() => setComplete(!complete)}
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
        <CustonModal timeline_detail={timeline_detail} setIsVisible={setIsVisible} reloadTimelineDetails={reloadTimelineDetails} />
      </Modal>
    </>
  );
}