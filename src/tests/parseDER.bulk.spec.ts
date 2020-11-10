import { expect } from 'chai';
import 'mocha';
import { parseDER, pemToDER } from '../asn1der';
import { certs, csrs, privateKeys } from './data/x509FM4DD';

describe('parseDER - FM4DD certs', 
  async () => { 

    it('it should be able to parse a range of certs', async () => { 

        const parsedCount = certs
            .map(cert => {
                try {
                    parseDER(pemToDER(cert));
                    return true;
                } catch (e) {
                    return false;
                }
            })
            .filter(parsed => parsed)
            .length;

        expect(certs.length)
            .to
            .equal(parsedCount); 
    }); 

    it('it should be able to parse a range of csrs', async () => { 

        const parsedCount = csrs
            .map(csr => {
                try {
                    parseDER(pemToDER(csr));
                    return true;
                } catch (e) {
                    return false;
                }
            })
            .filter(parsed => parsed)
            .length;

        expect(csrs.length)
            .to
            .equal(parsedCount); 
    }); 
});