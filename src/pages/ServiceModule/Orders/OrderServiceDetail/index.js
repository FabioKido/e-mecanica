import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  View,
  Picker
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import {
  SwitchContainer,
  ChoiceText,
  InputContainer,
  InputPicker,
  TitleSection,
  InputTitle,
  Input,
  SubmitButton,
  SubmitButtonText
} from './styles';

import api from '../../../../services/api';

import CheckBox from "../../../../components/CheckBox";

export default function ({ order_service, loading, handleSaveOrder }) {

  const [all_services, setAllServices] = useState([]);
  const [services, setServices] = useState("");

  const [types, setTypes] = useState("");
  const [commissions, setCommissions] = useState("");
  const [prices, setPrices] = useState("");
  const [discounts, setDiscounts] = useState("");
  const [premiums, setPremiums] = useState("");
  const [approveds, setApproveds] = useState("");

  let rows = [];
  let rows_details = [];

  for (let i = 0; i < order_service; i++) {
    rows.push(i);
    rows_details.push({});
  }

  useEffect(() => {
    async function loadServices() {
      try {

        const response = await api.get('/service/all');
        const { services } = response.data;

        setAllServices(services);
      } catch (err) {
        console.log(err);
      }
    }

    loadServices();
  }, []);

  const onCheckBoxChange = (value, name) => {
    setApproveds({ ...approveds, [name]: value });
  };

  function handlePickerChange(value, name) {
    setServices({ ...services, [name]: value });
  };

  function handleInputChangeCommission(value, name) {
    setCommissions({ ...commissions, [name]: value });
  };

  function handleInputChangePrice(value, name) {
    setPrices({ ...prices, [name]: value });
  };

  function handleInputChangeDiscount(value, name) {
    setDiscounts({ ...discounts, [name]: value });
  };

  function handleInputChangePremium(value, name) {
    setPremiums({ ...premiums, [name]: value });
  };

  function handleInputChangeType(value, name) {
    setTypes({ ...types, [name]: value });
  };

  function renderParcelRow(row, index) {

    rows_details[index] = {
      id_service: services[`service${row}`] || '',
      type: types[`type${row}`] || '',
      commission: commissions[`commission${row}`] || 0,
      price: prices[`price${row}`] || 0,
      discount: discounts[`discount${row}`] || 0,
      premium: premiums[`premium${row}`] || 0,
      approved: approveds[`approved${row}`] || false
    }

    return (
      <View key={row}>
        <TitleSection>{`${row + 1}º Serviço `}</TitleSection>

        <InputTitle>Serviço</InputTitle>
        <InputPicker>
          <Picker
            selectedValue={services[`service${row}`]}
            style={{
              flex: 1,
              color: '#f8a920',
              backgroundColor: 'transparent',
              fontSize: 17
            }}
            onValueChange={(itemValue, itemIndex) => handlePickerChange(itemValue, `service${row}`)}
          >
            <Picker.Item label="Selecione o Serviço" value="" />
            {all_services && all_services.map(service => <Picker.Item key={service.id} label={service.name} value={service.id} />)}
          </Picker>
          <MaterialIcons name="lock" size={20} color="#999" />
        </InputPicker>

        <InputTitle>Tipo</InputTitle>
        <InputContainer>
          <Input
            placeholder="Tipo do Serviço"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={60}
            onChangeText={v => handleInputChangeType(v, `type${row}`)}
            value={types[`type${row}`] || ''}
            returnKeyType="next"
          />
          <MaterialIcons name="person-pin" size={20} color="#999" />
        </InputContainer>

        <InputTitle>Preço do Serviço</InputTitle>
        <InputContainer>
          <Input
            placeholder="Preço do Serviço"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numeric"
            onChangeText={v => handleInputChangePrice(v, `price${row}`)}
            value={prices[`price${row}`] || ''}
            returnKeyType="next"
          />
          <MaterialIcons name="person-pin" size={20} color="#999" />
        </InputContainer>

        <InputTitle>Desconto do Serviço</InputTitle>
        <InputContainer>
          <Input
            placeholder="Desconto do Serviço, se houver"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numeric"
            onChangeText={v => handleInputChangeDiscount(v, `discount${row}`)}
            value={discounts[`discount${row}`] || ''}
            returnKeyType="next"
          />
          <MaterialIcons name="person-pin" size={20} color="#999" />
        </InputContainer>

        <InputTitle>Comissão do serviço</InputTitle>
        <InputContainer>
          <Input
            placeholder="Comissão do colaborador, se houver"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numeric"
            onChangeText={v => handleInputChangeCommission(v, `commission${row}`)}
            value={commissions[`commission${row}`] || ''}
            returnKeyType="next"
          />
          <MaterialIcons name="person-pin" size={20} color="#999" />
        </InputContainer>

        <InputTitle>Prêmio do serviço</InputTitle>
        <InputContainer>
          <Input
            placeholder="Prêmio para o colaborador, se houver"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numeric"
            onChangeText={v => handleInputChangePremium(v, `premium${row}`)}
            value={premiums[`premium${row}`] || ''}
            returnKeyType="next"
          />
          <MaterialIcons name="person-pin" size={20} color="#999" />
        </InputContainer>

        <SwitchContainer>
          <ChoiceText>Serviço Aprovado?</ChoiceText>

          <CheckBox
            iconColor="#f8a920"
            checkColor="#f8a920"
            value={approveds[`approved${row}`]}
            onChange={() => onCheckBoxChange(!approveds[`approved${row}`], `approved${row}`)}
          />
        </SwitchContainer>
      </View>
    )
  }

  const listItems = rows.map(renderParcelRow);

  // TODO Resolver o preço negativo, quando o desconto é maior que o preço.
  return (
    <>

      {listItems}

      <SubmitButton onPress={() => handleSaveOrder(rows_details)}>
        {loading ? (
          <ActivityIndicator size="small" color="#333" />
        ) : (
            <SubmitButtonText>Salvar</SubmitButtonText>
          )}
      </SubmitButton>
    </>
  )
}