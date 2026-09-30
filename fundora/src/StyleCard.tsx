import {AbsoluteFill} from 'remotion';
import {color, radius, shadow, type} from './theme';

const Swatch: React.FC<{name: string; hex: string}> = ({name, hex}) => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 12, width: 150}}>
    <div
      style={{
        height: 96,
        borderRadius: radius.card,
        background: hex,
        border: `2px solid ${color.darkCard}`,
      }}
    />
    <div style={{...type.small, fontSize: 22, color: color.white}}>{name}</div>
    <div style={{...type.small, ...type.tabular, fontSize: 20, color: color.muted}}>{hex}</div>
  </div>
);

export const StyleCard: React.FC = () => {
  return (
    <AbsoluteFill style={{background: color.navy, padding: 96, gap: 56}}>
      <div style={{...type.headline, color: color.white}}>Fundora style card</div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 32}}>
        {Object.entries(color).map(([name, hex]) => (
          <Swatch key={name} name={name} hex={hex} />
        ))}
      </div>
      <div style={{display: 'flex', gap: 48, alignItems: 'center'}}>
        <div style={{...type.caption, color: color.white}}>Caption, Geist 500</div>
        <div
          style={{
            ...type.caption,
            fontSize: 28,
            color: color.white,
            background: color.primary,
            borderRadius: radius.button,
            padding: '16px 28px',
          }}
        >
          Button 12px
        </div>
        <div
          style={{
            ...type.caption,
            fontSize: 24,
            color: color.success,
            background: color.white,
            borderRadius: radius.pill,
            padding: '8px 20px',
          }}
        >
          Paid
        </div>
        <div
          style={{
            width: 220,
            height: 124,
            borderRadius: radius.stage,
            background: color.surface,
            boxShadow: shadow.stageOnNavy,
          }}
        />
        <div style={{...type.caption, ...type.tabular, color: color.white}}>$263,500</div>
      </div>
    </AbsoluteFill>
  );
};
