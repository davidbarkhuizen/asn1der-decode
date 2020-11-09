import { expect } from 'chai';
import 'mocha';
import { bitsAreSet  } from '../bitwise';

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