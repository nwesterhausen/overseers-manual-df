import { BiSolidCat, BiSolidCity, BiSolidDiamond, BiSolidTree } from 'solid-icons/bi';
import { Component } from 'solid-js';
import { useSettingsContext } from '../../providers/SettingsProvider';

const ObjectTypeOptions: Component = () => {
  const [_settings, { toggleObjectType, objectTypeIncluded }] = useSettingsContext();

  return (
    <div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-3'>
      <div class='form-control'>
        <label class='cursor-pointer label hover:font-semibold'>
          <div class='join'>
            <BiSolidCat class='me-2' />
            <span class='label-text'>
              Include <code>Creature</code> objects
            </span>
          </div>
          <input
            type='checkbox'
            class='toggle toggle-primary'
            name='settingsEnableCreatureResults'
            checked={objectTypeIncluded('Creature')}
            onClick={() => toggleObjectType('Creature')}
          />
        </label>
      </div>
      <div class='form-control'>
        <label class='cursor-pointer label hover:font-semibold'>
          <div class='join'>
            <BiSolidTree class='me-2' />
            <span class='label-text'>
              Include <code>Plant</code> objects
            </span>
          </div>
          <input
            type='checkbox'
            class='toggle toggle-primary'
            name='settingsEnablePlanResults'
            checked={objectTypeIncluded('Plant')}
            onClick={() => toggleObjectType('Plant')}
          />
        </label>
      </div>
      <div class='form-control'>
        <label class='cursor-pointer label hover:font-semibold'>
          <div class='join'>
            <BiSolidDiamond class='me-2' />
            <span class='label-text'>
              Include <code>Inorganic</code> objects
            </span>
          </div>
          <input
            type='checkbox'
            class='toggle toggle-primary'
            name='settingsEnableInorganicResults'
            checked={objectTypeIncluded('Inorganic')}
            onClick={() => toggleObjectType('Inorganic')}
          />
        </label>
      </div>
      <div class='form-control'>
        <label class='cursor-pointer label hover:font-semibold'>
          <div class='join'>
            <BiSolidCity class='me-2' />
            <span class='label-text'>
              Include <code>Entity</code> objects
            </span>
          </div>
          <input
            type='checkbox'
            class='toggle toggle-primary'
            name='settingsEnableEntityResults'
            checked={objectTypeIncluded('Entity')}
            onClick={() => toggleObjectType('Entity')}
          />
        </label>
      </div>
    </div>
  );
};

export default ObjectTypeOptions;
