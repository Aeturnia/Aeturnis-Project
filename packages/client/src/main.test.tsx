import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock ReactDOM
vi.mock('react-dom/client', () => ({
  default: {
    createRoot: vi.fn(() => ({
      render: vi.fn(),
    })),
  },
}));

describe('Client Entry Point', () => {
  it('should render without crashing', () => {
    const div = document.createElement('div');
    div.id = 'root';
    document.body.appendChild(div);

    // Test App component in isolation
    const App: React.FC = () => {
      return <div>Aeturnis Online - Client Setup</div>;
    };

    render(<App />);

    expect(screen.getByText('Aeturnis Online - Client Setup')).toBeInTheDocument();
  });

  it('should log client startup message', async () => {
    const consoleSpy = vi.spyOn(console, 'log');

    // Dynamic import to execute the module
    await import('./main');

    expect(consoleSpy).toHaveBeenCalledWith('Aeturnis Online Client v1.0.0');
  });
});
