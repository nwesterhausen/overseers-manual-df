import { Component, createMemo } from 'solid-js';
import { STS_IDLE, STS_LOADING, STS_PARSING, useRawsProvider } from '../../providers/RawsProvider';
import AdvancedFiltersButton from './AdvancedFiltersButton';
import DisplayStyleButton from './DisplayStyleButton';
import GameReferenceButton from './GameReferenceButton';
import OpenSettingsButton from './OpenSettingsButton';
import RawTypeCheckboxes from './RawTypeCheckboxes';
import ReloadRawsButton from './ReloadRawsButton';
import SearchBox from './SearchBox';
import SetDirectoryButton from './SetDirectoryButton';
import TagRestrictionButton from './TagRestrictionButton';
import ThemeChangeButton from './ThemeChangeButton';

const MenuBar: Component = () => {
  const rawsContext = useRawsProvider();

  const disableButtons = createMemo(() => rawsContext.parsingStatus() !== STS_IDLE);

  return (
    <>
      <div class='hstack gap-2 px-2 menu-bar'>
        <div class='me-auto'>
          <SetDirectoryButton
            disabled={rawsContext.parsingStatus() === STS_PARSING && rawsContext.parsingStatus() === STS_LOADING}
          />
          <ReloadRawsButton disabled={disableButtons()} />
        </div>

        <div class='hstack p-2'>
          <DisplayStyleButton disabled={disableButtons()} />
          <SearchBox disabled={disableButtons()} />
          <RawTypeCheckboxes disabled={disableButtons()} />
          <TagRestrictionButton disabled={disableButtons()} />
          <AdvancedFiltersButton disabled={disableButtons()} />
        </div>

        <div class='ms-auto'>
          <GameReferenceButton disabled={disableButtons()} />

          <ThemeChangeButton />
          <OpenSettingsButton />
        </div>
      </div>
    </>
  );
};

export default MenuBar;
