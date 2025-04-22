import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import SwipePage from './SwipePage';
import '@testing-library/jest-dom';
import * as reactTinderCard from 'react-tinder-card';

// Mock the TinderCard so we can simulate swipes manually
jest.mock('react-tinder-card', () => ({
  __esModule: true,
  default: ({ children, onSwipe }) => (
    <div onClick={() => onSwipe('right')}>{children}</div>
  )
}));
jest.mock('react-leaflet', () => ({
    MapContainer: ({ children }) => <div data-testid="mock-map">{children}</div>,
    TileLayer: () => <div data-testid="mock-tile-layer" />,
    Marker: () => <div data-testid="mock-marker" />,
  }));
  
// Mock fetch response
beforeEach(() => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue([
      {
        activity: 'Visit the Eiffel Tower',
        exact_address: 'Champ de Mars, Paris',
        latitude: 48.8584,
        longitude: 2.2945,
      },
      {
        activity: 'Louvre Museum Tour',
        exact_address: 'Rue de Rivoli, Paris',
        latitude: 48.8606,
        longitude: 2.3376,
      },
    ]),
  });
});

afterEach(() => {
  global.fetch.mockRestore();
  localStorage.clear();
});

test('renders initial place and handles swipe', async () => {
  render(<SwipePage />);

  // Wait for first card to load
  await waitFor(() =>
    expect(screen.getByText('Visit the Eiffel Tower')).toBeInTheDocument()
  );

  // Simulate swipe by clicking (mocked TinderCard triggers right swipe)
  fireEvent.click(screen.getByText('Visit the Eiffel Tower'));

  // Wait for second card to load
  await waitFor(() =>
    expect(screen.getByText('Louvre Museum Tour')).toBeInTheDocument()
  );
});

test('saves liked places and shows "View Your Selected Places" button at the end', async () => {
  render(<SwipePage />);

  // Swipe right on first card
  fireEvent.click(await screen.findByText('Visit the Eiffel Tower'));

  // Swipe right on second card
  fireEvent.click(await screen.findByText('Louvre Museum Tour'));

  // Expect the button to appear
  expect(
    await screen.findByRole('button', { name: /view your selected places/i })
  ).toBeInTheDocument();

  // Click the "Done" button
  fireEvent.click(screen.getByRole('button', { name: /view your selected places/i }));

  // Check if localStorage was updated
  const likedPlaces = JSON.parse(localStorage.getItem('likedPlaces'));
  expect(likedPlaces).toHaveLength(2);
  expect(likedPlaces[0].activity).toBe('Visit the Eiffel Tower');
});

test('shows fallback message when no places are loaded', async () => {
  // Override fetch to return empty array
  global.fetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValue([]),
  });

  render(<SwipePage />);

  expect(await screen.findByText(/no locations found/i)).toBeInTheDocument();
});
