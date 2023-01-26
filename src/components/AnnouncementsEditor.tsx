import { invoke } from '@tauri-apps/api';
import { save } from '@tauri-apps/api/dialog';
import { Component, For, createResource, createSignal } from 'solid-js';
import { AnnouncementFlag, DFAnnouncement } from '../definitions/types';
import { DIR_DF, useDirectoryProvider } from '../providers/DirectoryProvider';
import AnnouncementForm from './AnnouncementForm';

const AnnouncementsEditor: Component = () => {
  const directoryContext = useDirectoryProvider();
  const [localAnnouncements, setLocalAnnouncements] = createSignal<DFAnnouncement[]>([]);

  createResource(async (): Promise<DFAnnouncement[]> => {
    if (directoryContext.currentDirectory().type !== DIR_DF) {
      return [];
    }
    try {
      const raw_result: string = await invoke('parse_announcements_txt', {
        path: [...directoryContext.currentDirectory().path, 'data', 'init', 'announcements.txt'].join('/'),
      });
      const announcements: DFAnnouncement[] = await JSON.parse(raw_result);
      setLocalAnnouncements([].concat(announcements));
    } catch (e) {
      console.error(e);
    }
  });

  const updateAnnouncement = (key: string, flag: AnnouncementFlag, remove = false) => {
    for (let aIdx = 0; aIdx < localAnnouncements.length; aIdx++) {
      if (localAnnouncements[aIdx].key === key) {
        if (remove) {
          const fIdx = localAnnouncements[aIdx].flags.indexOf(flag);
          if (fIdx > -1) {
            localAnnouncements[aIdx].flags = localAnnouncements[aIdx].flags.slice(
              fIdx,
              fIdx + 1 === localAnnouncements[aIdx].flags.length ? undefined : fIdx + 1
            );
            console.log(`Removed ${flag} from ${key}`);
          }
        } else {
          if (localAnnouncements[aIdx].flags.indexOf(flag) !== -1) {
            localAnnouncements[aIdx].flags.push(flag);
            console.log(`Added ${flag} to ${key}`);
          }
        }
      }
    }
  };

  async function saveModifiedAnnouncements() {
    const saveFilePath = await save({
      filters: [
        {
          name: 'announcements',
          extensions: ['txt'],
        },
      ],
    });
    if (typeof saveFilePath === 'undefined') {
      return;
    }
  }
  return (
    <>
      <p>
        Displayed are the current settings for announcements from your game directory. You may edit the settings here
        and export to a new file location or choose to overwrite the existing announcements.txt file (use with
        caution!). It is possible to get a default version of the announcements.txt file back by validating files on
        steam.
      </p>
      <section>
        <For each={localAnnouncements()}>
          {(announcement) => <AnnouncementForm announcement={announcement} update={updateAnnouncement} />}
        </For>
      </section>
    </>
  );
};

export default AnnouncementsEditor;
