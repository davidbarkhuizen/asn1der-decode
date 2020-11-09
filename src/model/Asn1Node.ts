import { asn1TagDescription } from "./descriptions";
import { IAsn1Identifier } from "./interfaces";

export class Asn1Node {

    raw: Buffer;
    identifier: IAsn1Identifier;
    length: number;
    content: Buffer;
    children: Array<Asn1Node>;

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
            .forEach(child => childrenReport                
                .push(...child.summary()));
        
        return [
            this.toString(),
            ...childrenReport.map(line => ' '.repeat(indent) + line)
            ];
    }
}