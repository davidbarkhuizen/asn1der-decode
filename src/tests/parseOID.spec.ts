import { expect } from 'chai';
import { parseOID } from "../asn1der";

const oid1 = "2a864886f70d010105";

describe('parseOID', 
  () => { 
    
        it('should parse a valid OID', () => { 
            expect(parseOID(Buffer.from(oid1, 'hex')))
                .to
                .equal('1.2.840.113549.1.1.5'); 
        }); 
    }
);