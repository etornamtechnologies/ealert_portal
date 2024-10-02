export interface Payment {
    transaction_id   : string;
    payer_name       : string;
    phone_number     : string;
    amount           : string;
    transaction_date : string;
    payment_type     : string;
    narration        : string;
}

export interface CollectionHistory {
        transaction_date : string;
        name             : string;
        amount_deposited : number;
        amount_owing     : number;
        recieved_by      : string;
        recieved_date    : any;
}

