import { Button, Container, Stack } from 'solid-bootstrap';
import { Component, For } from 'solid-js';
import { DIR_DF, DIR_SAVE, useDirectoryProvider } from '../providers/DirectoryProvider';

const DFDirectoryNotSet: Component = () => {
  const directoryContext = useDirectoryProvider();

  return (
    <>
      {directoryContext.directoryPath().length == 0 ? (
        <>
          <Stack gap={2}>
            <h2>No valid path is set!</h2>
            <p>
              To set the path to your Dwarf Fortress game, drag and drop the <code>gamelog.txt</code> file from the
              dwarf fortress directory onto this window, or use a button below to pull up a folder selection dialog.
            </p>
            <Stack class='p-3' direction='horizontal' gap={3}>
              <Button
                variant='primary'
                onClick={() => {
                  directoryContext.setDirectoryType(DIR_DF);
                  directoryContext.setManualFolderSelect(true);
                }}>
                Set Dwarf Fortress Directory
              </Button>
              <Button
                variant='secondary'
                onClick={() => {
                  directoryContext.setDirectoryType(DIR_SAVE);
                  directoryContext.setManualFolderSelect(true);
                }}>
                Set an Arbitrary Save Directory
              </Button>
            </Stack>
          </Stack>
        </>
      ) : directoryContext.currentSave().length > 0 ? (
        <></>
      ) : (
        <>
          <p class='text-center'>Please choose a save to load raws from:</p>
          <Container class='justify-content-center d-flex mx-auto w-50'>
            <Stack gap={1}>
              <For each={directoryContext.saveDirectoryOptions()}>
                {(dir) => (
                  <Button onClick={() => directoryContext.setCurrentSave(dir)} variant='outline-secondary'>
                    {dir}
                  </Button>
                )}
              </For>
            </Stack>
          </Container>
        </>
      )}
    </>
  );
};

export default DFDirectoryNotSet;
