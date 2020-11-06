import { bitMask, bitsAreSet, getStandAloneBitsValue } from './bitwise';
import { expect } from 'chai';
import 'mocha';
import { parseDER } from './asn1der';

const referenceX509Hex: string = "3081f10201020a01010201030a01010408dd4490c65d7f3b3504003056bf853d080206017596adf018bf85454604443042311c301a04157a612e636f2e696e6472616a616c612e666c756964020101312204207b6d3688d13ef0b621464e05dc712a4c62e34707388a52aeb61c35238da94f14307fa1083106020102020103a203020101a30402020800a5053103020106a6053103020103bf8148050203010001bf8377020500bf853e03020100bf853f020500bf85402a30280420dfc2920c81e136fdd2a510478fda137b262dc51d449edd7d0bdb554745725cfe0101ff0a0100bf85410502030186a0bf8542050203031519";

const referenceX509Parsed = {

};

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

describe('parse x509 google HW key attestation leaf cert', 
  () => { 
    it('should return true', () => { 
      expect(JSON.stringify(parseDER(referenceX509Hex)))
        .to
        .equal(JSON.stringify(referenceX509Parsed)); 
  }); 
});