import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from '../checkbox';

describe('Checkbox', () => {
  it('renders checkbox element', () => {
    render(<Checkbox aria-label="Test checkbox" />);
    const checkbox = screen.getByRole('checkbox', { name: /test checkbox/i });
    expect(checkbox).toBeInTheDocument();
  });

  it('handles checked state', async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="Test checkbox" />);
    const checkbox = screen.getByRole('checkbox', { name: /test checkbox/i });
    await user.click(checkbox);
    expect(checkbox).toHaveAttribute('data-state', 'checked');
  });

  it('handles onChange events', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Checkbox onCheckedChange={handleChange} aria-label="Test checkbox" />);
    const checkbox = screen.getByRole('checkbox', { name: /test checkbox/i });
    await user.click(checkbox);
    expect(handleChange).toHaveBeenCalled();
  });

  it('supports disabled state', () => {
    render(<Checkbox disabled aria-label="Test checkbox" />);
    const checkbox = screen.getByRole('checkbox', { name: /test checkbox/i });
    expect(checkbox).toBeDisabled();
  });

  it('supports controlled checked state', () => {
    render(<Checkbox checked aria-label="Test checkbox" />);
    const checkbox = screen.getByRole('checkbox', { name: /test checkbox/i });
    expect(checkbox).toHaveAttribute('data-state', 'checked');
  });

  it('applies custom className', () => {
    render(<Checkbox className="custom-checkbox" aria-label="Test checkbox" />);
    const checkbox = screen.getByRole('checkbox', { name: /test checkbox/i });
    expect(checkbox).toHaveClass('custom-checkbox');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Checkbox ref={ref} aria-label="Test checkbox" />);
    expect(ref).toHaveBeenCalled();
  });
});
