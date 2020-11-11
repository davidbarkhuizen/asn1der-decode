import { parseDER, parseOID } from "../asn1der";
import { asn1TagDescription } from "./descriptions";
import { Asn1Class, Asn1Tag } from "./enums";
import { IAsn1Identifier } from "./interfaces";

import { x509OIDs } from './oid';

// 'YYMMDD 000000 Z'
export const parseUtcString = (s: string): Date => {

    const yyyy = 2000 + parseInt(s.substring(0, 2));
    const mm = parseInt(s.substring(2, 4));
    const dd = parseInt(s.substring(4, 6));

    const hours = parseInt(s.substring(6, 8));
    const mins = parseInt(s.substring(8, 10));
    const seconds = parseInt(s.substring(10, 12));

    // console.log(`${yyyy}/${mm}/${dd} ${hours}:${mins}:${seconds}`);

    return new Date(Date.UTC(
        yyyy,
        mm - 1,
        dd,
        hours,
        mins,
        seconds
    ));
};

// YYYYMMDD000000Z
// YYYY MM DD 00 00 00 Z
// e.g.
// 19920521000000Z
// 19920622123421Z
// 19920722132100.3Z
//
export const parseGeneralizedTimeString = (s: string): Date => {

    const yyyy = parseInt(s.substring(0, 4));
    const mm = parseInt(s.substring(4, 6));
    const dd = parseInt(s.substring(6, 8));

    const hours = parseInt(s.substring(8, 10));
    const mins = parseInt(s.substring(10, 12));
    const seconds = parseInt(s.substring(12, 14));

    const hasFractionalSeconds = s[14] == '.';
    const ms = (hasFractionalSeconds)
        ? parseInt(s.substring(15, s.length - 1)) * 1000
        : 0;

    // console.log(`${yyyy}/${mm}/${dd} ${hours}:${mins}:${seconds}`);

    return new Date(Date.UTC(
        yyyy,
        mm - 1,
        dd,
        hours,
        mins,
        seconds,
        ms
    ));
};


export class Asn1Node {

    public raw: Buffer;
    public identifier: IAsn1Identifier;
    public length: number;
    public content: Buffer;
    public children: Array<Asn1Node>;

    constructor(
        raw: Buffer,
        identifier: IAsn1Identifier,
        length: number,
        content: Buffer,
        children: Array<Asn1Node>
    ) {
        this.raw = raw;
        this.identifier = identifier;
        this.length = length;
        this.content = content;
        this.children = children;
    }

    public toString = (tagNumberLookup: Map<number, string> = null): string => {

        const tagNumberLookupIsRelevant = [
            Asn1Class.Application, 
            Asn1Class.ContextSpecific, 
            Asn1Class.Private
        ].includes(this.identifier.class);

        // console.log(`tag number: ${this.identifier.tagNumber}`);
        // console.log(`lookup has: ${tagNumberLookup?.has(this.identifier.tagNumber)}`);

        const tagDescription = (
                (tagNumberLookup != null) 
                && (tagNumberLookup.has(this.identifier.tagNumber))
                && tagNumberLookupIsRelevant
            )
            ? tagNumberLookup.get(this.identifier.tagNumber) + ` [${this.identifier.tagNumber}]`
            : (asn1TagDescription.has(this.identifier.tagNumber))
                ? asn1TagDescription.get(this.identifier.tagNumber)
                : null;

        const label = (tagDescription != null)
            ? tagDescription
            : `${this.identifier.tagNumber}`;

        const oidStr = (this.identifier.tagNumber == Asn1Tag.ObjectIdentifier)
            ? parseOID(this.content)
            : 'badly formed OID';

        const oidDescription = (x509OIDs.has(oidStr))
            ? x509OIDs.get(oidStr)
            : 'unknown OID';

        const contentHex = this.getContentAsHex();

        const hexLimit = 20;
        const cleanContentHex = (contentHex.length > hexLimit)
            ? contentHex.substring(0, hexLimit) + '...'
            : contentHex;

        const universalContentStr = (this.identifier.tagNumber == Asn1Tag.ObjectIdentifier)
            ? `${oidStr} (${oidDescription})`
            : (this.identifier.tagNumber == Asn1Tag.UTF8String)
                ? this.getUTF8String()
                : (this.identifier.tagNumber == Asn1Tag.PrintableString)
                    ? this.getPrintableString()
                    : (this.identifier.tagNumber == Asn1Tag.UTCTime)
                        ? this.getUTCTime().toString()
                        : (this.identifier.tagNumber == Asn1Tag.Integer)
                            ? this.getInteger().toString()
                            : (this.identifier.tagNumber == Asn1Tag.IA5String)
                                ? this.getIA5String()
                                : (this.identifier.tagNumber == Asn1Tag.Boolean)
                                    ? this.getBoolean()
                                    : (this.identifier.tagNumber == Asn1Tag.GeneralizedTime)
                                        ? this.getGeneralizedTime().toString()
                                        : cleanContentHex;
        

        const contentStr = (this.identifier.class == Asn1Class.Universal)
            ? universalContentStr
            : cleanContentHex;

        return `${label} - ${contentStr}`;
    }

    public getUTF8String = (): string =>
        this.content.toString('utf-8');

    public getPrintableString = (): string =>
        this.content.toString('ascii');

    public getUTCTime = (): Date =>
        parseUtcString(this.content.toString('ascii'));
    
    public getGeneralizedTime = (): Date =>
        parseGeneralizedTimeString(this.content.toString('ascii'));

    public getIA5String = (): string =>
        this.content.toString('ascii');

    public getBoolean = (): boolean =>
        !(this.content.readInt8(0) == 0);

    public getInteger = (): number =>
        parseInt(this.content.toString('hex'), 16);

    public getSetElementsAsIntegers = (): Array<number> => 
        this.children.map(child => child.getInteger())

    public getSetElements = (): Array<Asn1Node> => 
        this.children

    public getNull = (): boolean => 
        this.identifier.tagNumber == Asn1Tag.Null;

    public getContentAsHex = (): string =>
        this.content.toString('hex');

    // TODO fix argument order
    public summary = (indent: number, tagNumberLookup: Map<number, string>): Array<string> => {
      
        const childrenReport = [];

        this.children
            .forEach(child => childrenReport.push(...child.summary(indent, tagNumberLookup)));
        
        return [
            this.toString(tagNumberLookup),
            ...childrenReport.map(line => ' '.repeat(indent) + line)
        ];
    }

    public getChildAtZIndex = (zindex: number): Asn1Node =>
        this.children[zindex]

    public getChildWithTagNumber = (tagNumber: number): Asn1Node =>
        this.children.find(it => it.identifier.tagNumber == tagNumber);

    public get = (path: string): Asn1Node => {

        const steps = path.split('.');

        const firstStep = steps[0];

        const firstStepTarget = (firstStep.startsWith('#'))
            ? this.getChildWithTagNumber(parseInt(firstStep.substring(1)))
            : this.getChildAtZIndex(parseInt(firstStep));

        return (steps.length == 1)
            ? firstStepTarget
            : (firstStepTarget)
                ? firstStepTarget.get(steps.slice(1).join('.'))
                : null;
    }

    public reparse = (): void => {
        this.children = parseDER(this.content);
    }
}