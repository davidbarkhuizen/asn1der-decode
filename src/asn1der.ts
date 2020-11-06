
const one = Buffer.from('01', 'hex').readUInt8(0);

export const bitMask = (bits: Array<number>): Number => {

    let byteMask = Buffer.from('00', 'hex').readUInt8(0);

    for (const bitNumber of bits) {
        console.log(`bitNumber ${bitNumber}`);
        const bitMask = one << (bitNumber - 1);
        console.log(`bitMask ${bitMask}`);
        byteMask = byteMask | bitMask;
    }

    console.log(`final mask: ${byteMask}`);
   
    return byteMask;
};

export const parse = (
    derHex: string
): any => {

    const raw = Buffer.from(derHex, 'hex');
    console.log(`raw: ${raw.toString('hex')}`);

    const b0 = raw.readUInt8(0);

    return {};
};

bitMask([1,2]);