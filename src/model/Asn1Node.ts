import { parseDER } from "../asn1der";
import { asn1TagDescription } from "./descriptions";
import { IAsn1Identifier } from "./interfaces";

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

        const contentHex = this.content.toString('hex');
        
        const limit = 20;
        const contentLabel = (contentHex.length > limit)
            ? `${contentHex.substring(0, 20)}...`
            : contentHex;

        return `[${label}] - ${contentLabel}`;
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

    public parseContent = (): void => {
        this.children = parseDER(this.content);
    }
}