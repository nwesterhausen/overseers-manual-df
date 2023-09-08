import { Component, Show } from 'solid-js';
import { STS_LOADING, useRawsProvider } from '../providers/RawsProvider';

const LoadingRawsProgress: Component = () => {
  const rawsContext = useRawsProvider();
  return (
    <Show when={rawsContext.parsingStatus() === STS_LOADING}>
      <div class='join gap-3'>
        <span class='loading loading-ring loading-sm'></span>
        <span>Sorting, combining and loading raws...</span>
      </div>
    </Show>
  );
};

export default LoadingRawsProgress;
