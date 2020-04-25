export interface TopbarItem {
    label: string,
    imag: string,
    routerLink: string
}

export interface LoginResponse {
    Id: string;
    PositionId: string;
    token: string;
    refreshToken: string;
}

export interface ServerResponse {
    message: Array<object>;
}
// export interface Project{

//         Name: string,
//         StatusId: number,
//         GeneralProjectId: number,
//         FormatId: number,
//         Tender: number,
//         CyclicityId: number,
//         DepartmentId: number,
//         ClientId: number,
//         CustomerId: number,
//         SubContractorId: number,
//         SaleTypeId: number,
//         ProjectTypeId: number,
//         ProjectTaskId: number,
//         RequestDate: date,
//         ProjectFinishDate: date,
//         Projectdate: date,
//         ProjectDuration: number,
//         FollowUp: date(),
//         SaleManagerId: number,
//         ManagerProjectId: number,
//         DigitalManagerId: number,
//         ScreenWriterId: number,
//         BudgetForClient: number,
//         Budget: number,
//         PayMethodId: number,
//         CountryId: number,
//         CityId: number,
//         AreaId: number,
//         IndoorOutdoorId: number,
//         CountParticipants: number,
//         CountParticipantsF: number,
//         Comment: string

// }

export interface IEmployee {
    message: Message[];
}

export interface Message {
    Id: number;
    Name: string;
    Surname: string;
    FulName: string;
    Image: string;
    Username: string;
    PositionId: number;
    PositionName: string;
    DepartmentId: number;
}

export interface ILegalEntity {
    Id: number;
    TypeLegalEntity: object;
    Taxation: string;
    FullNameEntity: string;
    AbbrName: string;
    LegalAddress: string;
    ActualAddress: string;
    Inn: string;
    Kpp: string;
    Okonx: string;
    Okpo: string;
    Ogrn: string;
    SurName: string;
    Name: string;
    MiddleName: string;
    Acting: string;
    FullNameBank: string;
    AbbrBank: string;
    Bik: string;
    BillNumber: string;
    PaymentAccountNumber: string;
}

export interface IProject {
    ProjectTaskName?: any;
    StatusName: string;
    FormatProjectName: string;
    DepartamentName: string;
    ClientName?: any;
    CustomerName: string;
    SaleName: string;
    ProjectTypeName: string;
    SaleManagerName: string;
    SaleManagerSurname: string;
    SaleManagerImage: string;
    DigitalManagerName?: any;
    ManagerProjectName: string;
    ManagerProjectImage: string;
    ManagerProjectSurname: string;
    ScreenWriterName?: any;
    PayMethodName?: any;
    IfbudgetName?: any;
    KomisionerName?: any;
    TypecomisionName?: any;
    ZonereactName?: any;
    IfcontractorName?: any;
    FormMethodName?: any;
    HarprodjectName: string;
    DatepartyName: string;
    LevelcompanyName?: any;
    MotivpartyName?: any;
    VovlechpartyName?: any;
    ActivpartyName?: any;
    OpenspartyName?: any;
    NacionpartyName?: any;
    LangpartyName?: any;
    TaskprojectName?: any;
    BizkontentName?: any;
    ScenariypartyName?: any;
    LifeexpeName?: any;
    TypecontractName?: any;
    CountryName?: any;
    Cityname?: any;
    AreaName?: any;
    IndoorOutdoorName?: any;
    GeneralProjectName?: any;
    ClientMainManagerName?: any;
    CustomerMainManagerName: string;
    ClientMainManagerSurname?: any;
    CustomerMainManagerSuranme: string;
    Id: number;
    Name: string;
    Number: string;
    StatusId: number;
    FormatId: number;
    Tender: Tender;
    CyclicityId: number;
    ClientDepartmentId?: any;
    ClientId?: any;
    CustomerId: number;
    SaleTypeId: number;
    ProjectTypeId: number;
    ProjectTaskId?: any;
    RequestDate: string;
    ProjectFinishDate: string;
    Projectdate: string;
    ProjectDuration?: any;
    FollowUp: string;
    SaleManagerId: number;
    ManagerProjectId: number;
    DigitalManagerId?: any;
    ScreenWriterId?: any;
    BudgetForClient?: any;
    Budget?: any;
    PayMethodId?: any;
    CountryId?: any;
    CityId?: any;
    AreaId?: any;
    IndoorOutdoorId?: any;
    CountParticipants?: any;
    Comment?: any;
    ClientFilialId?: any;
    ClientMainManagerId?: any;
    CustomerMainManagerId: number;
    CustomerFilialId?: any;
    CustomerDepartmentId?: any;
    DepartmentId: number;
    GeneralProjectId?: any;
    CountParticipantsF?: any;
    agesKl?: any;
    profileKl?: any;
    backgroundKl?: any;
    BudgetPredlog?: any;
    profitWont?: any;
    BudgetFact?: any;
    profitFact?: any;
    profit?: any;
    efficiencyKl?: any;
    insider?: any;
    genderMan?: any;
    genderWoman?: any;
    FormpaymentId?: any;
    HarprodjectId: number;
    DatepartyId: number;
    LevelcompanyId?: any;
    MotivpartyId?: any;
    VovlechpartyId?: any;
    ActivpartyId?: any;
    OpenspartyId?: any;
    NacionpartyId?: any;
    LangpartyId?: any;
    TaskprojectId?: any;
    BizkontentId?: any;
    ScenariypartyId?: any;
    LifeexpeId?: any;
    TypecontractId?: any;
    IfbudgetId?: any;
    KomisionerId?: any;
    TypecomisionId?: any;
    ZonereactId?: any;
    IfcontractorId?: any;
    Comments: any[];
}

export interface Tender {
    type: string;
    data: number[];
}