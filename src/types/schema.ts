export type FieldType = 'String' | 'Number' | 'Nested';

export interface SchemaField {
  id: string;
  name: string;
  type: FieldType;
  required?: boolean;
  defaultValue?: string | number;
  fields?: SchemaField[];
}

export interface Schema {
  fields: SchemaField[];
}

export const getDefaultValue = (type: FieldType): string | number => {
  switch (type) {
    case 'String':
      return '';
    case 'Number':
      return 0;
    case 'Nested':
      return '';
    default:
      return '';
  }
};

export const generateUniqueId = (): string => {
  return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};