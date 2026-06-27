import innergyLogo from '../assets/innergy-logo-removebg.png';

type Props = {
  compact?: boolean;
  glowing?: boolean;
};

export function InnergyLogo({ compact = false, glowing = false }: Props) {
  return (
    <div className={`innergy-logo ${compact ? 'innergy-logo--compact' : ''} ${glowing ? 'innergy-logo--glow' : ''}`}>
      <img src={innergyLogo} alt="Innergy" draggable="false" />
    </div>
  );
}
