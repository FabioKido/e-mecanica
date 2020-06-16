import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  View
} from 'react-native';

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
  CategoryCards,
  CategoryCard,
  CategoryInfo,
  CategoryTitle,
  CategoryContainer,
  CategoryName,
  CategoryIndicatorName,
  CategoryStatus,
  Empty
} from './styles';

import Placeholder from '../Category/Placeholder';

import api from '../../../services/api';

export default function Category() {

  const indicatorInputRef = useRef();

  const [categories, setCategories] = useState([]);
  const [add_category, setAddCategory] = useState(false);

  const [description, setDescription] = useState('');
  const [indicator, setIndicator] = useState('');

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);

        const response = await api.get('/finance/categories');
        const { categories } = response.data;

        setCategories(categories);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  async function reloadCategories() {
    try {
      setRefreshing(true);

      const response = await api.get('/finance/categories');
      const { categories } = response.data;

      setCategories(categories);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de categorias, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  const handleDeleteCategory = async ({ id }) => {
    try {
      await api.delete(`/finance/category/${id}`);

      Alert.alert('Excluída!', 'Categoria deletada com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na exclusão da categoria.'
      );
    } finally {
      reloadCategories();
    }
  }

  const handleSaveCategory = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const schema = Yup.object().shape({
        description: Yup.string().required('Descrição é obrigatório')
      });

      await schema.validate({ description }, {
        abortEarly: false,
      });

      await api.post('/finance/category', { description, indicator });

      Alert.alert('Sucesso!', 'Nova categoria registrada com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha no registro da nova categoria, confira seus dados.'
      );
    } finally {
      reloadCategories();
      setLoading(false);
    }
  }, [
    description,
    indicator
  ]);

  function ViewButton() {
    if (add_category) {
      return (
        <>
          <SubmitButton onPress={handleSaveCategory}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
                <SubmitButtonText>Salvar</SubmitButtonText>
              )}
          </SubmitButton>
          <CancelarButton onPress={() => setAddCategory(false)}>
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
              <CategoryCards
                data={categories}
                renderItem={renderCategories}
                keyExtractor={categories => `category-${categories.id}`}
                showsVerticalScrollIndicator={false}
                onRefresh={reloadCategories}
                refreshing={refreshing}
                ListFooterComponent={<View style={{ height: 20 }} />}
                ListEmptyComponent={<Empty>Nenhuma categoria encontrada.</Empty>}
              />
            )}
          <SubmitButton onPress={() => setAddCategory(true)}>
            <SubmitButtonText>Nova Categoria</SubmitButtonText>
          </SubmitButton>
        </>
      );
    }
  }

  function renderCategories({ item: category }) {
    return (
      <CategoryCard
        onPress={() => handleDeleteCategory(category)}
      >
        <CategoryInfo>
          <CategoryTitle numberOfLines={2}>{category.description}</CategoryTitle>
          <CategoryContainer>
            <CategoryName>
              Indicador{' '}
              <CategoryIndicatorName>({category.indicator})</CategoryIndicatorName>
            </CategoryName>

            <CategoryStatus>Excluir</CategoryStatus>

          </CategoryContainer>
        </CategoryInfo>
      </CategoryCard>
    );
  }

  return (
    <Container>
      <Content keyboardShouldPersistTaps="handled">
        <FormContainer>
          <Title>CATEGORIAS</Title>
          <Description>
            Veja todas as suas categorias. Crie ou exclua uma categoria como quiser.
          </Description>

          {add_category &&
            <>
              <InputTitle>DESCRIÇÃO</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Digite uma descrição"
                  autoCapitalize="words"
                  autoCorrect={false}
                  onChangeText={setDescription}
                  value={description}
                  returnKeyType="next"
                  onSubmitEditing={() => indicatorInputRef.current.focus()}
                />
                <MaterialIcons name="person-pin" size={20} color="#999" />
              </InputContainer>

              <InputTitle>INDICADOR</InputTitle>
              <InputContainer>
                <Input
                  placeholder="Insira o indicador, ex: impostos/etc"
                  autoCapitalize="words"
                  autoCorrect={false}
                  ref={indicatorInputRef}
                  onChangeText={setIndicator}
                  value={indicator}
                  returnKeyType="send"
                  onSubmitEditing={handleSaveCategory}
                />
                <MaterialIcons name="lock" size={20} color="#999" />
              </InputContainer>
            </>
          }

          <ViewButton />

        </FormContainer>

      </Content>
    </Container>
  );
}

Category.navigationOptions = {
  tabBarLabel: 'Categorias',
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome5 name="user-cog" size={22} color={tintColor} />
  ),
};