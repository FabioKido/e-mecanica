import React from 'react';
import { DrawerItems, DrawerItem } from 'react-navigation';

import { useSelector, useDispatch } from 'react-redux';

import { signOutRequest } from '../../store/modules/auth/actions';

import { FontAwesome5 } from '@expo/vector-icons';

import {
	Container,
	ScrollDrawer,
	Content,
	UserName,
	Logo,
	Logout,
	LogoutText
} from './styles';

function CustomDrawer({ ...props }) {
	const dispatch = useDispatch();

	const { email } = useSelector(state => state.auth.user);

	return (
		<Container>
			<Content>
				<Logo />
				<UserName>{email}</UserName>
			</Content>
			<ScrollDrawer>
				<DrawerItems {...props} />
			</ScrollDrawer>
			<Logout
				onPress={() => dispatch(signOutRequest())}
			>
				<FontAwesome5 name="door-open" size={20} color="#f8a920" />
				<LogoutText>Sair</LogoutText>
			</Logout>
		</Container>
	)
}

export default CustomDrawer;