import { SpriteSvg } from './SpriteSvg';
import classes from './Mascot.module.css';

export { SCALE } from './SpriteSvg';

/**
 * The envelope as the home page draws it (`HeroGuide`, `ScrollGuide`): the
 * sprite with this stylesheet's classes, which walk it frame by frame and
 * blink it once as it lands.
 */
export function Mascot({ walking = false, pointing = false }) {
  return (
    <SpriteSvg
      walking={walking}
      pointing={pointing}
      className={classes.sprite}
      stepA={classes.stepA}
      stepB={classes.stepB}
      blink={classes.blink}
    />
  );
}
