import React from 'react';
import { DrawerItems } from 'react-navigation';
import { LinearGradient } from 'expo-linear-gradient';

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
	UserContent
} from './styles';

function CustomDrawer({ ...props }) {
	const dispatch = useDispatch();

	const { email } = useSelector(state => state.auth.user);

	return (
		<LinearGradient
			colors={['#2b475c', '#000']}
			style={{ flex: 1 }}
		>
			<Container>
				<Content>
					<Logo />
					<UserContent>
						<UserName>{email}</UserName>
						<Logout
							onPress={() => dispatch(signOutRequest())}
						>
							<FontAwesome5 name="door-open" size={20} color="#f8a920" />
						</Logout>
					</UserContent>
				</Content>
				<ScrollDrawer>
					<DrawerItems {...props} />
				</ScrollDrawer>
			</Container>
		</LinearGradient>
	)
}

export default CustomDrawer;