import { Component, Show, createMemo } from 'solid-js';
import DFDirectoryNotSet from '../components/DFDirectoryNotSet';
import Listings from '../components/Listings';
import LoadingRawsProgress from '../components/LoadingRawsProgress';
import ParsingProgressBar from '../components/ParsingProgressBar';
import FilterButton from '../components/filtering/FilterButton';
import { DIR_NONE, useDirectoryProvider } from '../providers/DirectoryProvider';
import { STS_EMPTY, STS_IDLE, useRawsProvider } from '../providers/RawsProvider';

const ReferenceManual: Component = () => {
  const rawsContext = useRawsProvider();
  const directoryContext = useDirectoryProvider();
  // Helper boolean to know when to display the page or not
  const contentToDisplay = createMemo(() => {
    return rawsContext.parsingStatus() === STS_IDLE && directoryContext.currentDirectory().type !== DIR_NONE;
  });
  return (
    <div class='px-2 main'>
      <div class='flex justify-center'>
        <ParsingProgressBar />
        <LoadingRawsProgress />
      </div>
      <Show when={contentToDisplay()}>
        <FilterButton />
        <Listings />
      </Show>
      <Show when={!contentToDisplay() && rawsContext.parsingStatus() === STS_EMPTY}>
        <DFDirectoryNotSet />
      </Show>
    </div>
  );
};

export default ReferenceManual;
