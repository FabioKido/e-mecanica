import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  View,
  Picker
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import * as Yup from 'yup';

import moment from 'moment';
import DatePicker from 'react-native-datepicker';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import {
  Container,
  Content,
  FormContainer,
  InputContainer,
  InputPicker,
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
  CardSubName,
  CardStatus,
  Empty
} from './styles';

import Placeholder from './Placeholder';

import api from '../../../services/api';

export default function Expenses() {

  const descriptionInputRef = useRef();
  const observationsInputRef = useRef();

  const [recipes, setRecipes] = useState([]);
  const [recipe, setRecipe] = useState({});
  const [add_recipe, setAddRecipe] = useState(false);

  const [categories, setCategories] = useState([]);
  const [id_category, setIdCategory] = useState();

  const [total_value, setTotalValue] = useState('');
  const [description, setDescription] = useState('');
  const [observations, setObservations] = useState('');
  const [options, setOptions] = useState('');
  const [date_recipe, setDateRecipe] = useState('');

  const [date, setDate] = useState();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadRecipes() {
      try {
        setLoading(true);

        const response = await api.get('/finance/recipes');
        const { recipes } = response.data;

        setRecipes(recipes);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadRecipes();
  }, []);

  useEffect(() => {
    if (add_recipe) {
      async function loadCategories() {
        try {

          const response = await api.get('/finance/categories');
          const { categories } = response.data;

          setCategories(categories);
        } catch (err) {
          console.log(err);
        }
      }

      loadCategories();
    }
  }, [add_recipe]);

  const onDateChange = date => {
    setDate(date);

    const momentObj = moment(date, 'DD-MM-YYYY');

    setDateRecipe(momentObj);
  };

  async function reloadRecipes() {
    try {
      setRefreshing(true);

      const response = await api.get('/finance/recipes');
      const { recipes } = response.data;

      setRecipes(recipes);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de receitas, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  const handleSaveRecipe = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const schema = Yup.object().shape({
        total_value: Yup.number().required('O valor total é obrigatório')
      });

      await schema.validate({ total_value }, {
        abortEarly: false,
      });

      await api.post('/finance/recipe', {
        id_category,
        total_value,
        description,
        parcels: 1,
        date_recipe,
        observations,
        options
      });

      Alert.alert('Sucesso!', 'Nova receita registrada com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha no registro da nova receita, confira seus dados.'
      );
    } finally {
      reloadRecipes();
      setLoading(false);
    }
  }, [
    id_category,
    total_value,
    description,
    date_recipe,
    observations,
    options
  ]);

  function ViewButton() {
    if (add_recipe) {
      return (
        <>
          <SubmitButton onPress={handleSaveRecipe}>
            {loading ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
                <SubmitButtonText>Salvar</SubmitButtonText>
              )}
          </SubmitButton>
          <CancelarButton onPress={() => setAddRecipe(false)}>
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
                data={recipes}
                renderItem={renderRecipes}
                keyExtractor={recipes => `recipe-${recipes.id}`}
                showsVerticalScrollIndicator={false}
                onRefresh={reloadRecipes}
                refreshing={refreshing}
                ListFooterComponent={<View style={{ height: 20 }} />}
                ListEmptyComponent={<Empty>Nenhuma receita encontrada.</Empty>}
              />
            )}
          <SubmitButton onPress={() => setAddRecipe(true)}>
            <SubmitButtonText>Nova Receita</SubmitButtonText>
          </SubmitButton>
        </>
      );
    }
  }

  function renderRecipes({ item: recipe }) {
    return (
      <Card
        onPress={() => { }}
      >
        <CardInfo>
          <CardTitle numberOfLines={2}>{recipe.description}</CardTitle>
          <CardContainer>
            <CardName>
              Recebimento: {' '}
              <CardSubName>({recipe.options})</CardSubName>
            </CardName>

            <CardStatus>{recipe.total_value}</CardStatus>

          </CardContainer>
        </CardInfo>
      </Card>
    );
  }

  // TODO O id_payment vem do pagamento de um serviço... resolverei com o redux.

  return (
    <LinearGradient
      colors={['#2b5b2e', '#000']}
      style={{ flex: 1 }}
    >
      <Container>
        <Content keyboardShouldPersistTaps="handled">
          <FormContainer>
            <Title>Receitas</Title>
            <Description>
              Veja todas as suas receitas. Crie ou exclua uma receita como quiser.
          </Description>

            {add_recipe &&
              <>
                <InputTitle>Categoria</InputTitle>
                <InputPicker>
                  <Picker
                    selectedValue={id_category}
                    style={{
                      flex: 1,
                      color: '#f8a920',
                      backgroundColor: 'transparent',
                      fontSize: 17
                    }}
                    onValueChange={(itemValue, itemIndex) => setIdCategory(itemValue)}
                  >
                    <Picker.Item label="Selecione a Categoria" value="" />
                    {categories && categories.map(category => <Picker.Item key={category.id} label={category.description} value={category.id} />)}
                  </Picker>
                  <MaterialIcons name="lock" size={20} color="#999" />
                </InputPicker>

                <InputTitle>Valor Total</InputTitle>
                <InputContainer>
                  <Input
                    placeholder="Digite o valor total da receita"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="numeric"
                    maxLength={60}
                    onChangeText={setTotalValue}
                    value={total_value}
                    returnKeyType="next"
                    onSubmitEditing={() => descriptionInputRef.current.focus()}
                  />
                  <MaterialIcons name="person-pin" size={20} color="#999" />
                </InputContainer>

                <InputTitle>Descrição</InputTitle>
                <InputContainer>
                  <Input
                    placeholder="Digite uma breve descrição"
                    autoCapitalize="words"
                    autoCorrect={false}
                    ref={descriptionInputRef}
                    onChangeText={setDescription}
                    value={description}
                    returnKeyType="next"
                    onSubmitEditing={() => observationsInputRef.current.focus()}
                  />
                  <MaterialIcons name="person-pin" size={20} color="#999" />
                </InputContainer>

                <InputTitle>Data</InputTitle>
                <InputContainer>
                  <Input
                    placeholder="Clique no calendário para editar"
                    editable={false}
                    value={date}
                  />
                  <DatePicker
                    date={date}
                    is24Hour={true}
                    format="DD-MM-YYYY"
                    minDate="01-01-2001"
                    maxDate="31-12-2030"
                    hideText={true}
                    iconComponent={<FontAwesome5 name="calendar-alt" size={18} color="#999" />}
                    style={{
                      width: 21
                    }}
                    onDateChange={onDateChange}
                  />
                </InputContainer>

                <InputTitle>Observações</InputTitle>
                <InputContainer>
                  <Input
                    placeholder="Digite algo a ser observado"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="numeric"
                    ref={observationsInputRef}
                    onChangeText={setObservations}
                    value={observations}
                    returnKeyType="send"
                    onSubmitEditing={handleSaveRecipe}
                  />
                  <MaterialIcons name="lock" size={20} color="#999" />
                </InputContainer>

                <InputTitle>Opções</InputTitle>
                <InputPicker>
                  <Picker
                    selectedValue={options}
                    style={{
                      flex: 1,
                      color: '#f8a920',
                      backgroundColor: 'transparent',
                      fontSize: 17
                    }}
                    onValueChange={(itemValue, itemIndex) => setOptions(itemValue)}
                  >
                    <Picker.Item label="Selecione a Opção de Recebimento" value="" />
                    <Picker.Item label="á Vista" value="á Vista" />
                    <Picker.Item label="Parcelada" value="Parcelada" />
                  </Picker>
                  <MaterialIcons name="lock" size={20} color="#999" />
                </InputPicker>
              </>
            }

            <ViewButton />

          </FormContainer>

        </Content>
      </Container>
    </LinearGradient>
  );
}

Expenses.navigationOptions = {
  tabBarLabel: 'Despesas',
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome5 name="user-cog" size={18} color={tintColor} />
  ),
};