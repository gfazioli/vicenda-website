import classes from './SectionRule.module.css';

/**
 * The hairline between two sections of the home page, a small bead at each
 * end pointing in: lancetta.app's rule, whose beads are watch hands, with the
 * logo's sky in place of the watch.
 */
export function SectionRule() {
  return <div className={classes.rule} aria-hidden="true" />;
}
