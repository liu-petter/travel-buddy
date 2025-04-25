import { render, screen } from '@testing-library/react';
import Trip from '../pages/trip/Trip';

test('displays saved trip section', () => {
  render(<Trip />);
  const heading = screen.getByText(/your trips/i);
  expect(heading).toBeInTheDocument();
});