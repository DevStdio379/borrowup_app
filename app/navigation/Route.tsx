import React from 'react';
import { ThemeContextProvider } from '../constants/ThemeContext';
import StackNavigator from './StackNavigator';

const Route = () => {

	return (
		<ThemeContextProvider>
			<StackNavigator />
		</ThemeContextProvider>
	)

}

export default Route;