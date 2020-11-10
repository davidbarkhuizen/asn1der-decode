export const x509ExtensionsOIDsSource = [
    ["2.5.29.1", "old Authority Key Identifier"],
    ["2.5.29.2", "old Primary Key Attributes"],
    ["2.5.29.3", "Certificate Policies"],
    ["2.5.29.4", "Primary Key Usage Restriction"],
    ["2.5.29.9", "Subject Directory Attributes"],
    ["2.5.29.14", "Subject Key Identifier"],
    ["2.5.29.15", "Key Usage"],
    ["2.5.29.16", "Private Key Usage Period"],
    ["2.5.29.17", "Subject Alternative Name"],
    ["2.5.29.18", "Issuer Alternative Name"],
    ["2.5.29.19", "Basic Constraints"],
    ["2.5.29.28", "Issuing Distribution Point"],
    ["2.5.29.29", "Certificate Issuer"],
    ["2.5.29.30", "Name Constraints"],
    ["2.5.29.31", "CRL Distribution Points"],
    ["2.5.29.32", "Certificate Policies"],
    ["2.5.29.33", "Policy Mappings"],
    ["2.5.29.35", "Authority Key Identifier"],
    ["2.5.29.36", "Policy Constraints"],
    ["2.5.29.37", "Extended key usage"],
    ["2.5.29.54", "X.509v3 cert ext Inhibit Any-policy"]
];

export const x509NonExtensionOIDsSource = [
    ['1.2.840.113549.1.1.1', 'RSA encryption'],
    ['1.2.840.113549.1.1.11', 'sha256WithRSAEncryption'],
    ['1.2.840.113549.1.1.5', 'SHA-1 with RSA Encryption'],
    ['1.2.840.113549.1.9.1', 'e-mailAddress'],

    ['1.3.6.1.4.1.11129.2.1.17', 'attestation'],

    ['2.5.4.3', 'id-at-commonName'],
    ['2.5.4.5', 'id-at-serialNumber'],
    ['2.5.4.6', 'id-at-countryName'],
    ['2.5.4.7', 'id-at-localityName'],
    ['2.5.4.8', 'id-at-stateOrProvinceName'],
    ['2.5.4.10', 'id-at-organizationName'],
    ['2.5.4.11', 'id-at-organizationalUnitName'],
    ['2.5.4.12', 'id-at-title'],
];

const aggregated = [];
aggregated.push(...x509ExtensionsOIDsSource);
aggregated.push(...x509NonExtensionOIDsSource);

export const x509OIDs = new Map<string, string>(aggregated);