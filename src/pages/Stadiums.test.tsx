import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Stadiums } from './Stadiums';
import React from 'react';
import userEvent from '@testing-library/user-event';

// Mock fetch for Open-Meteo
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      current_weather: {
        temperature: 25.5,
        weathercode: 3
      }
    })
  })
) as unknown as ReturnType<typeof vi.fn>;

describe('Stadiums Page', () => {
  it('renders stadium list and default stadium details', async () => {
    render(<Stadiums />);
    
    // Check title
    expect(screen.getByText('Stadium Guide & Navigation')).toBeInTheDocument();
    
    // Check default stadium (MetLife Stadium)
    expect(screen.getByText('MetLife Stadium')).toBeInTheDocument();
    expect(screen.getByText('New York/New Jersey, USA')).toBeInTheDocument();
    
    // Check weather fetch
    await waitFor(() => {
      expect(screen.getByText('25.5°C')).toBeInTheDocument();
      expect(screen.getByText('Partly Cloudy')).toBeInTheDocument();
    });
  });
});
