export interface Projects {
    message: Message[];
}

export interface Message {
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


export interface IColumn {
    title: string;
    id?: any;
    edit?: boolean;
    tasks: ITask[];
}

export interface ITask {
    id?: string;
    name: string;
    description: string;
    date: string;
    time: string;
    comment: string;
    director: any;
    executor: any;
    createDate: string;
}
