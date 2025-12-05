import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

describe('Table', () => {
  it('renders table element', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByText('Cell')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Table className="custom-table">
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const table = screen.getByRole('table');
    expect(table).toHaveClass('custom-table');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(
      <Table ref={ref}>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(ref).toHaveBeenCalled();
  });
});

describe('TableHeader', () => {
  it('renders table header', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
  });
});

describe('TableBody', () => {
  it('renders table body', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Body</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByText('Body')).toBeInTheDocument();
  });
});

describe('TableFooter', () => {
  it('renders table footer', () => {
    render(
      <Table>
        <TableFooter>
          <TableRow>
            <TableCell>Footer</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});

describe('TableHead', () => {
  it('renders table head cell', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Header Cell</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    const header = screen.getByText('Header Cell');
    expect(header.tagName).toBe('TH');
  });
});

describe('TableRow', () => {
  it('renders table row', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const row = screen.getByText('Cell').closest('tr');
    expect(row).toBeInTheDocument();
  });
});

describe('TableCell', () => {
  it('renders table cell', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Cell Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const cell = screen.getByText('Cell Content');
    expect(cell.tagName).toBe('TD');
  });
});

describe('TableCaption', () => {
  it('renders table caption', () => {
    render(
      <Table>
        <TableCaption>Table Caption</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByText('Table Caption')).toBeInTheDocument();
  });
});

describe('Table composition', () => {
  it('renders complete table structure', () => {
    render(
      <Table>
        <TableCaption>Test Table</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John</TableCell>
            <TableCell>30</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>1</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    expect(screen.getByText('Test Table')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
