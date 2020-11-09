import { parseDER, parseOID } from "../asn1der";
import { asn1TagDescription } from "./descriptions";
import { Asn1Tag } from "./enums";
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

    console.log(`${yyyy}/${mm}/${dd} ${hours}:${mins}:${seconds}`);

    return new Date(Date.UTC(
        yyyy,
        mm,
        dd,
        hours,
        mins,
        seconds
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

    public toString = (): string => {

        const tagDescription = asn1TagDescription.has(this.identifier.tagNumber)
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

        const contentHex = this.content.toString('hex');

        const hexLimit = 20;
        const cleanContentHex = (contentHex.length > hexLimit)
            ? contentHex.substring(0, hexLimit) + '...'
            : contentHex;

        const contentStr = (this.identifier.tagNumber == Asn1Tag.ObjectIdentifier)
            ? `${oidStr} (${oidDescription})`
            : (this.identifier.tagNumber == Asn1Tag.UTF8String)
                ? this.content.toString('utf-8')
                : (this.identifier.tagNumber == Asn1Tag.PrintableString)
                    ? this.content.toString('ascii')
                    : (this.identifier.tagNumber == Asn1Tag.UTCTime)
                        ? parseUtcString(this.content.toString('ascii')).toString()
                        : '0x' + cleanContentHex;
        
        return `[${label}] - ${contentStr}`;
    }

    public summary = (indent = 4): Array<string> => {
      
        const childrenReport = [];

        this.children
            .forEach(child => childrenReport.push(...child.summary()));
        
        return [
            this.toString(),
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
            : firstStepTarget.get(steps.slice(1).join('.'));
    }

    public reparse = (): void => {
        this.children = parseDER(this.content);
    }
}