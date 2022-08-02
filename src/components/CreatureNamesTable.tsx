import { Table } from 'solid-bootstrap';
import { Component, For } from 'solid-js';
import { CasteRange } from '../definitions/Creature';
import { toTitleCase, CleanName } from '../definitions/Utils';

const CondenseNames = (names: CasteRange<string[]>): CasteRange<string[]> => {
  const condensed: CasteRange<string[]> = {};
  // First add the species name to condensed
  condensed.SPECIES = names.SPECIES;
  // For ALL other option, if it doesn't match and isn't empty, add it
  if (names.ALL && names.ALL.join('') !== names.SPECIES.join('')) {
    condensed.ALL = names.ALL;
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
    'child_ALL',
    'baby_ALL',
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
    <Table class='m-0 p-0' size='sm' borderless>
      <tbody>
        <For each={Object.keys(names)} fallback={<p>No name data.</p>}>
          {(caste) =>
            names[caste] && names[caste].length && names[caste].join('').length ? (
              <tr>
                {caste === 'ALL' ? (
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
