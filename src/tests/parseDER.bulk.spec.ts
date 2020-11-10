import { expect } from 'chai';
import 'mocha';
import { parseDER, pemToDER } from '../asn1der';
import { ecStrongBox, ecTEE, rsaStrongBox, rsaTEE } from './data/pem/google';
import { certs, csrs } from './data/pem/x509FM4DD';

describe('parseDER - FM4DD certs', 
  async () => { 

    it('it should be able to parse the FM4DD sample certs', async () => { 

        const parsedCount = certs
            .map(cert => {                
                try {
                    return (parseDER(pemToDER(cert)).length == 1);
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

    it('it should be able to parse the FM4DD sample csrs', async () => { 

        const parsedCount = csrs
            .map(csr => {
                try {
                    return (parseDER(pemToDER(csr)).length == 1);
                } catch (e) {
                    console.error(e);
                    return false;
                }
            })
            .filter(parsed => parsed)
            .length;

        expect(csrs.length)
            .to
            .equal(parsedCount); 
    }); 

    it('it should be able to parse the google HW attestation RSA TEE cert chain certs', async () => { 

        const source = rsaTEE;

        const parsedCount = source
            .map(cert => {
                try {
                    return (parseDER(pemToDER(cert)).length == 1);
                } catch (e) {
                    console.error(e);
                    return false;
                }
            })
            .filter(parsed => parsed)
            .length;

        expect(source.length)
            .to
            .equal(parsedCount); 
    }); 

    it('it should be able to parse the google HW attestation EC TEE cert chain certs', async () => { 

        const source = ecTEE;

        const parsedCount = source
            .map(cert => {
                try {
                    return (parseDER(pemToDER(cert)).length == 1);
                } catch (e) {
                    console.error(e);
                    return false;
                }
            })
            .filter(parsed => parsed)
            .length;

        expect(source.length)
            .to
            .equal(parsedCount); 
    }); 

    it('it should be able to parse the google HW attestation RSA StrongBox cert chain certs', async () => { 

        const source = rsaStrongBox;

        const parsedCount = source
            .map(cert => {
                try {
                    return (parseDER(pemToDER(cert)).length == 1);
                } catch (e) {
                    console.error(e);
                    return false;
                }
            })
            .filter(parsed => parsed)
            .length;

        expect(source.length)
            .to
            .equal(parsedCount); 
    }); 

    it('it should be able to parse the google HW attestation EC StrongBox cert chain certs', async () => { 

        const source = ecStrongBox;

        const parsedCount = source
            .map(cert => {
                try {
                    return (parseDER(pemToDER(cert)).length == 1);
                } catch (e) {
                    console.error(e);
                    return false;
                }
            })
            .filter(parsed => parsed)
            .length;

        expect(source.length)
            .to
            .equal(parsedCount); 
    }); 
});