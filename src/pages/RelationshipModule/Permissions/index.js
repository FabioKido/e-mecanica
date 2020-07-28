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

export default function GroupPermission({ navigation }) {

  const [group_permissions, setGroupPermissions] = useState([]);
  const [group_permission, setGroupPermission] = useState({});

  const [group, setGroup] = useState(navigation.state.params);

  const [permissions, setPermissions] = useState([]);
  const [permission, setPermission] = useState();
  const [id_permission, setIdPermission] = useState();

  const [add_group_permission, setAddGroupPermission] = useState(false);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadGroupPermissions() {
      try {
        setLoading(true);

        const response = await api.get('/user/permissions/group', {
          params: { id_group: group.id }
        });
        const group_permissions = response.data;

        setGroupPermissions(group_permissions);
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

          const response = await api.get('/user/permissions');
          const { permissions } = response.data;

          setPermissions(permissions);
        } catch (err) {
          console.log(err);
        }
      }

      loadPermissions();
    }
  }, [add_group_permission]);

  useEffect(() => {
    if (id_permission) {
      async function loadPermission() {
        try {

          const response = await api.get(`/user/permission/${id_permission}`);
          const { permission } = response.data;

          setPermission(permission);
        } catch (err) {
          console.log(err);
        }
      }

      loadPermission();
    }
  }, [id_permission]);

  async function reloadGroupPermissions() {
    try {
      setRefreshing(true);

      const response = await api.get('/user/permissions/group', {
        params: { id_group: group.id }
      });
      const group_permissions = response.data;

      setGroupPermissions(group_permissions);
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

      await api.post(`/user/permission/group/${id_permission}`, {
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
      reloadGroupPermissions();
    }
  }, [
    id_permission
  ]);

  function ViewButton() {
    if (add_group_permission) {
      return (
        <>
          <SubmitButton onPress={handleSaveGroupPermission}>
            {loading ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
                <SubmitButtonText>Adicionar</SubmitButtonText>
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
            <SubmitButtonText>Nova Permissão</SubmitButtonText>
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
          <CardTitle numberOfLines={1}>{group_permission.name}</CardTitle>
          <CardContainer>
            <CardName numberOfLines={2}>
              Ação: {' '}
              <CardSubName>{group_permission.action}</CardSubName>
            </CardName>
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
                  <InputTitle>Permissões</InputTitle>
                  <InputPicker>
                    <Picker
                      selectedValue={id_permission}
                      style={{
                        flex: 1,
                        color: '#f8a920',
                        backgroundColor: 'transparent',
                        fontSize: 17
                      }}
                      onValueChange={(itemValue, itemIndex) => setIdPermission(itemValue)}
                    >
                      <Picker.Item label="Selecione o tipo de permissão" value="" />
                      {permissions && permissions.map(permission => <Picker.Item key={permission.id} label={permission.name} value={permission.id} />)}
                    </Picker>
                    <MaterialIcons name="unfold-more" size={20} color="#999" />
                  </InputPicker>

                  {permission &&
                    <>
                      <InputTitle>Ação</InputTitle>
                      <InputContainer>
                        <Input
                          editable={false}
                          style={{ color: '#fff' }}
                          value={permission.action}
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
        <CustonModal group_permission={group_permission} setIsVisible={setIsVisible} reloadGroupPermissions={reloadGroupPermissions} id_group={group.id} />
      </Modal>
    </>
  );
}