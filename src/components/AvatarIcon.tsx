import "./AvatarIcon.css";

/** Total number of avatars available */
export const AVATAR_COUNT = 16;

interface AvatarIconProps {
  index: number;
  /** Size in px — defaults to 28 */
  size?: number;
}

/**
 * Renders a single avatar icon from individual files at /icons/0.png ~ 15.png.
 */
export default function AvatarIcon({ index, size = 28 }: AvatarIconProps) {
  return (
    <img
      className="avatar-icon"
      src={`/icons/${index}.png`}
      alt={`Avatar ${index + 1}`}
      width={size}
      height={size}
      draggable={false}
    />
  );
}
