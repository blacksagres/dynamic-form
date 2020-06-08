import React, { useEffect, useState } from 'react';
import jsonpath from 'jsonpath';
import { generate } from 'shortid';
import { TextInput } from './TextInput';
import { mapObjectTreeFromProperty } from './object-tree-builder';
import { mapJsonIntoFields } from './form-metadata-generator';
import { TextArea } from './TextArea';

const mapObjectIntoFields = (fieldName, fieldSkeleton) => {
  const splitFields = Object.keys(fieldSkeleton.value).map(key => {
    return getMatchingComponent(key, fieldSkeleton.value[key]);
  });

  return (
    <div
      key={`field-group-object-${generate()}`}
      className="m-2 p-4 rounded border-2 border-red-400"
      data-field-type="object"
      data-field-name={fieldName}
    >
      <div className="capitalize mb-4 border-b-2 border-gray-600">
        <span className="text-xl">{fieldName.split('_').join(' ')}</span>
      </div>
      {splitFields}
    </div>
  );
};

const mapArrayIntoFields = (fieldName, fieldSkeleton) => {
  if (!fieldSkeleton.value.length) return null;
  return (
    <div
      key={`field-group-array-${generate()}`}
      className="m-2 p-4 rounded border-2 border-purple-400"
      data-field-type="array"
    >
      <div
        className="capitalize mb-4 border-b-2 border-gray-600"
      >
        <span className="text-xl">{fieldName.split('_').join(' ')}</span>
      </div>
      {fieldSkeleton.value.map((value, index) =>
        getMatchingComponent(`${fieldName}[${index}]`, value, index),
      )}
    </div>
  );
};

// supported types: string, number, object, array
const getMatchingComponent = (fieldName, fieldSkeleton, index) => {
  if (fieldSkeleton.type === 'number') {
    return (<TextInput
      key={`${fieldName}-${fieldSkeleton.type}`}
      dataField={fieldName}
      dataIndex={index}
      id={fieldName}
      label={fieldName}
      value={fieldSkeleton.value}
      type={fieldSkeleton.type}
    />);
  }

  if ([ 'string' ].includes(fieldSkeleton.type)) {

    if(fieldSkeleton.value.length > 100) return (
      <TextArea
        key={`${fieldName}-${fieldSkeleton.type}`}
        dataField={fieldName}
        dataIndex={index}
        id={fieldName}
        label={fieldName}
        value={fieldSkeleton.value}
      />
    )

    return (
      <TextInput
        key={`${fieldName}-${fieldSkeleton.type}`}
        dataField={fieldName}
        dataIndex={index}
        id={fieldName}
        label={fieldName}
        value={fieldSkeleton.value}
        type={fieldSkeleton.type}
      />
    );
  }

  if (fieldSkeleton.type === 'array') {
    return mapArrayIntoFields(fieldName, fieldSkeleton);
  }

  if (fieldSkeleton.type === 'object') {
    return mapObjectIntoFields(fieldName, fieldSkeleton);
  }
};

export default props => {
  const { formData } = props;
  const [ jsonData, setJsonData ] = useState(require('./form-skeleton.json'));
  const [ jsonFormStructure, setJsonFormStructure ] = useState(formData);
  // wordcloud doesn't do anything here
  delete formData.wordcloud;

  const oneEventForAll = event => {
    console.log('triggered');
    let propertyMap = mapObjectTreeFromProperty(event.target);
    propertyMap = propertyMap.replace('.', '');
    propertyMap = propertyMap.split('.');
    propertyMap.push('$');
    propertyMap = propertyMap.reverse().join('.');

    console.log(propertyMap, event.target.value);

    const newJson = { ...jsonData };
    jsonpath.apply(newJson, propertyMap, () => {
      return event.target.value;
    });

    setJsonData(newJson);
    setJsonFormStructure(mapJsonIntoFields(newJson));
  };

  useEffect(() => {
    document.querySelectorAll('.js-dynamic-field-text').forEach(textField => {
      textField.addEventListener('change', oneEventForAll);
    });

    return () => {
      document.querySelectorAll('.js-dynamic-field-text').forEach(textField => {
        textField.removeEventListener('change', oneEventForAll);
      });
    };
  }, [ jsonData, jsonFormStructure ]);

  return (
    <div className="flex flex-column w-full">
      <div className="m-2 p-4 rounded border-2 border-black w-1/2" data-root="true">
        {Object.keys(jsonFormStructure).map(key =>
          getMatchingComponent(key, jsonFormStructure[key]),
        )}
      </div>
      <div className="m-2 p-4 rounded border-2 border-blue-400 w-1/2">
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(jsonData, null, 2)}
        </pre>
      </div>
    </div>
  );
};
