import { Table } from 'solid-bootstrap';
import { Component, For } from 'solid-js';
import { CasteRange, CleanName } from '../definitions/Creature';
import { toTitleCase } from '../definitions/Utils';

const CondenseNames = (names: CasteRange<string[]>): CasteRange<string[]> => {
  const condensed: CasteRange<string[]> = {};
  // First add the species name to condensed
  condensed.SPECIES = names.SPECIES;
  // For every other option, if it doesn't match and isn't empty, add it
  if (names.EVERY && names.EVERY.join('') !== names.SPECIES.join('')) {
    condensed.EVERY = names.EVERY;
  }
  if (names.MALE && names.MALE.join('') !== names.SPECIES.join('')) {
    condensed.MALE = names.MALE;
  }
  if (names.FEMALE && names.FEMALE.join('') !== names.SPECIES.join('')) {
    condensed.FEMALE = names.FEMALE;
  }
  // For child options, only if they are needed
  for (const k of [
    'child_SPECIES',
    'baby_SPECIES',
    'child_EVERY',
    'baby_EVERY',
    'child_MALE',
    'baby_MALE',
    'child_FEMALE',
    'baby_FEMALE',
  ]) {
    if (names[k] && names[k].length && names[k].join('').length) {
      condensed[k] = names[k];
    }
  }
  return condensed;
};

const CreatureNamesTable: Component<{ names: CasteRange<string[]> }> = (props) => {
  const names = CondenseNames(props.names);
  return (
    <Table size='sm' borderless>
      <tbody>
        <For each={Object.keys(names)} fallback={<p>No name data.</p>}>
          {(caste) =>
            names[caste] && names[caste].length && names[caste].join('').length ? (
              <tr>
                {caste === 'EVERY' ? (
                  <td>General</td>
                ) : (
                  <td>
                    {caste
                      .split('_')
                      .map((v) => toTitleCase(v))
                      .join(' ')}
                  </td>
                )}
                <td>{CleanName(names[caste])}</td>
              </tr>
            ) : (
              ''
            )
          }
        </For>
      </tbody>
    </Table>
  );
};

export default CreatureNamesTable;
