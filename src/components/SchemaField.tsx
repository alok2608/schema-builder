import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';
import { FieldType, SchemaField, generateUniqueId, getDefaultValue } from '@/types/schema';

interface SchemaFieldProps {
  fieldIndex: number;
  nestLevel?: number;
  onRemove: () => void;
  parentPath: string;
}

export const SchemaFieldComponent: React.FC<SchemaFieldProps> = ({ 
  fieldIndex, 
  nestLevel = 0, 
  onRemove,
  parentPath
}) => {
  const { register, watch, setValue } = useFormContext();
  const currentPath = `${parentPath}.${fieldIndex}`;
  
  const { fields: nestedFields, append: appendNested, remove: removeNested } = useFieldArray({
    name: `${currentPath}.fields` as const,
  });

  const addNestedField = () => {
    const newField: SchemaField = {
      id: generateUniqueId(),
      name: '',
      type: 'String',
      required: false,
      defaultValue: getDefaultValue('String'),
    };
    appendNested(newField);
  };

  const removeNestedField = (index: number) => {
    removeNested(index);
  };

  const currentType = watch(`${currentPath}.type`);
  const isRequired = watch(`${currentPath}.required`);

  return (
    <div className={`${nestLevel > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''} mb-3`}>
      <div className="flex items-center gap-3 py-2">
        <Input
          placeholder="Field name"
          {...register(`${currentPath}.name`)}
          className="flex-1 h-9 text-sm"
        />
        
        <Select
          value={currentType}
          onValueChange={(value: FieldType) => {
            setValue(`${currentPath}.type`, value);
            setValue(`${currentPath}.defaultValue`, getDefaultValue(value));
          }}
        >
          <SelectTrigger className="w-32 h-9 text-sm">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="String">string</SelectItem>
            <SelectItem value="Number">number</SelectItem>
            <SelectItem value="Nested">nested</SelectItem>
          </SelectContent>
        </Select>

        <Switch
          checked={isRequired}
          onCheckedChange={(checked) => setValue(`${currentPath}.required`, checked)}
          className="scale-75"
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-9 w-9 p-0 hover:bg-red-50"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {currentType === 'Nested' && (
        <div className="mt-2">
          {nestedFields.map((nestedField, nestedIndex) => (
            <SchemaFieldComponent
              key={nestedField.id}
              fieldIndex={nestedIndex}
              nestLevel={nestLevel + 1}
              onRemove={() => removeNestedField(nestedIndex)}
              parentPath={`${currentPath}.fields`}
            />
          ))}
          
          <Button
            type="button"
            onClick={addNestedField}
            className="w-full mt-2 h-9 text-sm bg-blue-600 hover:bg-blue-700 text-white"
          >
            + Add Item
          </Button>
        </div>
      )}
    </div>
  );
};