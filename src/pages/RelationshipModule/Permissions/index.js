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

import moment from 'moment';

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
  CardStatus,
  Empty
} from './styles';

import Placeholder from './Placeholder';
import CustonModal from './CustonModal';

import api from '../../../services/api';

export default function GroupPermission({ navigation }) {

  const [group_permissions, setGroupPermissions] = useState([]);
  const [group_permission, setGroupPermission] = useState({});

  const [group, setGroup] = useState(navigation.state.params);

  const [permissions, setPermissions] = useState([]);
  const [id_permission, setIdPermission] = useState();

  const [add_group_permission, setAddGroupPermission] = useState(false);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadGroupPermissions() {
      try {
        setLoading(true);



      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadGroupPermissions();
  }, []);

  useEffect(() => {
    if (add_group_permission) {
      async function loadPermissions() {
        try {



        } catch (err) {
          console.log(err);
        }
      }

      loadPermissions();
    }
  }, [add_group_permission]);

  async function reloadGroupPermissions() {
    try {
      setRefreshing(true);



    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de permissões, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  function getGroupPermission(group_permission) {
    setGroupPermission(group_permission);

    setIsVisible(true);
  }

  const handleSaveGroupPermission = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      await api.post(`/${permission.id}`, {
        id_group: group.id
      });

      Alert.alert('Sucesso!', 'Permissão registrada com sucesso.');

    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;
      console.log(err)
      Alert.alert(
        'Ooopsss',
        message || 'Falha no registro da permissão, confira seus dados.'
      );
    } finally {
      setLoading(false);
    }
  }, [

  ]);

  function ViewButton() {
    if (add_group_permission) {
      return (
        <>
          <SubmitButton onPress={handleSaveGroupPermission}>
            {loading ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
                <SubmitButtonText>Salvar</SubmitButtonText>
              )}
          </SubmitButton>
          <CancelarButton onPress={() => setAddGroupPermission(false)}>
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
                data={group_permissions}
                renderItem={renderGroupPermissions}
                keyExtractor={group_permissions => `details-${group_permissions.id}`}
                showsVerticalScrollIndicator={false}
                onRefresh={reloadGroupPermissions}
                refreshing={refreshing}
                ListFooterComponent={<View style={{ height: 20 }} />}
                ListEmptyComponent={<Empty>Não foi possivel encontrar permissões</Empty>}
              />
            )}
          <SubmitButton onPress={() => setAddGroupPermission(true)}>
            <SubmitButtonText>Adicionar Permissão</SubmitButtonText>
          </SubmitButton>
        </>
      );
    }
  }

  function renderGroupPermissions({ item: group_permission }) {
    return (
      <Card
        onPress={() => getGroupPermission(group_permission)}
      >
        <CardInfo>
          <CardTitle numberOfLines={1}>{group_permission.id}</CardTitle>
          <CardContainer>
            <CardName>
              Permissão {' '}
              <CardSubName>({})</CardSubName>
            </CardName>

            <CardStatus>{}</CardStatus>

          </CardContainer>
        </CardInfo>
      </Card>
    );
  }

  // TODO Resolver a busca findAll no controller permission group.
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
                Veja todas as permissões deste grupo.
              </Description>

              {add_group_permission &&
                <>



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
        <CustonModal group_permission={group_permission} setIsVisible={setIsVisible} reloadGroupPermissions={reloadGroupPermissions} />
      </Modal>
    </>
  );
}