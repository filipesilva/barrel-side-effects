# BarrelSideEffects

This repository reproduces the problem in https://github.com/angular/angular-cli/issues/16799.

```
git clone https://github.com/filipesilva/barrel-side-effects
npm install
npm run repro
```

## What's happening?

This app contains the following files:

- `src/app/another/index.ts`
```ts
export * from './another.module';
export * from './side-effects';
```

- `src/app/another/another.module.ts`
```ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class AnotherModule { }
```

- `src/app/another/side-effects.ts`
```ts
import { DateTime } from 'luxon';

export const local = () => DateTime.local();
export const map = new Map([['key', 'value']]);
```

- `src/app/app.module.ts`
```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AnotherModule } from './another/index';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AnotherModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

These files are setup so that:
- `src/app/app.module.ts` imports `AnotherModule` from `src/app/another/index.ts`
- `src/app/another/index.ts` also exports `src/app/another/side-effects.ts`, a file that isn't used but loads a library (`Luxon`) and has a toplevel side effect (a `Map` instantiated with `['key', 'value']`).

`npm run repro` will build the application first with Ivy, and then with View Engine (VE, the compiler before Ivy).

The Ivy build will contain the contents of `src/app/another/side-effects.ts`, but the VE build will not.
You can tell because the Ivy build is much larger. You can also open `dist/barrel-side-effects/main.js` and find `Luxon` referenced there, along with map (as `new Map([["key","value"]])`).
