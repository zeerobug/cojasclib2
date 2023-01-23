import * as brewer from './colorschemes.brewer';
import * as office from './colorschemes.office';
import * as tableau from './colorschemes.tableau';

export default {
  scheme: (scheme) => {
    return tableau[scheme];
  },
};
