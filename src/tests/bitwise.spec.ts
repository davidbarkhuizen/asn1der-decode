import { expect } from 'chai';
import 'mocha';
import { bitMask, bitsAreSet, getStandAloneBitsValue } from '../bitwise';

describe('bitMask', 
  () => { 

    it('mask([1]) == 1', () => { 
      expect(bitMask([1]))
        .to
        .equal(1); 
    }); 

    it('mask([2]) == 2', () => { 
      expect(bitMask([2]))
        .to
        .equal(2); 
    }); 

    it('mask([1,2]) == 3', () => { 
      expect(bitMask([1,2]))
        .to
        .equal(3); 
    }); 

    it('mask([3]) == 4', () => { 
      expect(bitMask([3]))
        .to
        .equal(4); 
    }); 

    it('mask([4]) == 8', () => { 
      expect(bitMask([4]))
        .to
        .equal(8); 
    }); 

    it('mask([5]) == 16', () => { 
      expect(bitMask([5]))
        .to
        .equal(16); 
    }); 

    it('mask([6]) == 32', () => { 
      expect(bitMask([6]))
        .to
        .equal(32); 
    }); 

    it('mask([7]) == 64', () => { 
      expect(bitMask([7]))
        .to
        .equal(64); 
    }); 

    it('mask([8]) == 128', () => { 
      expect(bitMask([8]))
        .to
        .equal(128); 
    });
    it('mask([1,8]) == 129', () => { 
      expect(bitMask([1,8]))
        .to
        .equal(129); 
    });
  }
);


describe('bitsAreSet', 
  () => { 
    it('bitsAreSet(1, [1]) == true', () => { 
      expect(bitsAreSet(1, [1]))
        .to
        .equal(true); 
    }); 
    it('bitsAreSet(1, [2]) == false', () => { 
      expect(bitsAreSet(1, [2]))
        .to
        .equal(false); 
    }); 
    it('bitsAreSet(1, [1,2]) == false', () => { 
      expect(bitsAreSet(1, [1,2]))
        .to
        .equal(false); 
    }); 
    it('bitsAreSet(3, [1,2]) == true', () => { 
      expect(bitsAreSet(3, [1,2]))
        .to
        .equal(true); 
    }); 
  }
);

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