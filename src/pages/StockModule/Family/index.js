import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  View,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import * as Yup from 'yup';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import {
  Container,
  Content,
  FormContainer,
  InputContainer,
  Title,
  Description,
  InputTitle,
  Input,
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
  Empty
} from './styles';

import Placeholder from './Placeholder';
import CustonModal from './CustonModal';

import api from '../../../services/api';

export default function Family() {

  const descriptionInputRef = useRef();

  const [families, setFamilies] = useState([]);
  const [family, setFamily] = useState({});
  const [add_family, setAddFamily] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadFamilies() {
      try {
        setLoading(true);

        const response = await api.get('/stock/families');
        const { families } = response.data;

        setFamilies(families);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadFamilies();
  }, []);

  function getFamily(family) {
    setFamily(family);

    setIsVisible(true);
  }

  async function reloadFamilies() {
    try {
      setRefreshing(true);

      const response = await api.get('/stock/families');
      const { families } = response.data;

      setFamilies(families);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de famílias, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  const handleSaveFamily = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório')
      });

      await schema.validate({ name }, {
        abortEarly: false,
      });

      await api.post('/stock/family', { name, description });

      Alert.alert('Sucesso!', 'Nova família registrada com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha no registro da nova família, confira seus dados.'
      );
    } finally {
      reloadFamilies();
      setLoading(false);
    }
  }, [
    name,
    description
  ]);

  function ViewButton() {
    if (add_family) {
      return (
        <>
          <SubmitButton onPress={handleSaveFamily}>
            {loading ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
                <SubmitButtonText>Salvar</SubmitButtonText>
              )}
          </SubmitButton>
          <CancelarButton onPress={() => setAddFamily(false)}>
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
                data={families}
                renderItem={renderFamilies}
                keyExtractor={families => `family-${families.id}`}
                showsVerticalScrollIndicator={false}
                onRefresh={reloadFamilies}
                refreshing={refreshing}
                ListFooterComponent={<View style={{ height: 20 }} />}
                ListEmptyComponent={<Empty>Nenhuma família encontrada.</Empty>}
              />
            )}
          <SubmitButton onPress={() => setAddFamily(true)}>
            <SubmitButtonText>Nova Família</SubmitButtonText>
          </SubmitButton>
        </>
      );
    }
  }

  function renderFamilies({ item: family }) {
    return (
      <Card
        onPress={() => getFamily(family)}
      >
        <CardInfo>
          <CardTitle numberOfLines={1}>{family.name}</CardTitle>
          <CardContainer>
            <CardName numberOfLines={2}>
              {family.description}
            </CardName>
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
              <Title>Famílias</Title>
              <Description>
                Veja todas as suas famílias. Crie ou exclua uma família como quiser.
              </Description>

              {add_family &&
                <>
                  <InputTitle>Nome</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Insira o nome"
                      autoCapitalize="words"
                      autoCorrect={false}
                      onChangeText={setName}
                      value={name}
                      returnKeyType="next"
                      onSubmitEditing={() => descriptionInputRef.current.focus()}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>

                  <InputTitle>Descrição</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite uma descrição"
                      autoCapitalize="none"
                      autoCorrect={false}
                      ref={descriptionInputRef}
                      onChangeText={setDescription}
                      value={description}
                      returnKeyType="send"
                      onSubmitEditing={handleSaveFamily}
                    />
                    <MaterialIcons name="edit" size={18} color="#999" />
                  </InputContainer>
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
        <CustonModal family={family} setIsVisible={setIsVisible} reloadFamilies={reloadFamilies} />
      </Modal>
    </>
  );
}

Family.navigationOptions = {
  tabBarLabel: 'Famílias',
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome5 name="boxes" size={18} color={tintColor} />
  ),
};