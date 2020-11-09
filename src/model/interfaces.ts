import { Asn1Class, Asn1Construction } from "./enums";

export interface IAsn1Identifier {
    raw: Buffer,
    class: Asn1Class,
    construction: Asn1Construction,
    tagNumber: number
}