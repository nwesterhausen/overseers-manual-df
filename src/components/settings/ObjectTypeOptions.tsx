import { Component } from 'solid-js';
import RawTypeCheckboxes from '../filtering/RawTypeCheckboxes';

const ObjectTypeOptions: Component = () => {
  return (
    <div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-3'>
      <RawTypeCheckboxes />
    </div>
  );
};

export default ObjectTypeOptions;
