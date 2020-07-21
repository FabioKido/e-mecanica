import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Alert,
  ActivityIndicator,
  Keyboard,
  View,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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

export default function Groups() {

  const descriptionInputRef = useRef();

  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState({});
  const [add_group, setAddGroup] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadGroups() {
      try {
        setLoading(true);

        const response = await api.get('/user/groups');
        const { groups } = response.data;

        setGroups(groups);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadGroups();
  }, []);

  function getGroup(group) {
    setGroup(group);

    setIsVisible(true);
  }

  async function reloadGroups() {
    try {
      setRefreshing(true);

      const response = await api.get('/user/groups');
      const { groups } = response.data;

      setGroups(groups);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de grupos, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  const handleSaveGroup = useCallback(async (obj_details) => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      await api.post('/user/group', {
        name,
        description
      });

      Alert.alert('Sucesso!', 'Novo grupo registrado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;
      console.log(err)
      Alert.alert(
        'Ooopsss',
        message || 'Falha no registro do novo grupo, confira seus dados.'
      );
    } finally {
      reloadGroups();
      setLoading(false);
    }
  }, [
    name,
    description
  ]);

  function ViewButton() {
    if (add_group) {
      return (
        <>
          <SubmitButton onPress={handleSaveGroup}>
            {loading ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
                <SubmitButtonText>Salvar</SubmitButtonText>
              )}
          </SubmitButton>
          <CancelarButton onPress={() => setAddGroup(false)}>
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
                data={groups}
                renderItem={renderGroups}
                keyExtractor={groups => `group-${groups.id}`}
                showsVerticalScrollIndicator={false}
                onRefresh={reloadGroups}
                refreshing={refreshing}
                ListFooterComponent={<View style={{ height: 20 }} />}
                ListEmptyComponent={<Empty>Nenhum grupo encontrado.</Empty>}
              />
            )}
          <SubmitButton onPress={() => setAddGroup(true)}>
            <SubmitButtonText>Novo Grupo</SubmitButtonText>
          </SubmitButton>
        </>
      );
    }
  }

  function renderGroups({ item: group }) {
    return (
      <Card
        onPress={() => getGroup(group)}
      >
        <CardInfo>
          <CardTitle numberOfLines={1}>{group.name}</CardTitle>
          <CardContainer>
            <CardName numberOfLines={2}>
              {group.description}
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
              <Title>Grupos</Title>
              <Description>
                Veja todas os seus grupos. Crie ou exclua um grupo como quiser.
              </Description>

              {add_group &&
                <>
                  <InputTitle>Nome</InputTitle>
                  <InputContainer>
                    <Input
                      placeholder="Digite um Nome, ex: Mecânicos..."
                      autoCapitalize="words"
                      autoCorrect={false}
                      onChangeText={setName}
                      value={name}
                      returnKeyType="next"
                      onSubmitEditing={() => descriptionInputRef.current.focus()}
                    />
                    <MaterialIcons name="person-pin" size={20} color="#999" />
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
                      returnKeyType="next"
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                    <MaterialIcons name="lock" size={20} color="#999" />
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
        <CustonModal group={group} setIsVisible={setIsVisible} reloadGroups={reloadGroups} />
      </Modal>
    </>
  );
}

Groups.navigationOptions = {
  tabBarLabel: 'Grupos',
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome5 name="user-cog" size={18} color={tintColor} />
  ),
};