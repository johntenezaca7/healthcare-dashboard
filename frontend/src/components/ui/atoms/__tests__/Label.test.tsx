import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Label } from '../label';

describe('Label', () => {
  it('renders label with text', () => {
    render(<Label>Label text</Label>);
    expect(screen.getByText('Label text')).toBeInTheDocument();
  });

  it('associates with input via htmlFor', () => {
    render(
      <div>
        <Label htmlFor="test-input">Test Label</Label>
        <input id="test-input" />
      </div>
    );
    const label = screen.getByText('Test Label');
    const input = screen.getByLabelText('Test Label');
    expect(label).toHaveAttribute('for', 'test-input');
    expect(input).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Label className="custom-label">Label</Label>);
    const label = screen.getByText('Label');
    expect(label).toHaveClass('custom-label');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Label ref={ref}>Label</Label>);
    expect(ref).toHaveBeenCalled();
  });
});
