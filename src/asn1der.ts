import { bitsAreSet, getStandAloneBitsValue } from "./bitwise";
import { Asn1Node } from "./model/Asn1Node";
import { Asn1Construction } from "./model/enums";
import { IAsn1Identifier } from "./model/interfaces";

const parseIdentifer = (raw: Buffer): {
    identifier: IAsn1Identifier,
    lengthValueRemainder: Buffer
} => {

    const b0 = raw.readUInt8(0);
    //console.log(`b0: ${b0.toString()}d 0x${b0.toString(16)} ${b0.toString(2).padStart(8, '0')}b`);

    const klass = getStandAloneBitsValue(b0, [7,8]);
    const construction = getStandAloneBitsValue(b0, [6]);
    const initialOctetTagNumber = getStandAloneBitsValue(b0, [1,2,3,4,5]);

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

        // TODO common with parseOID ?

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
    
    //console.log(`final tag number: ${tagNumber} => ${tagDescription}`);

    return {
        identifier:{
            raw: Buffer.from([b0]),
            class: klass,
            construction,
            tagNumber,
        },
        lengthValueRemainder: remainder
    };
};

const parseLength = (
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

export const pemToDER = (pem: string): Buffer => {
    
    const b64 = pem
        .replace('-----BEGIN CERTIFICATE-----', '')
        .replace('-----END CERTIFICATE-----', '')
        .replace('\n', '');
    
    return Buffer.from(b64, 'base64');
};

export const parseOID = (b: Buffer): string => {

   const firstByte = b.readInt8(0);

   const firstNodeValue = Math.floor(firstByte / 40);
   const secondNodeValue = firstByte - (firstNodeValue * 40);

   const nodes = [firstNodeValue, secondNodeValue];

   let remainder = b.subarray(1);

    while (remainder.length > 0) {

        const isLongForm = bitsAreSet(remainder.readUInt8(0), [8]);

        if (!isLongForm) {
            nodes.push(remainder.readUInt8(0));
            remainder = remainder.subarray(1);
        } else {

            const head = [];
            while (bitsAreSet(remainder.readUInt8(0), [8])) {
                head.push(remainder.readUInt8(0));
                remainder = remainder.subarray(1);
            }
            
            head.push(remainder.readUInt8(0));
            remainder = remainder.subarray(1);

            const sevenBitStrings = [...head]
                .map(it => it.toString(2))
                .map(it => it.padStart(8, '0'))
                .map(it => it.substring(1));

        //console.log(`sevenBitStrings: ${sevenBitStrings}`);

        const joined = sevenBitStrings.join('');
        //console.log(`joined: ${joined}`);

        const padded = joined.padStart(joined.length + ( 8 - (joined.length % 8)), '0');
        //console.log(`padded: ${padded}`);

        const longFormOID = parseInt(padded, 2);

        nodes.push(longFormOID);
        }
    }

    return nodes.join('.');
};

export const parseDER = (
    der: Buffer
): Array<Asn1Node> => {

    // console.log(der.toString('hex').substring(0, 20), "...");

    const { identifier, lengthValueRemainder } = parseIdentifer(der);

    // console.log(`${'  '.repeat(indent)} ${identifier.classDescription
    // } ${identifier.constructionDescription
    // } #${identifier.tagNumber
    // } (${identifier.tagDescription})`);

    // const tagDescription = asn1TagDescription.has(identifier.tagNumber)
    //     ? asn1TagDescription.get(identifier.tagNumber)
    //     : null;

    // const label = (tagDescription != null)
    //     ? tagDescription
    //     : `${identifier.tagNumber}`;

    // parse length

    const { length, contentRemainder } = parseLength(lengthValueRemainder);

    const content = contentRemainder.subarray(0, length);
    const residualRemainder = contentRemainder.subarray(length);

    // console.log(`${'  '.repeat(indent)}[${label}]  ${content.toString('hex').substring(0, 60)}`);

    // console.log(`content: ${content.toString('hex')}`);
    
    const children = (identifier.construction == Asn1Construction.Constructed)
        ? parseDER(content)
        : [];

    const peers = (residualRemainder.length > 0)
        ? parseDER(residualRemainder)
        : [];

    const self = new Asn1Node(
        der,
        identifier,
        length,
        content,
        children,
    );

    return [
        self,
        ...peers
    ];
};