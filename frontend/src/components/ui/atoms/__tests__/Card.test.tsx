import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../card';

describe('Card', () => {
  it('renders card element', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-card">Content</Card>);
    const card = container.querySelector('.custom-card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('custom-card');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Card ref={ref}>Content</Card>);
    expect(ref).toHaveBeenCalled();
  });
});

describe('CardHeader', () => {
  it('renders card header', () => {
    render(
      <Card>
        <CardHeader>Header content</CardHeader>
      </Card>
    );
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Card>
        <CardHeader className="custom-header">Header</CardHeader>
      </Card>
    );
    const header = screen.getByText('Header');
    expect(header).toHaveClass('custom-header');
  });
});

describe('CardTitle', () => {
  it('renders card title', () => {
    render(
      <Card>
        <CardTitle>Title</CardTitle>
      </Card>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('renders as heading element', () => {
    render(
      <Card>
        <CardTitle>Title</CardTitle>
      </Card>
    );
    const title = screen.getByText('Title');
    expect(title.tagName).toBe('H3');
  });
});

describe('CardDescription', () => {
  it('renders card description', () => {
    render(
      <Card>
        <CardDescription>Description text</CardDescription>
      </Card>
    );
    expect(screen.getByText('Description text')).toBeInTheDocument();
  });
});

describe('CardContent', () => {
  it('renders card content', () => {
    render(
      <Card>
        <CardContent>Content text</CardContent>
      </Card>
    );
    expect(screen.getByText('Content text')).toBeInTheDocument();
  });
});

describe('CardFooter', () => {
  it('renders card footer', () => {
    render(
      <Card>
        <CardFooter>Footer content</CardFooter>
      </Card>
    );
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });
});

describe('Card composition', () => {
  it('renders complete card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
