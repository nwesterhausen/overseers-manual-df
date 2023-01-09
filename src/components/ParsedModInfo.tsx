import { Component, For, Show, createEffect, createSignal } from 'solid-js';
import { useRawsProvider } from '../providers/RawsProvider';
import RawModuleInfoTable from './RawModuleInfoTable';

const ParsedModInfo: Component = () => {
  const rawsContext = useRawsProvider();
  const [selected, setSelected] = createSignal('');

  createEffect(() => {
    if (rawsContext.rawsInfo.latest.length > 0) {
      setSelected(rawsContext.rawsInfo.latest[0].identifier);
    } else {
      setSelected('');
    }
  });

  return (
    <div>
      <section>
        <h2>Summary</h2>
        <ul>
          <li>Total read raw modules: {rawsContext.rawsInfo.latest.length}</li>
          <li>
            From installed_mods:{' '}
            {rawsContext.rawsInfo.latest.filter((v) => v.sourcedDirectory === 'installed_mods').length}
          </li>
          <li>From mods: {rawsContext.rawsInfo.latest.filter((v) => v.sourcedDirectory === 'mods').length}</li>
          <li>From mods: {rawsContext.rawsInfo.latest.filter((v) => v.sourcedDirectory === 'vanilla').length}</li>
        </ul>
      </section>
      <section>
        <select
          onChange={(e) => {
            const el = e.target as HTMLSelectElement;
            setSelected(el.value);
          }}>
          <For each={rawsContext.rawsInfo.latest.sort((a, b) => a.displayTitle < b.displayTitle ? -1 : 1)}>
            {(modInfo) => (
              <option value={modInfo.identifier} selected={selected() === modInfo.identifier}>
                {modInfo.name} v{modInfo.displayedVersion} (from {modInfo.displayedVersion})
              </option>
            )}
          </For>
        </select>
        <Show when={selected() !== ''}>
          <legend>Details</legend>
          <RawModuleInfoTable module={rawsContext.rawsInfo.latest.find((v) => v.identifier === selected())} />
        </Show>
      </section>
    </div>
  );
};

export default ParsedModInfo;
