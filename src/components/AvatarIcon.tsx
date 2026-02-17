import "./AvatarIcon.css";

/** Total number of avatars in the sprite sheet (4×4 grid) */
export const AVATAR_COUNT = 16;

interface AvatarIconProps {
  index: number;
  /** Size in px — defaults to 28 */
  size?: number;
}

/**
 * Renders a single avatar icon from the 4×4 sprite sheet at /icons/icons.png.
 * Uses CSS background-position to pick the correct cell.
 */
export default function AvatarIcon({ index, size = 28 }: AvatarIconProps) {
  const col = index % 4;
  const row = Math.floor(index / 4);
  // Percentages: each cell is 25% of the total (100/3 = 33.33 but with 4 cols we use percentage steps)
  // background-size: 400% means each cell = 1/4
  const bgPosX = col * (100 / 3); // 0%, 33.33%, 66.67%, 100%
  const bgPosY = row * (100 / 3);

  return (
    <span
      className="avatar-icon"
      style={{
        width: size,
        height: size,
        backgroundImage: "url(/icons/icons.png)",
        backgroundSize: "400%",
        backgroundPosition: `${bgPosX}% ${bgPosY}%`,
      }}
      role="img"
      aria-label={`Avatar ${index + 1}`}
    />
  );
}
