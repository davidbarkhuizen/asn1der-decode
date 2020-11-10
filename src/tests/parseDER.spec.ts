import { expect } from 'chai';
import 'mocha';
import { parseDER, pemToDER } from '../asn1der';
// import { authorizationListLookup } from '../model/google';
import { rsaTEE } from './data/pem/google';

describe('parseDER', 
  () => { 
    
    it('basic parsing of a valid X.509 cert should succeed, returning a single node', () => { 

        expect(parseDER(pemToDER(rsaTEE[3])).length)
            .to
            .equal(1); 
    }); 

    it('reparsing of an octet string node which is valid DER should increase its child count', () => { 

        const node = parseDER(pemToDER(rsaTEE[0]))[0];

        const extNode = node.get('0.7.0.1.1');

        // SW enforced
        const childCountBefore = extNode.children.length;
        extNode.reparse();
        const childCountAfter = extNode.children.length;

        //node.summary(4, authorizationListLookup()).forEach(it => console.log(it));

        const childCountIncreased = childCountAfter > childCountBefore;

        expect(childCountIncreased)
            .to
            .equal(true); 
    });
});