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
