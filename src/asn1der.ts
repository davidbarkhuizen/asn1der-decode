
const one = Buffer.from('01', 'hex').readUInt8(0);

export const mask = (bits: Array<number>): Number => {

    let byteMask = Buffer.from('00', 'hex').readUInt8(0);

    bits.forEach(bitNumber => {
        const bitMask = one << bitNumber - 1;
        byteMask = byteMask || bitMask;
    })
    
    return byteMask
}


export const parse = (
    derHex: string
): any => {

    const raw = Buffer.from(derHex, 'hex');
    console.log(`raw: ${raw.toString('hex')}`);

    const b0 = raw.readUInt8(0);


    

    return {};
};