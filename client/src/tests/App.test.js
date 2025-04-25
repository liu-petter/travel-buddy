import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders TravelBuddy header', () => {
  render(<App />);
  const header = screen.getByText(/travelbuddy/i);
  expect(header).toBeInTheDocument();
});