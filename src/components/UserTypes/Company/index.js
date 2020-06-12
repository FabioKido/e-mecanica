import React, { useRef, useCallback, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard
} from 'react-native';

import * as Yup from 'yup';

import { useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';

import api from '../../../services/api';

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
} from './styles';

export default function Company() {
  
  const nomeFantasiaInputRef = useRef();
  const cnpjInputRef = useRef();
  const ieInputRef = useRef();
  const typeInputRef = useRef();

  const profile = useSelector(state => state.auth.user);

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [nome_fantasia, setNomeFantasia] = useState('');
  const [cnpj, setCNPJ] = useState('');
  const [ie, setIE] = useState('');
  const [type, setType] = useState('');
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getInfos() {
      try{
        setLoading(true);

        const response = await api.get(`/user/company/${profile.id}`);
        const {
          id,
          name,
          nome_fantasia,
          cnpj,
          ie,
          type
        } = response.data; 

        setId(id)
        setName(name);
        setNomeFantasia(nome_fantasia);
        setCNPJ(cnpj);
        setIE(ie);
        setType(type);
      }catch(err) {
        console.log(err);
      }finally{
        setLoading(false);
      }
    }
    
    getInfos();
  }, []);

  const handleSaveCompany = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório'),
        type: Yup.string().required('Tipo é obrigatório'),
      });

      await schema.validate({ name, type }, {
        abortEarly: false,
      });

      await api.put(`/user/company/${id}`, { name, nome_fantasia, cnpj, ie, type });

      Alert.alert('Sucesso!', 'Perfil atualizado com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na atualização do perfil, confira seus dados.'
      );
    } finally {
      setLoading(false);
    }
  }, [
    name,
    nome_fantasia,
    cnpj,
    ie,
    type
  ]);

  return (
    <Container>
      <Content keyboardShouldPersistTaps="handled">
        <FormContainer>
          <Title>PERFIL</Title>
          <Description>
            Atualize suas informaçoes pessoais editando os campos abaixo, logo depois, clique em Salvar. 
          </Description>

            <InputTitle>NOME</InputTitle>
            <InputContainer>
            <Input
                placeholder="Digite o nome da empresa"
                autoCapitalize="words"
                autoCorrect={false}
                onChangeText={setName}
                value={name}
                returnKeyType="next"
                onSubmitEditing={() => nomeFantasiaInputRef.current.focus()}
            />
            <MaterialIcons name="person-pin" size={20} color="#999" />
            </InputContainer>

            <InputTitle>NOME FANTASIA</InputTitle>
            <InputContainer>
            <Input
                placeholder="Digite o nome fantasia da empresa"
                autoCapitalize="none"
                autoCorrect={false}
                ref={nomeFantasiaInputRef}
                onChangeText={setNomeFantasia}
                value={nome_fantasia}
                returnKeyType="next"
                onSubmitEditing={() => cnpjInputRef.current.focus()}
            />
            <MaterialIcons name="lock" size={20} color="#999" />
            </InputContainer>

            <InputTitle>CNPJ</InputTitle>
            <InputContainer>
            <Input
                placeholder="Número do seu CNPJ"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={25}
                ref={cnpjInputRef}
                onChangeText={setCNPJ}
                value={cnpj}
                returnKeyType="next"
                onSubmitEditing={() => ieInputRef.current.focus()}
            />
            <MaterialIcons name="lock" size={20} color="#999" />
            </InputContainer>

            <InputTitle>IE</InputTitle>
            <InputContainer>
            <Input
                placeholder="Digite a sua Inscrição Estadual"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={13}
                ref={ieInputRef}
                onChangeText={setIE}
                value={ie}
                returnKeyType="next"
                onSubmitEditing={() => typeInputRef.current.focus()}
            />
            <MaterialIcons name="lock" size={20} color="#999" />
            </InputContainer>

            <InputTitle>TIPO DE EMPRESA</InputTitle>
            <InputContainer>
            <Input
                placeholder="Insira o tipo: MPE/Outros"
                autoCapitalize="none"
                autoCorrect={false}
                ref={typeInputRef}
                onChangeText={setType}
                value={type}
                returnKeyType="send"
                onSubmitEditing={handleSaveCompany}
            />
            <MaterialIcons name="lock" size={20} color="#999" />
            </InputContainer>
          
          <SubmitButton onPress={handleSaveCompany}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <SubmitButtonText>Salvar</SubmitButtonText>
            )}
          </SubmitButton>
        </FormContainer>
      </Content>
    </Container>
  );
}