import { exit } from "process";
import { bitsAreSet, getStandAloneBitsValue } from "./bitwise";

const Asn1Class = Object.freeze({
    Universal: 0,
    Application: 1,
    ContextSpecific: 2,
    Private: 3
});

const asn1ClassDescription = new Map<number, string>([
    [Asn1Class.Universal, 'Universal'],
    [Asn1Class.Application, 'Application'],
    [Asn1Class.ContextSpecific, 'ContextSpecific'],
    [Asn1Class.Private, 'Private'],
]);

const Asn1Construction = Object.freeze({
    Primitive: 0,
    Constructed: 1,
});

const asn1ConstructionDescription = new Map<number, string>([
    [Asn1Construction.Primitive, 'Primitive'],
    [Asn1Construction.Constructed, 'Constructed'],
]);

const Asn1Tag = Object.freeze({
    EndOfContent: 0,
    Boolean: 1,
    Integer: 2,
    BitString: 3,
    OctetString: 4,
    Null: 5,
    ObjectIdentifier: 6,
    ObjectDescriptor: 7,
    External: 8,
    RealFloat: 9,
    Enumerated: 10,
    EmbeddedPDV: 11,
    UTF8String: 12,
    RelativeOID: 13,
    Time: 14,
    Reserved: 15,
    Sequence: 16,
    Set: 17,
    NumericString: 18,
    PrintableString: 19,
    T61String: 20,
    VideoTexString: 21,
    IA5String: 22,
    UTCTime: 23,
    GeneralizedTime: 24,
    GraphicString: 25,
    VisibleString: 26,
    GeneralString: 27,
    UniversalString: 28,
    CharacterString: 29,
    BMPString: 30,
    Date: 31,
    TimeOfDay: 32,
    DateTime: 33,
    Duration: 34,
    OID_IRI: 35,
    Relative_OID_IRI: 36
});

const asn1TagDescription = new Map<number, string>([
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
    [Asn1Tag.Sequence, 'SEQUENCE and SEQUENCE OF'],
    [Asn1Tag.Set, 'SET and SET OF'],
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

export const parseDER = (
    der: Buffer
): any => {

    console.log(`raw: ${der.toString('hex')}`);

    const b0 = der.readUInt8(0);
    console.log(`b0: ${b0.toString()}d 0x${b0.toString(16)} ${b0.toString(2).padStart(8, '0')}b`)

    const klass = getStandAloneBitsValue(b0, [7,8]);
    const classDescription = asn1ClassDescription.get(klass);
    console.log(`class ${classDescription}`);

    const construction = getStandAloneBitsValue(b0, [6]);
    const constructionDescription = asn1ConstructionDescription.get(construction);
    console.log(`construction ${constructionDescription}`);

    const initialOctetTagNumber = getStandAloneBitsValue(b0, [1,2,3,4,5]);
    const initialOctetTagDescription = asn1TagDescription.get(initialOctetTagNumber);
    console.log(`initial tag: ${initialOctetTagNumber} => ${initialOctetTagDescription}`);

    let remainder = der.subarray(1);

    const isLongFormTag = initialOctetTagNumber == 31;

    // long-form tag
    //
    let longFormTagNumber: number = 0;
    if (isLongFormTag) {

        let tagByteCount = 1
        while (bitsAreSet(remainder.readUInt8(tagByteCount - 1), [8])) {
            tagByteCount = tagByteCount + 1;

            if (tagByteCount > remainder.length) {
                throw 'badly encoded long-form tag, infinite subsequent tag bytes'
            }
        }

        console.log(`tag byte count: ${tagByteCount}`);

        const tagBytes = remainder.subarray(0, tagByteCount);
        console.log(`tagBytes.length: ${tagBytes.length}`);

        remainder = remainder.subarray(tagByteCount);

        // console.log('binary', [...tagBytes].map(it => it.toString(2).padStart(8, '0')).join());
        // console.log('hex', tagBytes.toString('hex'));

        const sevenBitStrings = [...tagBytes]
            .map(it => it.toString(2))
            .map(it => it.padStart(8, '0'))
            .map(it => it.substring(1));

        console.log(`sevenBitStrings: ${sevenBitStrings}`);

        const joined = sevenBitStrings.join('');
        console.log(`joined: ${joined}`);

        const padded = joined.padStart(joined.length + ( 8 - (joined.length % 8)), '0');
        console.log(`padded: ${padded}`);

        longFormTagNumber = parseInt(padded, 2);

        console.log(`long-form tag number: ${longFormTagNumber}`);
    }

    const tagNumber = (isLongFormTag)
        ? longFormTagNumber
        : initialOctetTagNumber;

    const tagDescription = (asn1TagDescription.has(tagNumber))
        ? asn1TagDescription.get(tagNumber)
        : '?';
    
    console.log(`final tag number: ${tagNumber} => ${tagDescription}`);

    // parse length

    const firstLengthByte = remainder.readUInt8(0);
    remainder = remainder.subarray(1)

    const isLongFormLength =  bitsAreSet(firstLengthByte, [8]);
    console.log(isLongFormLength ? 'long form length' : 'short form length');

    let longFormLength: number = 0
    if (isLongFormLength) {

        const numberOfSubsequentLengthBytes = getStandAloneBitsValue(firstLengthByte, [1,2,3,4,5,6,7]);
        console.log(`content length is coded on ${numberOfSubsequentLengthBytes} subsequent bytes`)

        const lengthBytes = remainder.subarray(0, numberOfSubsequentLengthBytes);
        remainder = remainder.subarray(numberOfSubsequentLengthBytes);

        longFormLength = parseInt(lengthBytes.toString('hex'), 16);
        console.log(`long form length: ${longFormLength}`);
    }

    const length = (isLongFormLength)
        ? longFormLength
        : firstLengthByte;

    console.log(`length ${length}`);

    console.log(`class: ${classDescription
    }, construction: ${constructionDescription
    }, tag number: ${tagNumber
    }, tag: ${tagDescription}`);

    const content = remainder.subarray(0, length);
    remainder = remainder.subarray(length);

    console.log(`content: ${content.toString('hex')}`);
    
    if (construction == Asn1Construction.Constructed) {
        console.log('parsing children of constructed element');
        console.log('='.repeat(80));
        parseDER(content);
    } else {
        if (tagNumber == Asn1Tag.ObjectIdentifier) {
            //parseOID(contentHex.hexToUBytes())
        }
    }

    if (remainder.length > 0) {
        console.log('parsing next item in current constructed element');
        console.log('-'.repeat(80));
        parseDER(remainder);
    }

    return {};
};