import React from 'react';
import DynamicForm from './DynamicForm';
import { mapJsonIntoFields } from '../form-metadata-generator';

export default function App() {
  const formSkeleton = mapJsonIntoFields(require('../form-skeleton.json'));

  return (
    <div className="App m-4">
      <h1 className="text-center text-2xl text-purple-800">
        Le form generator
      </h1>
      <DynamicForm formData={formSkeleton} />
    </div>
  );
}
