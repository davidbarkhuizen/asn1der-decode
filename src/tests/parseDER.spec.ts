import { expect } from 'chai';
import 'mocha';
import { parseDER, pemToDER } from '../asn1der';
import { authorizationListLookup } from '../model/google';

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

const rsaTeePem3 = `-----BEGIN CERTIFICATE-----
MIIFYDCCA0igAwIBAgIJAOj6GWMU0voYMA0GCSqGSIb3DQEBCwUAMBsxGTAXBgNVBAUTEGY5MjAw
OWU4NTNiNmIwNDUwHhcNMTYwNTI2MTYyODUyWhcNMjYwNTI0MTYyODUyWjAbMRkwFwYDVQQFExBm
OTIwMDllODUzYjZiMDQ1MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAr7bHgiuxpwHs
K7Qui8xUFmOr75gvMsd/dTEDDJdSSxtf6An7xyqpRR90PL2abxM1dEqlXnf2tqw1Ne4Xwl5jlRfd
nJLmN0pTy/4lj4/7tv0Sk3iiKkypnEUtR6WfMgH0QZfKHM1+di+y9TFRtv6y//0rb+T+W8a9nsNL
/ggjnar86461qO0rOs2cXjp3kOG1FEJ5MVmFmBGtnrKpa73XpXyTqRxB/M0n1n/W9nGqC4FSYa04
T6N5RIZGBN2z2MT5IKGbFlbC8UrW0DxW7AYImQQcHtGl/m00QLVWutHQoVJYnFPlXTcHYvASLu+R
hhsbDmxMgJJ0mcDpvsC4PjvB+TxywElgS70vE0XmLD+OJtvsBslHZvPBKCOdT0MS+tgSOIfga+z1
Z1g7+DVagf7quvmag8jfPioyKvxnK/EgsTUVi2ghzq8wm27ud/mIM7AY2qEORR8Go3TVB4HzWQgp
Zrt3i5MIlCaY504LzSRiigHCzAPlHws+W0rB5N+er5/2pJKnfBSDiCiFAVtCLOZ7gLiMm0jhO2B6
tUXHI/+MRPjy02i59lINMRRev56GKtcd9qO/0kUJWdZTdA2XoS82ixPvZtXQpUpuL12ab+9EaDK8
Z4RHJYYfCT3Q5vNAXaiWQ+8PTWm2QgBR/bkwSWc+NpUFgNPN9PvQi8WEg5UmAGMCAwEAAaOBpjCB
ozAdBgNVHQ4EFgQUNmHhAHyIBQlRi0RsR/8aTMnqTxIwHwYDVR0jBBgwFoAUNmHhAHyIBQlRi0Rs
R/8aTMnqTxIwDwYDVR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8EBAMCAYYwQAYDVR0fBDkwNzA1oDOg
MYYvaHR0cHM6Ly9hbmRyb2lkLmdvb2dsZWFwaXMuY29tL2F0dGVzdGF0aW9uL2NybC8wDQYJKoZI
hvcNAQELBQADggIBACDIw41L3KlXG0aMiS//cqrG+EShHUGo8HNsw30W1kJtjn6UBwRM6jnmiwfB
Pb8VA91chb2vssAtX2zbTvqBJ9+LBPGCdw/E53Rbf86qhxKaiAHOjpvAy5Y3m00mqC0w/Zwvju1t
wb4vhLaJ5NkUJYsUS7rmJKHHBnETLi8GFqiEsqTWpG/6ibYCv7rYDBJDcR9W62BW9jfIoBQcxUCU
JouMPH25lLNcDc1ssqvC2v7iUgI9LeoM1sNovqPmQUiG9rHli1vXxzCyaMTjwftkJLkf6724DFhu
Kug2jITV0QkXvaJWF4nUaHOTNA4uJU9WDvZLI1j83A+/xnAJUucIv/zGJ1AMH2boHqF8CY16LpsY
gBt6tKxxWH00XcyDCdW2KlBCeqbQPcsFmWyWugxdcekhYsAWyoSf818NUsZdBWBaR/OukXrNLfkQ
79IyZohZbvabO/X+MVT3rriAoKc8oE2Uws6DF+60PV7/WIPjNvXySdqspImSN78mflxDqwLqRBYk
A3I75qppLGG9rp7UCdRjxMl8ZDBld+7yvHVgt1cVzJx9xnyGCC23UaicMDSXYrB4I4WHXPGjxhZu
CuPBLTdOLU8YRvMYdEvYebWHMpvwGCF6bAx3JBpIeOQ1wDB5y0USicV3YgYGmi+NZfhA4URSh77Y
d6uuJOJENRaNVTzk
-----END CERTIFICATE-----`;

const rsaTeePem0 = `-----BEGIN CERTIFICATE-----
MIIGCDCCBHCgAwIBAgIBATANBgkqhkiG9w0BAQsFADApMRkwFwYDVQQFExAyZGM1OGIyZDFhMjQx
MzI2MQwwCgYDVQQMDANURUUwIBcNNzAwMTAxMDAwMDAwWhgPMjEwNjAyMDcwNjI4MTVaMB8xHTAb
BgNVBAMMFEFuZHJvaWQgS2V5c3RvcmUgS2V5MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKC
AQEApNVcnyN40MANMbbo2nMGNq2NNysDSjfLm0W3i6wPKf0ffCYkhWM4dCmQKKf50uAZTBeTit4c
NwXeZn3qellMlOsIN3Qc384rfN/8cikrRvUAgibz0Jy7STykjwa7x6tKwqITxbO8HqAhKo8/BQXU
xzrOdIg5ciy+UM7Vgh7a7ogen0KL2iGgrsalb1ti7Vlzb6vIJ4WzIC3TGD2sCkoPahghwqFDZZCo
/FzaLoNY0jAUX2mL+kf8aUaoxz7xA9FTvgara+1pLBR1s4c8xPS2HdZipcVXWfey0wujv1VAKs4+
tXjKlHkYBHBBceEjxUtEmrapSQEdpHPv7Xh9Uanq4QIDAQABo4ICwTCCAr0wDgYDVR0PAQH/BAQD
AgeAMIICqQYKKwYBBAHWeQIBEQSCApkwggKVAgEDCgEBAgEECgEBBANhYmMEADCCAc2/hT0IAgYB
ZOYGEYe/hUWCAbsEggG3MIIBszGCAYswDAQHYW5kcm9pZAIBHTAZBBRjb20uYW5kcm9pZC5rZXlj
aGFpbgIBHTAZBBRjb20uYW5kcm9pZC5zZXR0aW5ncwIBHTAZBBRjb20ucXRpLmRpYWdzZXJ2aWNl
cwIBHTAaBBVjb20uYW5kcm9pZC5keW5zeXN0ZW0CAR0wHQQYY29tLmFuZHJvaWQuaW5wdXRkZXZp
Y2VzAgEdMB8EGmNvbS5hbmRyb2lkLmxvY2FsdHJhbnNwb3J0AgEdMB8EGmNvbS5hbmRyb2lkLmxv
Y2F0aW9uLmZ1c2VkAgEdMB8EGmNvbS5hbmRyb2lkLnNlcnZlci50ZWxlY29tAgEdMCAEG2NvbS5h
bmRyb2lkLndhbGxwYXBlcmJhY2t1cAIBHTAhBBxjb20uZ29vZ2xlLlNTUmVzdGFydERldGVjdG9y
AgEdMCIEHWNvbS5nb29nbGUuYW5kcm9pZC5oaWRkZW5tZW51AgEBMCMEHmNvbS5hbmRyb2lkLnBy
b3ZpZGVycy5zZXR0aW5ncwIBHTEiBCAwGqPLCBE0UBxF8UIqvGbCQiT9Xe1f3I8X5pcXb9hmqjCB
rqEIMQYCAQICAQOiAwIBAaMEAgIIAKUFMQMCAQSmCDEGAgEDAgEFv4FIBQIDAQABv4N3AgUAv4U+
AwIBAL+FQEwwSgQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQAKAQIEIHKNsSdP
HxzxVx3kOAsEilVKxKOA529TVQg1KQhKk3gBv4VBAwIBAL+FQgUCAwMUs7+FTgUCAwMUs7+FTwUC
AwMUszANBgkqhkiG9w0BAQsFAAOCAYEAJMIuzdNUdfrE6sIdmsnMn/scSG2odbphj8FkX9JGdF2S
OT599HuDY9qhvkru2Dza4sLKK3f4ViBhuR9lpfeprKvstxbtBO7jkLYfVn0ZRzHRHVEyiW5IVKh+
qOXVJ9S1lMShOTlsaYJytLKIlcrRAZBEXZiNbzTuVh1CH6X9Ni1dog14snm+lcOeORdL9fht2CHa
u/caRnpWiZbjoAoJp0O89uBrRkXPpln51+3jPY6AFny30grNAvKguauDcPPhNV1yR+ylSsQi2gm3
Rs4pgtlxFLMfZLgT0cbkl+9zk/QUqlpBP8ftUBsOI0ARr8xhFN3cvq9kXGLtJ9hEP9PRaflAFREk
DK3IBIbVcAFZBFoAQOdE9zy0+F5bQrznPGaZg4Dzhcx33qMDUTgHtWoy+k3ePGQMEtmoTTLgQywW
OIkXEoFqqGi9GKJXUT1KYi5NsigaYqu7FoN4Qsvs61pMUEfZSPP2AFwkA8uNFbmb9uxcxaGHCA8i
3i9VM6yOLIrP
-----END CERTIFICATE-----`;

describe('parseDER', 
  () => { 
    
    it('basic parsing of a valid X.509 cert should succeed, returning a single node', () => { 

        const parsedNodes = parseDER(pemToDER(refPEM));
        const node = parsedNodes[0];

        //console.log(node.toString());
        // node.summary(4, null).forEach(it => console.log(it));

        expect(parsedNodes.length)
            .to
            .equal(1); 
    }); 

    it('basic parsing of a valid X.509 cert should succeed, returning a single node', () => { 

        const parsedNodes = parseDER(pemToDER(rsaTeePem3));
        const node = parsedNodes[0];

        //console.log(node.toString());
        // node.summary(4, null).forEach(it => console.log(it));

        expect(parsedNodes.length)
            .to
            .equal(1); 
    }); 

    it('reparsing of octet string nodes which are valid ASN.1 DER structures should succeed', () => { 

        const parsedNodes = parseDER(pemToDER(rsaTeePem0));
        const node = parsedNodes[0];

        // SW enforced
        node.get('0.7.0.1.1').reparse();

        // TODO reparse extension for OID
        // node.get('1.3.6.1.4.1.11129.2.1.17'

        //console.log(node.toString());
        //node.summary(4, authorizationListLookup()).forEach(it => console.log(it));

        expect(parsedNodes.length)
            .to
            .equal(1); 
    });
});