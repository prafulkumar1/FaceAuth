import React from 'react';
import { render } from '@testing-library/react-native';
import Splashscreen from '../Splashscreen';

jest.useFakeTimers();

describe('Splashscreen', () => {
    it('renders correctly', () => {
        const { getByText } = render(<Splashscreen navigation={{ replace: jest.fn() }} />);
        expect(getByText('Splash Screen')).toBeTruthy();
    });

    it('navigates to Login screen after 1 second', () => {
        const replaceMock = jest.fn();
        render(<Splashscreen navigation={{ replace: replaceMock }} />);

        jest.advanceTimersByTime(1000);

        expect(replaceMock).toHaveBeenCalledWith('Login');
    });

    it('clears timeout on unmount', () => {
        const replaceMock = jest.fn();
        const { unmount } = render(<Splashscreen navigation={{ replace: replaceMock }} />);

        unmount();
        jest.advanceTimersByTime(1000);

        expect(replaceMock).not.toHaveBeenCalled();
    });
});