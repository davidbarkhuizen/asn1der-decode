export enum AuthorizationList {
    purpose = 1,
    algorithm = 2,
    keySize = 3,
    digest = 5,
    padding = 6,
    ecCurve = 10,
    rsaPublicExponent = 200,
    rollbackResistance = 303,
    activeDateTime = 400,
    originationExpireDateTime = 401,
    usageExpireDateTime = 402,
    noAuthRequired = 503,
    userAuthType = 504,
    authTimeout = 505,
    allowWhileOnBody = 506,
    trustedUserPresenceRequired = 507,
    trustedConfirmationRequired = 508,
    unlockedDeviceRequired = 509,
    allApplications = 600,
    applicationId = 601,
    creationDateTime = 701,
    origin = 702,
    rootOfTrust = 704,
    osVersion = 705,
    osPatchLevel = 706,
    attestationApplicationId = 709,
    attestationIdBrand = 710,
    attestationIdDevice = 711,
    attestationIdProduct = 712,
    attestationIdSerial = 713,
    attestationIdImei = 714,
    attestationIdMeid = 715,
    attestationIdManufacturer = 716,
    attestationIdModel = 717,
    vendorPatchLevel = 718,
    bootPatchLevel = 719,
}

export const authorizationListLookup = (): Map<number, string> => {

    const lookup = new Map<number, string>();

    for (const value in AuthorizationList) {

        // console.log(Number(value), AuthorizationList[value]);

        if (typeof AuthorizationList[value] !== "string") {
            continue;
        }

        // console.log('x', Number(value), AuthorizationList[value]);
    
        lookup.set(Number(value), AuthorizationList[value]);
    }

    return lookup;
};