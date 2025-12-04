import { memo } from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import { Document } from '@/types';
import { formatDate } from '@/utils/date';

interface DocumentsCardProps {
  documents: Document[];
}

export const DocumentsCard = memo(({ documents }: DocumentsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documents ({documents.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {documents.length > 0 ? (
          <div className="space-y-2">
            {documents.map((doc: Document) => (
              <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-medium text-sm">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.type} • {formatDate(doc.uploadDate)} • {(doc.fileSize / 1024).toFixed(2)}{' '}
                    KB
                  </p>
                </div>
                {doc.url && (
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No documents</p>
        )}
      </CardContent>
    </Card>
  );
});

DocumentsCard.displayName = 'DocumentsCard';
