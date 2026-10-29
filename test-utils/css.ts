/*
 * Reading a stylesheet in a test: the stylesheet tests (`Motion.css.test.ts`,
 * `SortingTable.css.test.ts`) hold CSS to its own shape, so they need the text
 * of one block and the value of one declaration in it.
 */

/** The text between the braces that follow `header`, which must occur once. */
export function cssBlock(source: string, header: string): string {
  const at = source.indexOf(header);
  if (at < 0 || source.indexOf(header, at + 1) >= 0) {
    throw new Error(`expected exactly one ${JSON.stringify(header)}`);
  }
  const open = source.indexOf('{', at + header.length - 1);
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === '{') {
      depth += 1;
    } else if (source[i] === '}') {
      depth -= 1;
      if (depth === 0) {
        return source.slice(open + 1, i);
      }
    }
  }
  throw new Error(`unclosed ${header}`);
}

/** One declaration's value in a block, e.g. `transform`, its whitespace folded. */
export function cssValue(block: string, property: string): string {
  const match = block.match(new RegExp(`(?:^|[\\s;{])${property}:\\s*([^;]+);`));
  if (!match) {
    throw new Error(`no ${property} in ${block}`);
  }
  return match[1].trim().replace(/\s+/g, ' ');
}
