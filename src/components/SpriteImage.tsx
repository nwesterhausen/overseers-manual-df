import { convertFileSrc, invoke } from '@tauri-apps/api/primitives';
import { BiRegularImageAlt } from 'solid-icons/bi';
import { Component, Show, createMemo, createResource, createSignal } from 'solid-js';
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
        matchingGraphics: undefined,
        tilePages: [],
      },
    },
  );

  const [currentIndex, setCurrentIndex] = createSignal(0);

  const spriteDetails = createMemo((): SpriteImageDetail[] => {
    if (typeof graphics.latest.matchingGraphics === 'undefined' || graphics.latest.tilePages.length === 0) {
      return [
        {
          graphicFilePath: '',
          offset: { x: 0, y: 0 },
          offset2: { x: 0, y: 0 },
          tileDim: { x: 0, y: 0 },
          pageDim: { x: 0, y: 0 },
        },
      ];
    }
    const results: SpriteImageDetail[] = [];
    for (const graphic of graphics.latest.matchingGraphics) {
      // technically this is different for each isn't it...
      if (graphic.sprites && graphic.sprites.length > 0) {
        for (const sprite of graphic.sprites) {
          const tilePage = graphics.latest.tilePages.find((tp) => tp.identifier === sprite.tilePageId);
          if (tilePage.file.length > 0) {
            results.push({
              graphicFilePath: tilePage.file,
              offset: sprite.offset,
              offset2: sprite.offset2,
              tileDim: tilePage.tileDim,
              pageDim: tilePage.pageDim,
            });
          }
        }
      } else if (graphic.layers.length > 0) {
        const layer = graphic.layers[0][1][0];
        const tilePage = graphics.latest.tilePages.find((tp) => tp.identifier === layer.tilePageId);
        if (tilePage.file.length > 0) {
          results.push({
            graphicFilePath: tilePage.file,
            offset: layer.offset,
            offset2: layer.offset2,
            tileDim: tilePage.tileDim,
            pageDim: tilePage.pageDim,
          });
        }
      }
    }
    return results;
  });

  setInterval(() => {
    if (spriteDetails().length > 0) {
      if (currentIndex() + 1 >= spriteDetails().length) {
        setCurrentIndex(0);
      } else {
        setCurrentIndex(currentIndex() + 1);
      }
    } else {
      setCurrentIndex(0);
    }
  }, 5 * 1000);

  const assetUrl = createMemo(() => {
    if (spriteDetails().length > 0) {
      if (spriteDetails()[currentIndex()].graphicFilePath.length > 0) {
        const filePath = spriteDetails()[currentIndex()].graphicFilePath.replace(/\\/g, '/');
        const assetUrl = convertFileSrc(filePath);
        return assetUrl;
      }
    }
    return '';
  });

  const offsetX = createMemo(() => {
    let offX = spriteDetails()[currentIndex()].offset.x;
    if (spriteDetails()[currentIndex()].offset2 && spriteDetails()[currentIndex()].offset2.x > offX) {
      offX = spriteDetails()[currentIndex()].offset2.x;
    }
    return offX;
  });
  const offsetY = createMemo(() => {
    let offY = spriteDetails()[currentIndex()].offset.y;
    if (spriteDetails()[currentIndex()].offset2 && spriteDetails()[currentIndex()].offset2.y > offY) {
      offY = spriteDetails()[currentIndex()].offset2.y;
    }
    return offY;
  });
  const dimX = createMemo(() => {
    const scale = offsetX() - spriteDetails()[currentIndex()].offset.x + 1;
    return spriteDetails()[currentIndex()].tileDim.x * scale;
  });
  const dimY = createMemo(() => {
    const scale = offsetY() - spriteDetails()[currentIndex()].offset.y + 1;
    return spriteDetails()[currentIndex()].tileDim.y * scale;
  });
  const positionOffset = createMemo(() => {
    return `${
      spriteDetails()[currentIndex()].pageDim.x - (offsetX() + 1) * spriteDetails()[currentIndex()].tileDim.x + dimX()
    }px ${
      spriteDetails()[currentIndex()].pageDim.y - (offsetY() + 1) * spriteDetails()[currentIndex()].tileDim.y + dimY()
    }px`;
  });
  return (
    <Show
      when={currentSettings.displayGraphics && spriteDetails()[currentIndex()].graphicFilePath.length > 0}
      fallback={
        <div class='tooltip' data-tip={graphics.loading ? 'Loading graphics..' : 'No Graphics Found'}>
          <div
            class={`border-2 rounded-lg border-accent bg-black/50 ${props.class}`}
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
      <div class={`border-2 rounded-lg border-accent bg-black/50 ${props.class}`}>
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
