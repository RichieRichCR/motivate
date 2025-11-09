import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContentCard } from './card';

describe('ContentCard', () => {
  it('should render with all props', () => {
    render(
      <ContentCard title="Weight" value="150" unit="lbs" date="2024-01-15" />,
    );

    expect(screen.getByText('Weight')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('lbs')).toBeInTheDocument();
    expect(screen.getByText(/on \d{1,2} \w{3}/)).toBeInTheDocument(); // "on 15 Jan" format
  });

  it('should display dash when value is undefined', () => {
    render(
      <ContentCard
        title="Weight"
        value={undefined}
        unit="lbs"
        date={undefined}
      />,
    );

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('should display "No date" when date is undefined', () => {
    render(
      <ContentCard title="Weight" value="150" unit="lbs" date={undefined} />,
    );

    expect(screen.getByText('No date')).toBeInTheDocument();
  });

  it('should format date correctly', () => {
    render(
      <ContentCard title="Weight" value="150" unit="lbs" date="2024-01-15" />,
    );

    const dateElement = screen.getByText(/on \d{1,2} \w{3}/);
    expect(dateElement).toBeInTheDocument();
    expect(dateElement.textContent).toMatch(/on \d{1,2} \w{3}/); // "on 15 Jan" format
  });

  it('should render with correct title', () => {
    render(
      <ContentCard
        title="Steps Today"
        value="10000"
        unit="steps"
        date={undefined}
      />,
    );

    expect(screen.getByText('Steps Today')).toBeInTheDocument();
  });

  it('should render with correct unit', () => {
    render(
      <ContentCard title="Distance" value="5" unit="km" date={undefined} />,
    );

    expect(screen.getByText('km')).toBeInTheDocument();
  });

  it('should handle numeric values', () => {
    render(
      <ContentCard title="Water" value="2.5" unit="liters" date={undefined} />,
    );

    expect(screen.getByText('2.5')).toBeInTheDocument();
  });

  it('should render card structure', () => {
    const { container } = render(
      <ContentCard title="Test" value="100" unit="units" date={undefined} />,
    );

    // Check if card structure exists - the value uses text-6xl class
    const valueElement = container.querySelector('.text-6xl');
    expect(valueElement).toBeTruthy();
    expect(valueElement?.textContent).toContain('100');
  });
});
