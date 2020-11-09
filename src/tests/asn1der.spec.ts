import { expect } from 'chai';
import 'mocha';
import { parseDER } from '../asn1der';

const referenceX509Hex = "3081f10201020a01010201030a01010408dd4490c65d7f3b3504003056bf853d080206017596adf018bf85454604443042311c301a04157a612e636f2e696e6472616a616c612e666c756964020101312204207b6d3688d13ef0b621464e05dc712a4c62e34707388a52aeb61c35238da94f14307fa1083106020102020103a203020101a30402020800a5053103020106a6053103020103bf8148050203010001bf8377020500bf853e03020100bf853f020500bf85402a30280420dfc2920c81e136fdd2a510478fda137b262dc51d449edd7d0bdb554745725cfe0101ff0a0100bf85410502030186a0bf8542050203031519";

const referenceX509Parsed = {

};

describe('basic parsing of a valid X.509 cert should succeed, returning a single node', 
  () => { 
    it('should return true', () => { 

      const parsedNodes = parseDER(Buffer.from(referenceX509Hex, 'hex'));
      const node = parsedNodes[0];

      //console.log(node.toString());
      node.summary().forEach(it => console.log(it));

      expect(parsedNodes.length)
        .to
        .equal(1); 
  }); 
});