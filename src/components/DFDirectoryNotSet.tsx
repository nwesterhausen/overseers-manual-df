import { Button, Container, Stack } from 'solid-bootstrap';
import { Component } from 'solid-js';
import { useDirectoryProvider } from '../providers/DirectoryProvider';

const DFDirectoryNotSet: Component = () => {
  const directoryContext = useDirectoryProvider();

  return (
    <>
      {directoryContext.saveFolderPath().length == 0 ? (
        <>
          <Stack gap={2}>
            <h2>Dwarf Fortress save directory path is unset!</h2>
            <p>
              To set the path to your Dwarf Fortress Save, drag and drop the <code>gamelog.txt</code> file from the
              dwarf fortress directory onto this window, or use the button below to pull up a folder selection dialog.
            </p>
            <Container class='p-3'>
              <Button
                variant='secondary'
                onClick={() => {
                  directoryContext.setManualFolderSelect(true);
                }}>
                Set Save Directory
              </Button>
            </Container>
          </Stack>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default DFDirectoryNotSet;
