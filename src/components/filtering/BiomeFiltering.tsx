import { Combobox } from '@kobalte/core';
import { BiRegularCaretDown, BiRegularCheck, BiRegularX } from 'solid-icons/bi';
import { Component, For, createEffect, createSignal } from 'solid-js';
import { BIOMES, BiomeItem } from '../../lib/Biomes';
import { useSettingsContext } from '../../providers/SettingsProvider';

const BiomeFiltering: Component = () => {
  const [_settings, { updateFilteredBiomes }] = useSettingsContext();
  const [values, setValues] = createSignal<BiomeItem[]>([]);
  createEffect(() => {
    updateFilteredBiomes(values().map((biome) => biome.value));
  });

  return (
    <div class='bg-base-100'>
      <Combobox.Root<BiomeItem>
        multiple
        options={BIOMES.sort((a, b) => a.label.localeCompare(b.label))}
        optionValue='value'
        optionTextValue='label'
        optionLabel='label'
        optionDisabled='disabled'
        value={values()}
        onChange={setValues}
        placeholder='Search biome options'
        itemComponent={(props) => (
          <Combobox.Item
            class='join-item cursor-pointer flex justify-between items-center hover:underline pb-1'
            item={props.item}>
            <Combobox.ItemLabel>{props.item.rawValue.label}</Combobox.ItemLabel>
            <Combobox.ItemIndicator class='bg-success/75 rounded-full p-1 float-right'>
              <BiRegularCheck />
            </Combobox.ItemIndicator>
          </Combobox.Item>
        )}>
        <Combobox.Portal>
          <Combobox.Content
            class='rounded-lg border-2 border-slate-400 bg-base-100  p-2 join join-vertical gap-1 text-sm'
            style={{
              position: 'fixed',
              top: `${-16 - values().length * 1.075}rem`,
              left: 'calc(100% + 2.5rem)',
              'max-height': 'calc(80vh - 4rem)',
              'overflow-y': 'scroll',
              width: '20rem',
            }}>
            <span class='join-item bg-base-100 border-b border-b-slate-500 font-medium text-center'>
              Available Biomes
            </span>
            <Combobox.Listbox />
          </Combobox.Content>
        </Combobox.Portal>
        <Combobox.Control<BiomeItem> aria-label='Biomes'>
          {(state) => (
            <>
              <div class='flex flex-col gap-2'>
                <div class='join join-vertical gap-1'>
                  <For each={state.selectedOptions()}>
                    {(option) => (
                      <div class='join-item flex justify-between max-w-xs'>
                        <span
                          class='text-xs cursor-default truncate'
                          title={option.label}
                          onPointerDown={(e) => e.stopPropagation()}>
                          {option.label}
                        </span>
                        <button
                          class='hover:text-error tooltip tooltip-left'
                          data-tip='Remove'
                          onClick={() => state.remove(option)}>
                          <BiRegularX />
                        </button>
                      </div>
                    )}
                  </For>
                </div>
                <div class='form-control w-full'>
                  <Combobox.Input class='input input-xs input-bordered w-full max-w-xs' />
                </div>
                <div class='flex flex-row justify-between'>
                  <Combobox.Trigger
                    class='self-center tooltip tooltip-right bg-info rounded hover:text-black/50'
                    data-tip='Show All Options'>
                    <Combobox.Icon>
                      <BiRegularCaretDown />
                    </Combobox.Icon>
                  </Combobox.Trigger>
                  <button
                    class='bg-error hover:text-black/50 rounded self-center tooltip tooltip-left'
                    data-tip='Clear All'
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={state.clear}>
                    <BiRegularX />
                  </button>
                </div>
              </div>
            </>
          )}
        </Combobox.Control>
      </Combobox.Root>
    </div>
  );
};

export default BiomeFiltering;
