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

import { MaterialIcons } from '@expo/vector-icons';

import {
  Container,
  Content,
  FormContainer,
  Title,
  Description,
  CancelarButton,
  CancelarButtonText,
  InputContainer,
  InputPicker,
  InputTitle,
  Input,
  SubmitButton,
  SubmitButtonText,
  Cards,
  Card,
  CardInfo,
  CardTitle,
  CardContainer,
  CardName,
  CardSubName,
  Empty
} from './styles';

import Placeholder from './Placeholder';
import CustonModal from './CustonModal';

import api from '../../../services/api';

export default function UserGroup({ navigation }) {

  const [user_groups, setUserGroups] = useState([]);
  const [user_group, setUserGroup] = useState({});

  const [group, setGroup] = useState(navigation.state.params);

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState();
  const [id_user, setIdUser] = useState();

  const [add_user_group, setAddUserGroup] = useState(false);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadUserGroups() {
      try {
        setLoading(true);

        const response = await api.get('/user/in/groups', {
          params: { id_group: group.id }
        });
        const user_groups = response.data;

        setUserGroups(user_groups);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadUserGroups();
  }, []);

  useEffect(() => {
    if (add_user_group) {
      async function loadUsers() {
        try {

          const response = await api.get('/user/workers');
          const { workers } = response.data;

          setUsers(workers);
        } catch (err) {
          console.log(err);
        }
      }

      loadUsers();
    }
  }, [add_user_group]);

  useEffect(() => {
    if (id_user) {
      async function loadUser() {
        try {

          const response = await api.get(`/user/worker/${id_user}`);
          const { worker } = response.data;

          setUser(worker);
        } catch (err) {
          console.log(err);
        }
      }

      loadUser();
    }
  }, [id_user]);

  async function reloadUserGroups() {
    try {
      setRefreshing(true);

      const response = await api.get('/user/in/groups', {
        params: { id_group: group.id }
      });
      const user_groups = response.data;

      setUserGroups(user_groups);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de permissões, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  function getUserGroup(user_group) {
    setUserGroup(user_group);

    setIsVisible(true);
  }

  const handleSaveUserGroup = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      await api.post(`/user/in/group/${id_user}`, {
        id_group: group.id
      });

      Alert.alert('Sucesso!', 'Usuário adicionado ao grupo com sucesso.');

    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;
      console.log(err)
      Alert.alert(
        'Ooopsss',
        message || 'Falha no adicionamento do usuário, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadUserGroups();
    }
  }, [
    id_user
  ]);

  function ViewButton() {
    if (add_user_group) {
      return (
        <>
          <SubmitButton onPress={handleSaveUserGroup}>
            {loading ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
                <SubmitButtonText>Adicionar</SubmitButtonText>
              )}
          </SubmitButton>
          <CancelarButton onPress={() => setAddUserGroup(false)}>
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
                data={user_groups}
                renderItem={renderUserGroups}
                keyExtractor={user_groups => `details-${user_groups.id}`}
                showsVerticalScrollIndicator={false}
                onRefresh={reloadUserGroups}
                refreshing={refreshing}
                ListFooterComponent={<View style={{ height: 20 }} />}
                ListEmptyComponent={<Empty>Não foi possivel encontrar colaboradores</Empty>}
              />
            )}
          <SubmitButton onPress={() => setAddUserGroup(true)}>
            <SubmitButtonText>Novo Colaborador</SubmitButtonText>
          </SubmitButton>
        </>
      );
    }
  }

  function renderUserGroups({ item: user_group }) {
    return (
      <Card
        onPress={() => getUserGroup(user_group)}
      >
        <CardInfo>
          <CardTitle numberOfLines={1}>Colaborador - {user_group.id}</CardTitle>
          <CardContainer>
            <CardName numberOfLines={2}>
              Usuário: {' '}
              <CardSubName>{user_group.username}</CardSubName>
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
              <Title>{group.name}</Title>
              <Description>
                Veja todos os colaboradores deste grupo.
              </Description>

              {add_user_group &&
                <>
                  <InputTitle>Colaboradores</InputTitle>
                  <InputPicker>
                    <Picker
                      selectedValue={id_user}
                      style={{
                        flex: 1,
                        color: '#f8a920',
                        backgroundColor: 'transparent',
                        fontSize: 17
                      }}
                      onValueChange={(itemValue, itemIndex) => setIdUser(itemValue)}
                    >
                      <Picker.Item label="Selecione o Colaborador" value="" />
                      {users && users.map(user => <Picker.Item key={user.id} label={user.username} value={user.id} />)}
                    </Picker>
                    <MaterialIcons name="unfold-more" size={20} color="#999" />
                  </InputPicker>

                  {user &&
                    <>
                      <InputTitle>Nome</InputTitle>
                      <InputContainer>
                        <Input
                          editable={false}
                          style={{ color: '#fff' }}
                          value={user.name}
                        />
                        <MaterialIcons name="info" size={20} color="#999" />
                      </InputContainer>
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
        <CustonModal user_group={user_group} setIsVisible={setIsVisible} reloadUserGroups={reloadUserGroups} id_group={group.id} />
      </Modal>
    </>
  );
}