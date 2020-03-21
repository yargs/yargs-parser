import "../../deps.js"

// @deno-types="https://unpkg.com/@types/mocha@5.2.7/index.d.ts"
import "https://unpkg.com/mocha@7.0.0/mocha.js"

mocha.setup({ ui: 'bdd', reporter: 'spec' })

export function runTests(): void {
  mocha.run(onCompleted);
}

function onCompleted(failures: number): void {
  if (failures > 0) {
    Deno.exit(1);
  } else {
    Deno.exit(0);
  }
}
