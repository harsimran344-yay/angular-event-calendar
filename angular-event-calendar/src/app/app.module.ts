import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  imports: [CommonModule, FormsModule, BrowserModule, HttpClientModule],
  exports: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
