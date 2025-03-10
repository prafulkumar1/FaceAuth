import React from 'react';
import { render } from '@testing-library/react-native';
import ForgotPassword from '../ForgotPassword';
import STRINGS from '../strings';

describe('ForgotPassword Screen', () => {
    it('renders correctly, displaying the correct text', () => {
        const { getByText } = render(<ForgotPassword />);
        expect(getByText(STRINGS.ForgotPassword)).toBeTruthy();
    });
});