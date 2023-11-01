import { convertFileSrc, invoke } from '@tauri-apps/api/primitives';
import { BiRegularImageAlt } from 'solid-icons/bi';
import { Component, Show, createMemo, createResource } from 'solid-js';
import { GraphicsResults } from '../definitions/GraphicsResults';
import { COMMAND_GET_GRAPHICS_FOR_IDENTIFIER } from '../lib/Constants';
import { useSettingsContext } from '../providers/SettingsProvider';

interface Dimensions {
  x: number;
  y: number;
}
export interface SpriteImageProps {
  identifier: string;
  class?: string;
}

interface SpriteImageDetail {
  graphicFilePath: string;
  offset: Dimensions;
  offset2: Dimensions;
  pageDim: Dimensions;
  tileDim: Dimensions;
}

//Todo: Handle multiple sprites (either cycle between them or let user cycle between them)

const SpriteImage: Component<SpriteImageProps> = (props) => {
  const [currentSettings] = useSettingsContext();

  const [graphics] = createResource<GraphicsResults>(
    async () => {
      return await invoke(COMMAND_GET_GRAPHICS_FOR_IDENTIFIER, {
        options: {
          identifier: props.identifier,
          allGraphics: true,
        },
      });
    },
    {
      initialValue: {
        graphic: undefined,
        tilePages: [],
      },
    },
  );

  const spriteDetails = createMemo((): SpriteImageDetail => {
    if (typeof graphics.latest.graphic === 'undefined' || graphics.latest.tilePages.length === 0) {
      return {
        graphicFilePath: '',
        offset: { x: 0, y: 0 },
        offset2: { x: 0, y: 0 },
        tileDim: { x: 0, y: 0 },
        pageDim: { x: 0, y: 0 },
      };
    }
    // technically this is different for each isn't it...
    if (graphics.latest.graphic.sprites && graphics.latest.graphic.sprites.length > 0) {
      const sprite = graphics.latest.graphic.sprites[0];
      const tilePage = graphics.latest.tilePages.find((tp) => tp.identifier === sprite.tilePageId);
      return {
        graphicFilePath: tilePage.file,
        offset: sprite.offset,
        offset2: sprite.offset2,
        tileDim: tilePage.tileDim,
        pageDim: tilePage.pageDim,
      };
    } else if (graphics.latest.graphic.layers.length > 0) {
      const layer = graphics.latest.graphic.layers[0][1][0];
      const tilePage = graphics.latest.tilePages.find((tp) => tp.identifier === layer.tilePageId);
      return {
        graphicFilePath: tilePage.file,
        offset: layer.offset,
        offset2: layer.offset2,
        tileDim: tilePage.tileDim,
        pageDim: tilePage.pageDim,
      };
    }
  });

  const assetUrl = createMemo(() => {
    if (spriteDetails().graphicFilePath.length > 0) {
      const filePath = spriteDetails().graphicFilePath.replace(/\\/g, '/');
      const assetUrl = convertFileSrc(filePath);
      return assetUrl;
    }
    return '';
  });

  const offsetX = createMemo(() => {
    let offX = spriteDetails().offset.x;
    if (spriteDetails().offset2 && spriteDetails().offset2.x > offX) {
      offX = spriteDetails().offset2.x;
    }
    return offX;
  });
  const offsetY = createMemo(() => {
    let offY = spriteDetails().offset.y;
    if (spriteDetails().offset2 && spriteDetails().offset2.y > offY) {
      offY = spriteDetails().offset2.y;
    }
    return offY;
  });
  const dimX = createMemo(() => {
    const scale = offsetX() - spriteDetails().offset.x + 1;
    return spriteDetails().tileDim.x * scale;
  });
  const dimY = createMemo(() => {
    const scale = offsetY() - spriteDetails().offset.y + 1;
    return spriteDetails().tileDim.y * scale;
  });
  const positionOffset = createMemo(() => {
    return `${spriteDetails().pageDim.x - (offsetX() + 1) * spriteDetails().tileDim.x + dimX()}px ${
      spriteDetails().pageDim.y - (offsetY() + 1) * spriteDetails().tileDim.y + dimY()
    }px`;
  });
  return (
    <Show
      when={currentSettings.displayGraphics && spriteDetails().graphicFilePath.length > 0}
      fallback={
        <div class='tooltip' data-tip={graphics.loading ? 'Loading graphics..' : 'No Graphics Found'}>
          <div
            class={`border-2 rounded-lg border-accent bg-black/50 ${props.class}`}
            data-parsed={JSON.stringify(spriteDetails())}
            style={{
              width: '32px',
              height: '32px',
              padding: '7px',
            }}>
            {graphics.loading ? (
              <div class='loading loading-dots loading-xs' style={{ width: '1rem', height: '1rem' }}></div>
            ) : (
              <BiRegularImageAlt />
            )}
          </div>
        </div>
      }>
      <div
        class={`border-2 rounded-lg border-accent bg-black/50 ${props.class}`}
        data-parsed={JSON.stringify(spriteDetails())}>
        <div
          style={{
            width: `${dimX()}px`,
            height: `${dimY()}px`,
            'background-image': `url("${assetUrl()}")`,
            'background-position': positionOffset(),
          }}></div>
      </div>
    </Show>
  );
};

export default SpriteImage;
