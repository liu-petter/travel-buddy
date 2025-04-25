import { render, screen } from '@testing-library/react';
import CreatePlan from '../pages/createPlan/CreatePlan';

test('shows city input field', () => {
  render(<CreatePlan />);
  const input = screen.getByPlaceholderText(/enter a city/i);
  expect(input).toBeInTheDocument();
});