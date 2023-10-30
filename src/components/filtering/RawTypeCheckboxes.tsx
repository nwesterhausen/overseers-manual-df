import { BiSolidCat, BiSolidCity, BiSolidDiamond, BiSolidTree } from 'solid-icons/bi';
import { Component } from 'solid-js';
import { useSettingsContext } from '../../providers/SettingsProvider';

const RawTypeCheckboxes: Component = () => {
  const [_settings, { toggleObjectType, objectTypeIncluded }] = useSettingsContext();

  return (
    <>
      <div class='form-control'>
        <label class='cursor-pointer label'>
          <div class='join'>
            <BiSolidCat class='me-2' />
            <span class='label-text'>Include Creatures</span>
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
        <label class='cursor-pointer label'>
          <div class='join'>
            <BiSolidTree class='me-2' />
            <span class='label-text'>Include Plants</span>
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
        <label class='cursor-pointer label'>
          <div class='join'>
            <BiSolidDiamond class='me-2' />
            <span class='label-text'>Include Inorganics</span>
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
        <label class='cursor-pointer label'>
          <div class='join'>
            <BiSolidCity class='me-2' />
            <span class='label-text'>Include Entities</span>
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
    </>
  );
};

export default RawTypeCheckboxes;
