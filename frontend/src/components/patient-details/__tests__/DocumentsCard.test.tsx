import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Document } from '@/types';

import { DocumentsCard } from '../DocumentsCard';

import { render } from '@/test/utils';

describe('DocumentsCard', () => {
  const mockDocuments: Document[] = [
    {
      id: 'doc-1',
      type: 'medical_record',
      name: 'Lab Results - Blood Test',
      uploadDate: '2024-01-15T00:00:00Z',
      fileSize: 1024 * 500, // 500 KB
      mimeType: 'application/pdf',
      url: 'https://example.com/doc1.pdf',
    },
    {
      id: 'doc-2',
      type: 'insurance_card',
      name: 'Insurance Card',
      uploadDate: '2024-01-10T00:00:00Z',
      fileSize: 1024 * 200, // 200 KB
      mimeType: 'image/png',
      url: 'https://example.com/doc2.png',
    },
  ];

  it('renders documents list when documents are provided', () => {
    render(<DocumentsCard documents={mockDocuments} />);

    expect(screen.getByText(/Documents \(2\)/i)).toBeInTheDocument();
    expect(screen.getByText('Lab Results - Blood Test')).toBeInTheDocument();
    expect(screen.getByText('Insurance Card')).toBeInTheDocument();
  });

  it('displays document count in header', () => {
    render(<DocumentsCard documents={mockDocuments} />);

    expect(screen.getByText(/Documents \(2\)/i)).toBeInTheDocument();
  });

  it('displays document type and upload date', () => {
    render(<DocumentsCard documents={mockDocuments} />);

    expect(screen.getByText(/medical_record/i)).toBeInTheDocument();
    expect(screen.getByText(/insurance_card/i)).toBeInTheDocument();
  });

  it('displays file size in KB', () => {
    render(<DocumentsCard documents={mockDocuments} />);

    expect(screen.getByText(/500\.00 KB/i)).toBeInTheDocument();
    expect(screen.getByText(/200\.00 KB/i)).toBeInTheDocument();
  });

  it('renders view button when document has URL', () => {
    render(<DocumentsCard documents={mockDocuments} />);

    const viewButtons = screen.getAllByRole('link', { name: /view/i });
    expect(viewButtons).toHaveLength(2);
    expect(viewButtons[0]).toHaveAttribute('href', 'https://example.com/doc1.pdf');
    expect(viewButtons[0]).toHaveAttribute('target', '_blank');
    expect(viewButtons[0]).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders empty state when no documents', () => {
    render(<DocumentsCard documents={[]} />);

    expect(screen.getByText(/Documents \(0\)/i)).toBeInTheDocument();
    expect(screen.getByText('No documents')).toBeInTheDocument();
  });

  it('handles document without URL', () => {
    const documentsWithoutUrl: Document[] = [
      {
        id: 'doc-3',
        type: 'test_result',
        name: 'Test Result',
        uploadDate: '2024-01-20T00:00:00Z',
        fileSize: 1024 * 100,
        mimeType: 'application/pdf',
        url: '',
      },
    ];

    render(<DocumentsCard documents={documentsWithoutUrl} />);

    expect(screen.getByText('Test Result')).toBeInTheDocument();
    // Should not have view button when URL is empty
    const viewButtons = screen.queryAllByRole('link', { name: /view/i });
    expect(viewButtons).toHaveLength(0);
  });

  it('displays formatted upload date', () => {
    render(<DocumentsCard documents={mockDocuments} />);

    // formatDate should format the date, check for date parts
    const dateElements = screen.getAllByText(/Jan/i);
    expect(dateElements.length).toBeGreaterThan(0);
    // Check that dates are formatted (should contain year)
    const yearElements = screen.getAllByText(/2024/i);
    expect(yearElements.length).toBeGreaterThan(0);
  });

  it('handles single document', () => {
    const singleDocument = [mockDocuments[0]];
    render(<DocumentsCard documents={singleDocument} />);

    expect(screen.getByText(/Documents \(1\)/i)).toBeInTheDocument();
    expect(screen.getByText('Lab Results - Blood Test')).toBeInTheDocument();
  });

  it('renders all document types correctly', () => {
    const allTypes: Document[] = [
      {
        id: 'doc-medical',
        type: 'medical_record',
        name: 'Medical Record',
        uploadDate: '2024-01-01T00:00:00Z',
        fileSize: 1024,
        mimeType: 'application/pdf',
        url: 'https://example.com/medical.pdf',
      },
      {
        id: 'doc-insurance',
        type: 'insurance_card',
        name: 'Insurance',
        uploadDate: '2024-01-02T00:00:00Z',
        fileSize: 1024,
        mimeType: 'image/png',
        url: 'https://example.com/insurance.png',
      },
      {
        id: 'doc-photo',
        type: 'photo_id',
        name: 'Photo ID',
        uploadDate: '2024-01-03T00:00:00Z',
        fileSize: 1024,
        mimeType: 'image/jpeg',
        url: 'https://example.com/photo.jpg',
      },
      {
        id: 'doc-test',
        type: 'test_result',
        name: 'Test Result',
        uploadDate: '2024-01-04T00:00:00Z',
        fileSize: 1024,
        mimeType: 'application/pdf',
        url: 'https://example.com/test.pdf',
      },
      {
        id: 'doc-other',
        type: 'other',
        name: 'Other Document',
        uploadDate: '2024-01-05T00:00:00Z',
        fileSize: 1024,
        mimeType: 'application/pdf',
        url: 'https://example.com/other.pdf',
      },
    ];

    render(<DocumentsCard documents={allTypes} />);

    expect(screen.getByText(/Documents \(5\)/i)).toBeInTheDocument();
    expect(screen.getByText('Medical Record')).toBeInTheDocument();
    expect(screen.getByText('Insurance')).toBeInTheDocument();
    expect(screen.getByText('Photo ID')).toBeInTheDocument();
    expect(screen.getByText('Test Result')).toBeInTheDocument();
    expect(screen.getByText('Other Document')).toBeInTheDocument();
  });
});
