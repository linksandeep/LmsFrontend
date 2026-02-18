import React from 'react';
import { render, screen } from '@testing-library/react';

// A simple test component
const TestComponent = () => <div data-testid="test">Test</div>;

describe('Simple Test', () => {
  it('renders without crashing', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('test')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('performs basic math', () => {
    expect(1 + 1).toBe(2);
  });
});
