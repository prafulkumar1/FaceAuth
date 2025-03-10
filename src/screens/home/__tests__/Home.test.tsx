import React from 'react';
import { render } from '@testing-library/react-native';
import Home from '../Home';
import { STRINGS } from '../strings';

describe('Home Screen', () => {
    it('renders correctly', () => {
        const { getByText } = render(<Home />);
        expect(getByText(STRINGS.HOME_TEXT)).toBeTruthy();
    });
});