interface AccountsModel {
    Account_No: string;
    Route_No: string;
    Account_Type: string;
    Account_Balance: string;
    Officer: string;
    Branch_Code: string;
    Registered_Date: string;
    Customer_Id: {
        Customer_Id: string;
        Customer_Name: string;
        Gender: string;
        DOB: string;
        Contact_1: string;
        Contact_2: string;
        Picture: string;
        Sign: string;
        Email: string;
        Occupation: string;
        Address: string;
        Branch_Code: string;
    };
}

export interface BankAccountsModel {
    count: Number,
    next: string,
    previous: string,
    results: AccountsModel[]
}
