import releases from './dump/releases';

import { delay } from './common';

export default {
  list() {
    return delay(releases);
  },
};
