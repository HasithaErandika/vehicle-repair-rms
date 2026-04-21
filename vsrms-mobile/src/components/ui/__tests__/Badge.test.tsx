import React from 'react';
import { render } from '@testing-library/react-native';
import { Badge } from '../Badge';

describe('Badge Component', () => {
  test('renders the label correctly', () => {
    const { getByText } = render(<Badge label="Pending" />);
    expect(getByText('Pending')).toBeTruthy();
  });

  test('renders with the primary variant by default', () => {
    const { getByText } = render(<Badge label="VSRMS" />);
    const text = getByText('VSRMS');
    
    console.log(JSON.stringify(text.props.style, null, 2));
    expect(text).toHaveStyle({ color: '#F56E0F' });
  });

  test('renders different variants correctly', () => {
    const { getByText: getSuccess } = render(<Badge label="Success" variant="success" />);
    const successText = getSuccess('Success');
    expect(successText).toHaveStyle({ color: '#15803D' });

    const { getByText: getError } = render(<Badge label="Error" variant="error" />);
    const errorText = getError('Error');
    expect(errorText).toHaveStyle({ color: '#DC2626' });
  });
});
