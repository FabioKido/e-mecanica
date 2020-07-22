import React from 'react';
import {
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { FontAwesome5 } from '@expo/vector-icons';

import {
  Container,
  Content,
  FormContainer,
  InputContainer,
  Title,
  Description,
  InputTitle,
  Input,
  DeleteButton,
  DeleteButtonText,
  CancelarButton,
  CancelarButtonText,
} from './styles';

import api from '../../../../services/api';

export default function CustonModal({ group_permission, setIsVisible, reloadGroupPermissions, id_group }) {

  const handleDeleteGroupPermission = async () => {
    try {
      await api.delete(`/user/permission/group/${group_permission.id}`, {
        params: { id_group }
      });

      Alert.alert('Excluído!', 'Permissão deletada com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na exclusão da permissão.'
      );
    } finally {
      setIsVisible(false);
      reloadGroupPermissions();
    }
  }

  return (
    <LinearGradient
      colors={['#2b475c', '#000']}
      style={{ flex: 1 }}
    >
      <Container>
        <Content keyboardShouldPersistTaps="handled">
          <FormContainer>
            <Title>{group_permission.name}</Title>
            <Description>
              Você pode excluir essa permissão quando quiser.
            </Description>

            <InputTitle>Nome</InputTitle>
            <InputContainer>
              <Input
                editable={false}
                style={{ color: '#f8a920' }}
                value={group_permission.name}
              />
              <FontAwesome5 name="file-invoice-dollar" size={20} color="#999" />
            </InputContainer>

            <InputTitle>Ação</InputTitle>
            <InputContainer>
              <Input
                editable={false}
                style={{ color: '#fff' }}
                value={group_permission.action}
              />
            </InputContainer>

            <DeleteButton onPress={handleDeleteGroupPermission}>
              <DeleteButtonText>Remover</DeleteButtonText>
            </DeleteButton>

            <CancelarButton onPress={() => setIsVisible(false)}>
              <CancelarButtonText>Voltar</CancelarButtonText>
            </CancelarButton>

          </FormContainer>

        </Content>
      </Container>
    </LinearGradient>
  );
}