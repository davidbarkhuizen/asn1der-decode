import { bitsAreSet, getStandAloneBitsValue } from "./bitwise";
import { Asn1Construction, Asn1Tag, IAsn1Identifier } from "./model";
import { asn1ClassShortDesc, asn1ConstructionShortDesc, asn1TagDescription } from "./model.description";

export const parseIdentifer = (raw: Buffer): {
    identifier: IAsn1Identifier,
    lengthValueRemainder: Buffer
} => {

    const b0 = raw.readUInt8(0);
    //console.log(`b0: ${b0.toString()}d 0x${b0.toString(16)} ${b0.toString(2).padStart(8, '0')}b`);

    const klass = getStandAloneBitsValue(b0, [7,8]);
    const classDescription = asn1ClassShortDesc.get(klass);
    //console.log(`class ${classDescription}`);

    const construction = getStandAloneBitsValue(b0, [6]);
    const constructionDescription = asn1ConstructionShortDesc.get(construction);
    //console.log(`construction ${constructionDescription}`);

    const initialOctetTagNumber = getStandAloneBitsValue(b0, [1,2,3,4,5]);
    //const initialOctetTagDescription = asn1TagDescription.get(initialOctetTagNumber);
    //console.log(`initial tag: ${initialOctetTagNumber} => ${initialOctetTagDescription}`);

    let remainder = raw.subarray(1);

    const isLongFormTag = initialOctetTagNumber == 31;

    // long-form tag
    //
    let longFormTagNumber = 0;
    if (isLongFormTag) {

        let tagByteCount = 1;
        while (bitsAreSet(remainder.readUInt8(tagByteCount - 1), [8])) {
            tagByteCount = tagByteCount + 1;

            if (tagByteCount > remainder.length) {
                throw 'badly encoded long-form tag, infinite subsequent tag bytes';
            }
        }

        //console.log(`tag byte count: ${tagByteCount}`);

        const tagBytes = remainder.subarray(0, tagByteCount);
        //console.log(`tagBytes.length: ${tagBytes.length}`);

        remainder = remainder.subarray(tagByteCount);

        const sevenBitStrings = [...tagBytes]
            .map(it => it.toString(2))
            .map(it => it.padStart(8, '0'))
            .map(it => it.substring(1));

        //console.log(`sevenBitStrings: ${sevenBitStrings}`);

        const joined = sevenBitStrings.join('');
        //console.log(`joined: ${joined}`);

        const padded = joined.padStart(joined.length + ( 8 - (joined.length % 8)), '0');
        //console.log(`padded: ${padded}`);

        longFormTagNumber = parseInt(padded, 2);

        //console.log(`long-form tag number: ${longFormTagNumber}`);
    }

    const tagNumber = (isLongFormTag)
        ? longFormTagNumber
        : initialOctetTagNumber;

    const tagDescription = (asn1TagDescription.has(tagNumber))
        ? asn1TagDescription.get(tagNumber)
        : '?';
    
    //console.log(`final tag number: ${tagNumber} => ${tagDescription}`);

    return {
        identifier:{
            raw: Buffer.from([b0]),
            class: klass,
            classDescription,
            construction,
            constructionDescription,
            tagNumber,
            tagDescription
        },
        lengthValueRemainder: remainder
    };
};

export const parseLength = (
    raw: Buffer
): {
    length: number,
    contentRemainder: Buffer
} => {
    const firstLengthByte = raw.readUInt8(0);
    let remainder = raw.subarray(1);

    const isLongFormLength =  bitsAreSet(firstLengthByte, [8]);
    //console.log(isLongFormLength ? 'long form length' : 'short form length');

    let longFormLength = 0;
    if (isLongFormLength) {

        const numberOfSubsequentLengthBytes = getStandAloneBitsValue(firstLengthByte, [1,2,3,4,5,6,7]);
        //console.log(`content length is coded on ${numberOfSubsequentLengthBytes} subsequent bytes`);

        const lengthBytes = remainder.subarray(0, numberOfSubsequentLengthBytes);
        remainder = remainder.subarray(numberOfSubsequentLengthBytes);

        longFormLength = parseInt(lengthBytes.toString('hex'), 16);
        //console.log(`long form length: ${longFormLength}`);
    }

    const length = (isLongFormLength)
        ? longFormLength
        : firstLengthByte;

    //console.log(`length ${length}`);

    return { length, contentRemainder: remainder };
};

export const parseDER = (
    der: Buffer,
    indent = 0
): Record<string, unknown> => {

    // console.log(der.toString('hex').substring(0, 20), "...");

    const { identifier, lengthValueRemainder } = parseIdentifer(der);

    console.log(`${'  '.repeat(indent)} ${identifier.classDescription
    } ${identifier.constructionDescription
    } #${identifier.tagNumber
    } (${identifier.tagDescription})`);

    // parse length

    const { length, contentRemainder } = parseLength(lengthValueRemainder);

    const content = contentRemainder.subarray(0, length);
    const residualRemainder = contentRemainder.subarray(length);

    // console.log(`content: ${content.toString('hex')}`);
    
    if (identifier.construction == Asn1Construction.Constructed) {
        // console.log('parsing children of constructed element');
        // console.log('='.repeat(80));
        parseDER(content, indent + 1);
    } else {
        if (identifier.tagNumber == Asn1Tag.ObjectIdentifier) {
            //parseOID(contentHex.hexToUBytes())
        }
    }

    if (residualRemainder.length > 0) {
        // console.log('parsing next item in current constructed element');
        // console.log('-'.repeat(80));
        parseDER(residualRemainder, indent);
    }

    return {};
};