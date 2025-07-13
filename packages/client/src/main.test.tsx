import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';

// Mock shared module
vi.mock('@aeturnis/shared', () => ({
  GAME_VERSION: '1.0.0',
}));

describe('Client Entry Point', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;
  let mockRender: ReturnType<typeof vi.fn>;
  let mockCreateRoot: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();

    consoleSpy = vi.spyOn(console, 'log').mockImplementation();

    // Mock getElementById
    const mockElement = document.createElement('div');
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);

    // Setup ReactDOM mock
    mockRender = vi.fn();
    mockCreateRoot = vi.fn(() => ({ render: mockRender }));

    vi.doMock('react-dom/client', () => ({
      default: {
        createRoot: mockCreateRoot,
      },
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should log client startup message', async () => {
    await import('./main');
    expect(consoleSpy).toHaveBeenCalledWith('Aeturnis Online Client v1.0.0');
  });

  it('should create root and render', async () => {
    await import('./main');

    expect(mockCreateRoot).toHaveBeenCalledWith(expect.any(HTMLElement));
    expect(mockRender).toHaveBeenCalled();
  });

  it('should render with StrictMode', async () => {
    await import('./main');

    const renderCall = mockRender.mock.calls[0][0];
    expect(renderCall.type).toBe(React.StrictMode);
  });

  it('should render App component correctly', async () => {
    const { App } = await import('./main');
    const { getByText } = render(<App />);
    expect(getByText('Aeturnis Online - Client Setup')).toBeDefined();
  });
});
