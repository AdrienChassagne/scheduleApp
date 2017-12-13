import { Injectable } from '@angular/core';
import { colors } from '../classes/ccolors';

@Injectable()
export class CssManagerService {

  constructor() { }

  setStyle(state: any, darker) {
    let color = colors.yellow;

    if (state === 0) {
      color = colors.yellow;
    } else if (state > 0 && state < 6) {
      color = colors.green;
    }
    else if (state >= 6 && state < 12) {
      color = colors.blue;
    }
    else if (state >= 12) {
      color = colors.sblue;
    }
    else if (state < 0 && state > -9) {
      color = colors.orange;
    }
    else if (state <= -9 && state > -16) {
      color = colors.red;
    }
    else if (state <= -16) {
      color = colors.sred;
    }
    if (darker === false) {
      color = color.secondary;
    } else {
      color = color.primary;
    }
    return { 'background-color': color };
  }

  setState(done, soon) {
    let state = 0;
    if (done) {
      state = 1;
    } else if (!done && soon === 0) {
      state = 0;
    } else if (!done && soon === 1) {
      state = -1;
    } else if (!done && soon === 2) {
      state = -9;
    }
    return state;
  }
}
