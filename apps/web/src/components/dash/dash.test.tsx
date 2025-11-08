import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dashboard } from './dash';

describe('Dashboard Component', () => {
  it('should render the Dashboard component', () => {
    render(<Dashboard />);
    expect(screen.getByTestId('dashboard-component')).toBeInTheDocument();
  });
});
