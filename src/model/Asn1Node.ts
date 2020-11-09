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
}