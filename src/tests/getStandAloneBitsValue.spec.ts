import { expect } from 'chai';
import 'mocha';
import { getStandAloneBitsValue } from '../bitwise';

describe('getStandAloneBitsValue', 
  () => { 
    it('getStandAloneBitsValue(255, [1]) == 1', () => { 
      expect(getStandAloneBitsValue(255, [1]))
        .to
        .equal(1); 
    });

    it('getStandAloneBitsValue(128, [1]) == 0', () => { 
      expect(getStandAloneBitsValue(128, [1]))
        .to
        .equal(0); 
    });

    it('getStandAloneBitsValue(128, [8]) == 1', () => { 
      expect(getStandAloneBitsValue(128, [8]))
        .to
        .equal(1); 
    });
    it('getStandAloneBitsValue(128, [8,7,6,5]) == 32', () => { 
      expect(getStandAloneBitsValue(128, [8,7,6,5]))
        .to
        .equal(8); 
    });
  }
);