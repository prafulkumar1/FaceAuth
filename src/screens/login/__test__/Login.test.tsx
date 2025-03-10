import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Login from '../Login';
import STRINGS from '../strings';
jest.mock('@react-native-async-storage/async-storage', () => {
   return {
    AsyncStorage: {
      getItem: jest.fn(),
    },
   }
});
describe('Login Screen', () => {
    const mockNavigate = jest.fn();

    const setup = () => {
        return render(<Login navigation={{ navigate: mockNavigate }} />);
    };

    it('renders correctly', () => {
        const { getByPlaceholderText, getByText } = setup();

        expect(getByPlaceholderText(STRINGS.emailPlaceholder)).toBeTruthy();
        expect(getByPlaceholderText(STRINGS.passwordPlaceholder)).toBeTruthy();
        expect(getByText(STRINGS.forgotPassword)).toBeTruthy();
        expect(getByText(STRINGS.loginButton)).toBeTruthy();
        expect(getByText(STRINGS.signUp)).toBeTruthy();
    });

    it('navigates to ForgotPassword screen on forgot password press', () => {
        const { getByText } = setup();

        fireEvent.press(getByText(STRINGS.forgotPassword));
        expect(mockNavigate).toHaveBeenCalledWith('ForgotPassword');
    });

    it('navigates to Home screen on login button press', () => {
        const { getByText } = setup();

        fireEvent.press(getByText(STRINGS.loginButton));
        expect(mockNavigate).toHaveBeenCalledWith('Home');
    });

    it('navigates to Register screen on sign up press', () => {
        const { getByText } = setup();

        fireEvent.press(getByText(STRINGS.signUp));
        expect(mockNavigate).toHaveBeenCalledWith('Register');
    });
});