import { convertFileSrc } from '@tauri-apps/api/tauri';
import { Component, Show, createMemo } from 'solid-js';
import { splitPathAgnostically } from '../definitions/Utils';
import { useDirectoryProvider } from '../providers/DirectoryProvider';
import { useRawsProvider } from '../providers/RawsProvider';
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
  graphicFilePath: string[];
  offset: Dimensions;
  offset2: Dimensions;
  pageDim: Dimensions;
  tileDim: Dimensions;
}

const SpriteImage: Component<SpriteImageProps> = (props) => {
  const directoryContext = useDirectoryProvider();
  const rawsContext = useRawsProvider();
  const [currentSettings] = useSettingsContext();

  const spriteDetails = createMemo((): SpriteImageDetail => {
    // const result = rawsContext.tryGetGraphicFor(props.identifier);
    const result = undefined;
    if (typeof result === 'undefined') {
      return {
        graphicFilePath: [],
        offset: { x: 0, y: 0 },
        offset2: { x: 0, y: 0 },
        tileDim: { x: 0, y: 0 },
        pageDim: { x: 0, y: 0 },
      };
    }
    return {
      graphicFilePath: splitPathAgnostically(result.tilePage.filePath),
      offset: result.graphic.offset,
      offset2: result.graphic.offset2,
      tileDim: result.tilePage.tileDim,
      pageDim: result.tilePage.pageDim,
    };
  });

  const assetUrl = createMemo(() => {
    if (spriteDetails().graphicFilePath.length > 0) {
      const filePath = [...directoryContext.currentDirectory().path, ...spriteDetails().graphicFilePath].join('/');
      const assetUrl = convertFileSrc(filePath);
      return assetUrl;
    }
    return '';
  });
  const offsetX = createMemo(() => {
    let offX = spriteDetails().offset.x;
    if (spriteDetails().offset2.x > offX) {
      offX = spriteDetails().offset2.x;
    }
    return offX;
  });
  const offsetY = createMemo(() => {
    let offY = spriteDetails().offset.y;
    if (spriteDetails().offset2.y > offY) {
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
    //     return `${props.dimensionX - props.offsetX * 32}px ${props.dimensionY - props.offsetY * 32}px`;
  });
  return (
    <Show when={currentSettings.displayGraphics && spriteDetails().graphicFilePath.length > 0}>
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
