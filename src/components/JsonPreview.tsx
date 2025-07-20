import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SchemaField } from '@/types/schema';

interface JsonPreviewProps {
  schema: { fields: SchemaField[] };
}

const generateJsonFromSchema = (fields: SchemaField[]): Record<string, any> => {
  const result: Record<string, any> = {};
  
  fields.forEach(field => {
    if (!field.name) return;
    
    switch (field.type) {
      case 'String':
        result[field.name] = 'STRING';
        break;
      case 'Number':
        result[field.name] = 'number';
        break;
      case 'Nested':
        if (field.fields && field.fields.length > 0) {
          result[field.name] = generateJsonFromSchema(field.fields);
        } else {
          result[field.name] = {};
        }
        break;
    }
  });
  
  return result;
};

export const JsonPreview: React.FC<JsonPreviewProps> = ({ schema }) => {
  const jsonOutput = generateJsonFromSchema(schema.fields);
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">JSON Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted rounded-lg p-4 overflow-auto max-h-96">
          <pre className="text-sm text-foreground whitespace-pre-wrap">
            {JSON.stringify(jsonOutput, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};