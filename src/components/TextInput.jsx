import React, { useState } from 'react';
import shortid from 'shortid';

export const TextInput = props => {
  const { id, label, type, dataField, dataIndex, value, onChange, validateAs } = props;
  const [ innerValue, setInnerValue ] = useState(value);
  const [ invalid, setValidity ] = useState(!value);
  const uId = `${id}_${shortid.generate()}`;

  const handleChange = event => {
    const { value } = event.target;

    // No characters for input number
    if (event.target.type === 'number' && (!value || isNaN(value))) {
      event.preventDefault();
      return;
    }

    if (onChange) onChange(value);
    setValidity(!value);
    setInnerValue(value);
  };

  const validityInputClass = invalid ? 'border border-red-500' : 'border';

  if (type === 'number') console.log({ type, value });
  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2 capitalize"
        htmlFor={uId}
      >
        {label}
      </label>
      <input
        className={`js-dynamic-field-text shadow appearance-none ${validityInputClass} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
        id={uId}
        type={type}
        onChange={handleChange}
        value={innerValue}
        placeholder={id}
        data-field-name={dataField}
        data-field-index={dataIndex}
      />
      <p className={`text-red-500 mt-2 text-xs italic ${invalid ? '' : 'invisible'}`}>Field <span className="capitalize">{id}</span> is required.</p>
    </div>
  );
};
