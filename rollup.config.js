import ts from "@wessberg/rollup-plugin-ts";
import {readFileSync, writeFileSync} from "fs";
const indexTypes = 'build/index.cjs.d.ts';

export default {
	plugins: [
		ts({
			/* Plugin options */
    }),
    {
      generateBundle(bundle) {
        // Switch the export format in CJS typings to be CommonJS style,
        // this keeps us closer to yargs's legacy API surface.
        if (bundle.file === indexTypes) {
          let body = readFileSync(indexTypes, 'utf8');
          body = body.replace(
            'export { yargsParser as default };', 'export = yargsParser;'
          );
          writeFileSync(indexTypes, body, 'utf8');
        }
      }
    }
  ],
};
