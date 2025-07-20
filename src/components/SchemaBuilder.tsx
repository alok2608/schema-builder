import React from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { SchemaFieldComponent } from './SchemaField';
import { JsonPreview } from './JsonPreview';
import { Schema, SchemaField, generateUniqueId, getDefaultValue } from '@/types/schema';

const defaultSchema: Schema = {
  fields: [
    
  ],
};

export const SchemaBuilder: React.FC = () => {
  const methods = useForm<Schema>({
    defaultValues: defaultSchema,
    mode: 'onChange',
  });

  const { control, watch, handleSubmit } = methods;
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fields',
  });

  const watchedSchema = watch();

  const addNewField = () => {
    const newField: SchemaField = {
      id: generateUniqueId(),
      name: '',
      type: 'String',
      required: false,
      defaultValue: getDefaultValue('String'),
    };
    append(newField);
  };

  const removeField = (index: number) => {
    remove(index);
  };

  const onSubmit = (data: Schema) => {
    console.log('Schema submitted:', data);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              {/* Left Panel - Schema Builder */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <SchemaFieldComponent
                      key={field.id}
                      fieldIndex={index}
                      onRemove={() => removeField(index)}
                      parentPath="fields"
                    />
                  ))}
                  
                  <Button
                    type="button"
                    onClick={addNewField}
                    className="w-full h-10 text-sm bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    + Add Item
                  </Button>
                </div>
                
                <div className="mt-8 pt-6 border-t">
                  <Button
                    type="submit"
                    className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2"
                  >
                    Submit
                  </Button>
                </div>
              </div>

              {/* Right Panel - JSON Preview */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="h-full">
                  <div className="bg-gray-50 rounded-lg p-4 h-full overflow-auto">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                      {JSON.stringify(watchedSchema.fields.reduce((acc, field) => {
                        if (!field.name) return acc;
                        
                        switch (field.type) {
                          case 'String':
                            acc[field.name] = 'STRING';
                            break;
                          case 'Number':
                            acc[field.name] = 'number';
                            break;
                          case 'Nested':
                            if (field.fields && field.fields.length > 0) {
                              acc[field.name] = field.fields.reduce((nestedAcc, nestedField) => {
                                if (!nestedField.name) return nestedAcc;
                                
                                switch (nestedField.type) {
                                  case 'String':
                                    nestedAcc[nestedField.name] = 'STRING';
                                    break;
                                  case 'Number':
                                    nestedAcc[nestedField.name] = 'number';
                                    break;
                                  case 'Nested':
                                    nestedAcc[nestedField.name] = {};
                                    break;
                                }
                                return nestedAcc;
                              }, {} as Record<string, any>);
                            } else {
                              acc[field.name] = {};
                            }
                            break;
                        }
                        return acc;
                      }, {} as Record<string, any>), null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};