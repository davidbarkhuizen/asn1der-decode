import { expect } from 'chai';
import { parseDER, pemToDER } from '../asn1der';
import { authorizationListLookup } from '../model/google';
import { rsaTEE } from './data/pem/google';

describe('play', 
  () => { 
    
        it('should work', () => { 
            
            const root = parseDER(pemToDER(rsaTEE[0]))[0];

            root
                .summary(4, authorizationListLookup())
                .forEach(line => console.log(line));
            
            expect(true)
                .to
                .equal(true); 
        }); 
    }
);