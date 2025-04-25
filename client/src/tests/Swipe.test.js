import { render, screen } from '@testing-library/react';
import Swipe from '../pages/swipe/Swipe';

test('loads swipe UI', () => {
  render(<Swipe />);
  const prompt = screen.getByText(/swipe right/i);
  expect(prompt).toBeInTheDocument();
});