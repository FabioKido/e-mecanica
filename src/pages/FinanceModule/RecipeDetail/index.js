import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Alert,
  View,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import moment from 'moment';

import {
  Container,
  Content,
  FormContainer,
  Title,
  Description,
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
import CustonModal from './CustonModal';

import api from '../../../services/api';
import NavigationService from '../../../services/navigation';

export default function RecipeDetail({ navigation }) {

  const [recipe_details, setRecipeDetails] = useState([]);
  const [recipe_detail, setRecipeDetail] = useState({});

  const [recipe, setRecipe] = useState(navigation.state.params);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadRecipeDetails() {
      try {
        setLoading(true);

        const response = await api.get('/finance/recipe-details', {
          params: { id_recipe: recipe.id }
        });
        const { recipe_details } = response.data;

        setRecipeDetails(recipe_details);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadRecipeDetails();
  }, []);

  async function reloadRecipeDetails() {
    try {
      setRefreshing(true);

      const response = await api.get('/finance/recipe-details', {
        params: { id_recipe: recipe.id }
      });
      const { recipe_details } = response.data;

      setRecipeDetails(recipe_details);
    } catch (err) {
      Alert.alert(
        'Erro ao obter lista de receitas, tente novamente mais tarde!'
      );
    } finally {
      setRefreshing(false);
    }
  }

  function getRecipeDetail(recipe_detail) {
    setRecipeDetail(recipe_detail);

    setIsVisible(true);
  }

  function renderRecipeDetails({ item: recipe_detail }) {
    const datail_date = moment(recipe_detail.vencimento).format('DD-MM-YYYY');

    return (
      <Card
        onPress={() => getRecipeDetail(recipe_detail)}
      >
        <CardInfo>
          <CardTitle numberOfLines={2}>R$ {recipe_detail.value}</CardTitle>
          <CardContainer>
            <CardName>
              Vencimento: {' '}
              <CardSubName>({datail_date})</CardSubName>
            </CardName>

            <CardStatus>{recipe_detail.paid_out ? 'Já recebi' : 'á Receber'}</CardStatus>

          </CardContainer>
        </CardInfo>
      </Card>
    );
  }

  // TODO O id_payment(e a categoria de serviço) vem do pagamento de um serviço... resolverei com o redux.
  // TODO Resolver as casa depois da virgula, podendo apenas duas.
  // FIXME Butão de Page no Dashboard para listar todas as parcelas(por ter algumas que não tem o id da receita)

  return (
    <>
      <LinearGradient
        colors={['#2b5b2e', '#000']}
        style={{ flex: 1 }}
      >
        <Container>
          <Content keyboardShouldPersistTaps="handled">
            <FormContainer>
              <Title>{recipe.description}</Title>
              <Description>
                Veja os detalhes da(s) parcela(s) desta receita. Atualize como quiser.
              </Description>

              {loading ? (
                <Placeholder />
              ) : (
                  <Cards
                    data={recipe_details}
                    renderItem={renderRecipeDetails}
                    keyExtractor={recipe_details => `details-${recipe_details.id}`}
                    showsVerticalScrollIndicator={false}
                    onRefresh={reloadRecipeDetails}
                    refreshing={refreshing}
                    ListFooterComponent={<View style={{ height: 20 }} />}
                    ListEmptyComponent={<Empty>Não foi possivel encontrar parcelas</Empty>}
                  />
                )}

              <CancelarButton onPress={() => NavigationService.goBack()}>
                <CancelarButtonText>Voltar</CancelarButtonText>
              </CancelarButton>

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
        <CustonModal recipe_detail={recipe_detail} setIsVisible={setIsVisible} reloadRecipeDetails={reloadRecipeDetails} />
      </Modal>
    </>
  );
}