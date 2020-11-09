import { Asn1Class, Asn1Construction, Asn1Tag } from "./enums";

export const asn1ClassDescription = new Map<Asn1Class, string>([
    [Asn1Class.Universal, 'Universal'],
    [Asn1Class.Application, 'Application'],
    [Asn1Class.ContextSpecific, 'ContextSpecific'],
    [Asn1Class.Private, 'Private'],
]);

export const asn1ClassShortDesc = new Map<Asn1Class, string>([
    [Asn1Class.Universal, 'U'],
    [Asn1Class.Application, 'A'],
    [Asn1Class.ContextSpecific, 'C'],
    [Asn1Class.Private, 'P'],
]);


export const asn1ConstructionDescription = new Map<Asn1Construction, string>([
    [Asn1Construction.Primitive, 'Primitive'],
    [Asn1Construction.Constructed, 'Constructed'],
]);

export const asn1ConstructionShortDesc = new Map<Asn1Construction, string>([
    [Asn1Construction.Primitive, 'P'],
    [Asn1Construction.Constructed, 'C'],
]);

export const asn1TagDescription = new Map<Asn1Tag, string>([
    [Asn1Tag.EndOfContent, 'End-of-Content (EOC)'],
    [Asn1Tag.Boolean, 'BOOLEAN'],
    [Asn1Tag.Integer, 'INTEGER'],
    [Asn1Tag.BitString, 'BIT STRING'],
    [Asn1Tag.OctetString, 'OCTET STRING'],
    [Asn1Tag.Null, 'NULL'],
    [Asn1Tag.ObjectIdentifier, 'OBJECT IDENTIFIER'],
    [Asn1Tag.ObjectDescriptor, 'Object Descriptor'],
    [Asn1Tag.External, 'EXTERNAL'],
    [Asn1Tag.RealFloat, 'REAL (float)'],
    [Asn1Tag.Enumerated, 'ENUMERATED'],
    [Asn1Tag.EmbeddedPDV, 'EMBEDDED PDV'],
    [Asn1Tag.UTF8String, 'UTF8String'],
    [Asn1Tag.RelativeOID, 'RELATIVE-OID'],
    [Asn1Tag.Time, 'TIME'],
    [Asn1Tag.Reserved, 'Reserved'],
    [Asn1Tag.Sequence, 'SEQUENCE | SEQUENCE OF'],
    [Asn1Tag.Set, 'SET | SET OF'],
    [Asn1Tag.NumericString, 'NumericString'],
    [Asn1Tag.PrintableString, 'PrintableString'],
    [Asn1Tag.T61String, 'T61String'],
    [Asn1Tag.VideoTexString, 'VideotexString'],
    [Asn1Tag.IA5String, 'IA5String'],
    [Asn1Tag.UTCTime, 'UTCTime'],
    [Asn1Tag.GeneralizedTime, 'GeneralizedTime'],
    [Asn1Tag.GraphicString, 'GraphicString'],
    [Asn1Tag.VisibleString, 'VisibleString'],
    [Asn1Tag.GeneralString, 'GeneralString'],
    [Asn1Tag.UniversalString, 'UniversalString'],
    [Asn1Tag.CharacterString, 'CHARACTER STRING'],
    [Asn1Tag.BMPString, 'BMPString'],
    [Asn1Tag.Date, 'DATE'],
    [Asn1Tag.TimeOfDay, 'TIME-OF-DAY'],
    [Asn1Tag.DateTime, 'DATE-TIME'],
    [Asn1Tag.Duration, 'DURATION'],
    [Asn1Tag.OID_IRI, 'OID-IRI'],
    [Asn1Tag.Relative_OID_IRI, 'RELATIVE-OID-IRI'],
]);