import { expect } from 'chai';
import 'mocha';
import { parseDER, pemToDER } from '../asn1der';

const refPEM = `-----BEGIN CERTIFICATE-----
MIICEjCCAXsCAg36MA0GCSqGSIb3DQEBBQUAMIGbMQswCQYDVQQGEwJKUDEOMAwG
A1UECBMFVG9reW8xEDAOBgNVBAcTB0NodW8ta3UxETAPBgNVBAoTCEZyYW5rNERE
MRgwFgYDVQQLEw9XZWJDZXJ0IFN1cHBvcnQxGDAWBgNVBAMTD0ZyYW5rNEREIFdl
YiBDQTEjMCEGCSqGSIb3DQEJARYUc3VwcG9ydEBmcmFuazRkZC5jb20wHhcNMTIw
ODIyMDUyNjU0WhcNMTcwODIxMDUyNjU0WjBKMQswCQYDVQQGEwJKUDEOMAwGA1UE
CAwFVG9reW8xETAPBgNVBAoMCEZyYW5rNEREMRgwFgYDVQQDDA93d3cuZXhhbXBs
ZS5jb20wXDANBgkqhkiG9w0BAQEFAANLADBIAkEAm/xmkHmEQrurE/0re/jeFRLl
8ZPjBop7uLHhnia7lQG/5zDtZIUC3RVpqDSwBuw/NTweGyuP+o8AG98HxqxTBwID
AQABMA0GCSqGSIb3DQEBBQUAA4GBABS2TLuBeTPmcaTaUW/LCB2NYOy8GMdzR1mx
8iBIu2H6/E2tiY3RIevV2OW61qY2/XRQg7YPxx3ffeUugX9F4J/iPnnu1zAxxyBy
2VguKv4SWjRFoRkIfIlHX0qVviMhSlNy2ioFLy7JcPZb+v3ftDGywUqcBiVDoea0
Hn+GmxZA
-----END CERTIFICATE-----`;

describe('asn1der', 
  () => { 
    
    it('basic parsing of a valid X.509 cert should succeed, returning a single node', () => { 

        const parsedNodes = parseDER(pemToDER(refPEM));
        const node = parsedNodes[0];

        //console.log(node.toString());
        node.summary().forEach(it => console.log(it));

        expect(parsedNodes.length)
            .to
            .equal(1); 
    }); 

    // it('it should be able to instruct a node to parse its content', () => { 

    //     const parsedNodes = parseDER(Buffer.from(referenceX509Hex, 'hex'));
    //     const root = parsedNodes[0];

    //     // softwareEnforced - AttestationApplicationId
    //     root.get('6.#709.0').parseContent();

    //     root.summary().forEach(it => console.log(it));

    //     expect(1)
    //         .to
    //         .equal(1); 
    // }); 

});