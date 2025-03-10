import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Register from '../Register';
import STRINGS from '../strings';

describe('Register Screen', () => {
    const navigation = { navigate: jest.fn(), goBack: jest.fn() };

    it('renders correctly including logo and inputs', () => {
        const { getByPlaceholderText, getByText, getByTestId } = render(<Register navigation={navigation} />);

        expect(getByPlaceholderText(STRINGS.emailPlaceholder)).toBeTruthy();
        expect(getByPlaceholderText(STRINGS.passwordPlaceholder)).toBeTruthy();
        expect(getByPlaceholderText(STRINGS.confirmPasswordPlaceholder)).toBeTruthy();
        expect(getByText(STRINGS.signupButton)).toBeTruthy();
        expect(getByText(STRINGS.login)).toBeTruthy();
    });

    it('navigates to Home screen on signup button press', () => {
        const { getByText } = render(<Register navigation={navigation} />);
        fireEvent.press(getByText(STRINGS.signupButton));
        expect(navigation.navigate).toHaveBeenCalledWith('Home');
    });

    it('goes back on login button press', () => {
        const { getByText } = render(<Register navigation={navigation} />);
        fireEvent.press(getByText(STRINGS.login));
        expect(navigation.goBack).toHaveBeenCalled();
    });
});