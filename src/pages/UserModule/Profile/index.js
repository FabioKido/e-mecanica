import React, { useState } from 'react';

import { useSelector } from 'react-redux';
import { FontAwesome5 } from '@expo/vector-icons';

import Owner from './Owner';
import Company from './Company';

export default function Profile() {

  const profile = useSelector(state => state.auth.user);

  const [user_type, setUserType] = useState(profile.type);

  if (user_type === 'PF') {
    return <Owner />
  } else {
    return <Company />
  }
}

Profile.navigationOptions = {
  tabBarLabel: 'Perfil',
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome5 name="user-edit" size={22} color={tintColor} />
  ),
};