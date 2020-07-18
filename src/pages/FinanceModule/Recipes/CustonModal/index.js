import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Picker
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import moment from 'moment';
import DatePicker from 'react-native-datepicker';

import {
  Container,
  Content,
  FormContainer,
  InputPicker,
  InputContainer,
  Title,
  Description,
  InputTitle,
  Input,
  SubmitButton,
  SubmitButtonText,
  DeleteButtonBox,
  DeleteButton,
  DeleteButtonText,
  CancelarButton,
  CancelarButtonText,
  ChoiceButton,
  ChoiceText
} from './styles';

import api from '../../../../services/api';
import NavigationService from '../../../../services/navigation';

export default function CustonModal({ recipe, setIsVisible, reloadRecipes }) {

  const descriptionInputRef = useRef();
  const observationsInputRef = useRef();

  const [categories, setCategories] = useState([]);
  const [id_category, setIdCategory] = useState(recipe.id_category);

  const [total_value, setTotalValue] = useState(recipe.total_value);
  const [description, setDescription] = useState(recipe.description);
  const [observations, setObservations] = useState(recipe.observations);
  const [date_recipe, setDateRecipe] = useState(recipe.date);

  const [date, setDate] = useState(() => date_recipe ? moment(date_recipe).format('DD-MM-YYYY') : '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    async function loadCategories() {
      try {

        const response = await api.get('/finance/categories');
        const { categories } = response.data;

        setCategories(categories);
      } catch (err) {
        console.log(err);
      }
    }

    setTimeout(loadCategories, 1000);
  }, []);

  const onDateChange = date => {
    setDate(date);

    const momentObj = moment(date, 'DD-MM-YYYY');

    setDateRecipe(momentObj);
  };

  const handleNavigateToDetailPage = () => {
    setIsVisible(false);

    setTimeout(() => NavigationService.navigate('RecipeDetail', recipe), 100);
  }

  const handleDeleteRecipe = async () => {
    try {
      await api.delete(`/finance/recipe/${recipe.id}`);

      Alert.alert('Excluído!', 'Receita deletada com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na exclusão da receita.'
      );
    } finally {
      setIsVisible(false);
      reloadRecipes();
    }
  }

  const handleUpdateRecipe = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoading(true);

      await api.put(`/finance/recipe/${recipe.id}`, {
        id_category,
        total_value,
        description,
        date_recipe,
        observations
      });

      Alert.alert('Sucesso!', 'Receita atualizada com sucesso.');
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error;

      Alert.alert(
        'Ooopsss',
        message || 'Falha na atualização da Receita, confira seus dados.'
      );
    } finally {
      setLoading(false);
      reloadRecipes();
    }
  }, [
    id_category,
    total_value,
    description,
    date_recipe,
    observations
  ]);

  return (
    <LinearGradient
      colors={['#2b5b2e', '#000']}
      style={{ flex: 1 }}
    >
      <Container>
        <Content keyboardShouldPersistTaps="handled">
          <FormContainer>
            <Title>{recipe.description}</Title>
            <Description>
              Edite ou exclua essa receita como quiser. Porem, ao atualizar o valor total, as taxas da(s) parcela(s) continuarão valendo.
            </Description>

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
                placeholder="Valor total da receita"
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
                placeholder="Breve descrição"
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
                placeholder="Algo a ser observado"
                autoCapitalize="none"
                autoCorrect={false}
                ref={observationsInputRef}
                onChangeText={setObservations}
                value={observations}
                returnKeyType="send"
                onSubmitEditing={handleUpdateRecipe}
              />
              <MaterialIcons name="lock" size={20} color="#999" />
            </InputContainer>

            <ChoiceButton
              onPress={handleNavigateToDetailPage}
            >
              <ChoiceText>Ir para Parcelas?</ChoiceText>
            </ChoiceButton>

            <DeleteButtonBox>
              <DeleteButton onPress={handleDeleteRecipe}>
                <DeleteButtonText>Excluir</DeleteButtonText>
              </DeleteButton>
              <SubmitButton style={{ width: 125 }} onPress={handleUpdateRecipe}>
                {loading ? (
                  <ActivityIndicator size="small" color="#333" />
                ) : (
                    <SubmitButtonText>Salvar</SubmitButtonText>
                  )}
              </SubmitButton>
            </DeleteButtonBox>
            <CancelarButton onPress={() => setIsVisible(false)}>
              <CancelarButtonText>Voltar</CancelarButtonText>
            </CancelarButton>

          </FormContainer>

        </Content>
      </Container>
    </LinearGradient>
  );
}