import { certs, csrs, privateKeys } from './data/x509FM4DD';
import { expect } from 'chai';
import 'mocha';
import { pemToDER } from '../asn1der';

describe('pemToDER', 
  () => { 

    it('it should be able to parse ascii armour of certs', async () => { 

        const parsedCount = certs
            .map(cert => {
                try {
                    pemToDER(cert);
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

    it('it should be able to parse ascii armour of csrs', async () => { 

        const parsedCount = csrs
            .map(csr => {
                try {
                    pemToDER(csr);
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

    it('it should be able to parse ascii armour of private keys', async () => { 

        const parsedCount = privateKeys
            .map(pvtKey => {
                try {
                    pemToDER(pvtKey);
                    return true;
                } catch (e) {
                    return false;
                }
            })
            .filter(parsed => parsed)
            .length;

        expect(privateKeys.length)
            .to
            .equal(parsedCount); 
    });
  }
);