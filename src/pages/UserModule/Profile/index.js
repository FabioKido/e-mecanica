import React, { useState } from 'react';

import { useSelector } from 'react-redux';
import { FontAwesome5 } from '@expo/vector-icons';

import Owner from '../../../components/UserTypes/Owner';
import Company from '../../../components/UserTypes/Company';

export default function Profile() {

  const profile = useSelector(state => state.auth.user);

  const [user_type, setUserType] = useState(profile.type);

  if(user_type === 'PF'){
    return <Owner />
  }else {
    return <Company />
  }
}

Profile.navigationOptions = {
  tabBarLabel: 'Meu Perfil',
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome5 name="user-edit" size={22} color={tintColor} />
  ),
};