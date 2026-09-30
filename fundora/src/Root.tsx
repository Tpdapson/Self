import {Composition} from 'remotion';
import './fonts';
import {StyleCard} from './StyleCard';
import {video} from './theme';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Reference sheet for the tokens in theme.ts. Scenes register here as they're built. */}
      <Composition
        id="StyleCard"
        component={StyleCard}
        durationInFrames={1}
        fps={video.fps}
        width={video.main.width}
        height={video.main.height}
      />
    </>
  );
};
