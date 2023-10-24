import { Component, createMemo } from 'solid-js';
import DFDirectoryNotSet from '../components/DFDirectoryNotSet';
import Listings from '../components/Listings';
import LoadingRawsProgress from '../components/LoadingRawsProgress';
import ParsingProgressBar from '../components/ParsingProgressBar';
import { DIR_NONE, useDirectoryProvider } from '../providers/DirectoryProvider';
import { STS_EMPTY, useRawsProvider } from '../providers/RawsProvider';

const ReferenceManual: Component = () => {
  const rawsContext = useRawsProvider();
  const directoryContext = useDirectoryProvider();
  // Helper boolean to know when to display the page or not
  const contentToDisplay = createMemo(() => {
    return rawsContext.parsingStatus() !== STS_EMPTY && directoryContext.currentDirectory().type !== DIR_NONE;
  });
  return (
    <div class='px-2 main'>
      <div class='flex justify-center'>
        <ParsingProgressBar />
        <LoadingRawsProgress />
      </div>
      {contentToDisplay() ? <Listings /> : <DFDirectoryNotSet />}
    </div>
  );
};

export default ReferenceManual;
