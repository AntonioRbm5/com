// data.js

export const documents = [
    {
        id: 'FACT0001',
        type: 'Facture',
        date: '120722',
        client: '4111ETECH',
        name: 'E-TECHNOLOGIES',
        status: 'A comptabil...',
        ht: '7 258 983',
        ttc: '8 565 600'
    },
    {
        id: 'FACT0002',
        type: 'Facture',
        date: '150722',
        client: '4111VIRAGE',
        name: 'VIRAGE INFORMATIQUE',
        status: 'A comptabil...',
        ht: '25 871 227',
        ttc: '30 528 048'
    },
    {
        id: 'FACT0003',
        type: 'Facture',
        date: '290722',
        client: '4111TECH',
        name: 'TECH COM',
        status: 'A comptabil...',
        ht: '9 458 900',
        ttc: '11 161 502'
    }
];

export const purchaseDocuments = [
    {
        id: 'FA0001',
        date: '220722',
        supplier: '4011LAURIERS',
        name: 'LAURIERS TECH',
        ht: '13 534 968'
    }
];

export const inventory = [
    {
        ref: 'IMPR0001',
        name: 'HP MULTIFONCTION LASERJ...',
        qty: '10,00',
        pu: '589 675',
        value: '5 896 750'
    },
    {
        ref: 'IMPR0002',
        name: 'HP LASERJET PRO M404dn',
        qty: '5,00',
        pu: '221 058',
        value: '1 105 290'
    },
    {
        ref: 'IMPR0003',
        name: 'HP DESIGNJET STUDIO MET...',
        qty: '6,00',
        pu: '1 566 425',
        value: '9 398 550'
    },
    {
        ref: 'ORDB0001',
        name: 'HP 260 G4 i7',
        qty: '1,00',
        pu: '345 033',
        value: '345 033'
    }
];

export const clientAnalysis = [
    {
        clientNo: '4111ETECH',
        clientName: 'E-TECHNOLOGIES',
        nbDoc: 1,
        caHT: '7 258 983',
        marge: '1 451 796',
        margePct: '20,00'
    },
    {
        clientNo: '4111TECH',
        clientName: 'TECH COM',
        nbDoc: 1,
        caHT: '9 458 900',
        marge: '1 891 782',
        margePct: '20,00'
    },
    {
        clientNo: '4111VIRAGE',
        clientName: 'VIRAGE INFORMATIQUE',
        nbDoc: 1,
        caHT: '25 871 227',
        marge: '4 084 932',
        margePct: '15,79'
    }
];