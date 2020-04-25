import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class ProjectsService {
    constructor(private _apiService: ApiService) { }
    /**
      * set url of get function from apiService for get array of projects status
      */
    public getAllStatuses() {
        return this._apiService.get('status');
    }
    /**
     * set url of get function from apiService for get array of payMethods
     */
    public getAllPayMethods() {
        return this._apiService.get('paymethod');
    }
    public getAllifBudgets() {
        return this._apiService.get('ifbudget');
    }
    public getAllkomisioners() {
        return this._apiService.get('komisioner');
    }
    public getAlltypeComisions() {
        return this._apiService.get('typecomision');
    }
    public getAllzoneReacts() {
        return this._apiService.get('zonereact');
    }
    public getAllifContractors() {
        return this._apiService.get('ifcontractor');
    }
    public getAllFormMethods() {
        return this._apiService.get('formmethod');
    }
    public getAllharProdjects() {
        return this._apiService.get('harprodject');
    }
    public getAlldatePartys() {
        return this._apiService.get('dateparty');
    }
    public getAlllevelCompanys() {
        return this._apiService.get('levelcompany');
    }
    public getAllmotivPartys() {
        return this._apiService.get('motivparty');
    }
    public getAllvovlechPartys() {
        return this._apiService.get('vovlechparty');
    }
    public getAllactivPartys() {
        return this._apiService.get('activparty');
    }
    public getAllopensPartys() {
        return this._apiService.get('opensparty');
    }
    public getAllnacionPartys() {
        return this._apiService.get('nacionparty');
    }
    public getAlllangPartys() {
        return this._apiService.get('langparty');
    }
    public getAlltaskProjects() {
        return this._apiService.get('taskproject');
    }
    public getAllbizKontents() {
        return this._apiService.get('bizkontent');
    }
    public getAllscenariyPartys() {
        return this._apiService.get('scenariyparty');
    }
    public getAlllifeExpes() {
        return this._apiService.get('lifeexpe');
    }
    public getAlltypeContracts() {
        return this._apiService.get('typecontract');
    }
    public getAllFormatByProject() {
        return this._apiService.get('project/company/format');
    }


    /**
     * set url of get function from apiService for get array of company types
     */
    public getAllCompanyTypes() {
        return this._apiService.get('typeCompany');
    }
    /**
     * set url of get function from apiService for get array of types project
     */
    public getAllProjectTypes() {
        return this._apiService.get('typeProject');
    }
    /**
     * set url of get function from apiService for get array of cities
     */
    public getAllCities() {
        return this._apiService.get('city');
    }
    /**
     * set url of get function from apiService for get array of countries
     */
    public getAllCountries() {
        return this._apiService.get('country');
    }
    /**
     * set url of get function from apiService for get array of departament
     */
    public getAllDepartments() {
        return this._apiService.get('department');
    }
    /**
     * set url of get function from apiService for get array of employee departament
     */
    public getAllEmployeeDepartments() {
        return this._apiService.get('departmentEmployee');
    }
    /**
     * set url of get function from apiService for get array of sphere activity
     */
    public getAllSphereActivity() {
        return this._apiService.get('sphereActivity');
    }
    /**
     * set url of get function from apiService for get array of sale types
     */
    public getAllSalesTypes() {
        return this._apiService.get('typeSale');
    }
    /**
     * set url of get function from apiService for get array of managers
     */
    public getAllManager() {
        return this._apiService.get('manager');
    }
    /**
     * set url of get function from apiService for get array of format project
     */
    public getAllFormatProject() {
        return this._apiService.get('formatProject');
    }
    /**
     * set url of get function from apiService for get array of filials
     */
    public getAllFilials() {
        return this._apiService.get('filial');
    }
    /**
     * set url of get function from apiService for get array of cyclical project
     */
    public getAllCyclicalProject() {
        return this._apiService.get('cyclicalProject');
    }
    /**
     * set url of get function from apiService for get array of type Sale
     */
    public getAllTypeSale() {
        return this._apiService.get('typeSale');
    }
    /**
     * set url of get function from apiService for get array areas conduct
     */
    public getAllAreasConduct() {
        return this._apiService.get('areas_conduct');
    }
    /**
     * set url of get function from apiService for get array of indoor outdoor
     */
    public getIndoorOutdoor() {
        return this._apiService.get('indoor_outdoor');
    }
    /**
     * set url of get function from apiService for get array of projects task
     */
    public getAllProjectTask() {
        return this._apiService.get('project_task');
    }
    /**
   * set url of get function from apiService for get array of subcontractor
   */
    public getAllSubcontractor() {
        return this._apiService.get('subcontractor');
    }
    /**
   * set url of get function from apiService for get array of employee
   */
    public getAllEmployee() {
        return this._apiService.get('employee');
    }
    /**
     * set url of get function from apiService for get array of company
     */
    public getAllCompany() {
        return this._apiService.get('company');
    }

    public getAllProjectsName() {
        return this._apiService.get('projects/name');
    }
    /**
     *
     * @param name -name project types string
     * @param statusId -number selected status id
     * @param formatId -number selected fromat id
     * @param cyclicityId -number selected cyclicity project id
     * @param departamentId -number selected departament id
     * @param customerId -number selected customer id
     * @param saletypeId -number selected saleType id
     * @param projectTypeId -number selected projectType id
     * @param payMethodId -number selected PM id
     * @param countruId -number selected countryId id
     * @param cityId -number selected cityId id
     * @param areaId -number selected status id
     * @param countParticipants -count participant
     * @param countParticipantsF -count participant
     */
    public addProject(
        name,
        statusId,
        formatId,
        cyclicityId,
        departamentId,
        customerId,
        saletypeId,
        projectTypeId,
        payMethodId,
        ifbudgetId,
        komisionerId,
        typecomisionId,
        zonereactId,
        ifcontractorId,
        formpaymentId,
        harprodjectId,
        datepartyId,
        levelcompanyId,
        motivpartyId,
        vovlechpartyId,
        activpartyId,
        openspartyId,
        nacionpartyId,
        langpartyId,
        taskprojectId,
        bizkontentId,
        scenariypartyId,
        lifeexpeId,
        typecontractId,
        countryId,
        cityId,
        areaId,
        countParticipants,
        countParticipantsF,
        formatIds
    ) {
        return this._apiService.post('project', {
            'Name': name,
            'StatusId': statusId,
            'FormatId': formatId,
            'CyclicityId': cyclicityId,
            'DepartmentId': departamentId,
            'CustomerId': customerId,
            'SaleTypeId': saletypeId,
            'ProjectTypeId': projectTypeId,
            'PayMethodId': payMethodId,
            'IfbudgetId': ifbudgetId,
            'KomisionerId': komisionerId,
            'TypecomisionId': typecomisionId,
            'ZonereactId': zonereactId,
            'IfcontractorId': ifcontractorId,
            'FormpaymentId': formpaymentId,
            'HarprodjectId': harprodjectId,
            'DatepartyId': datepartyId,
            'LevelcompanyId': levelcompanyId,
            'MotivpartyId': motivpartyId,
            'VovlechpartyId': vovlechpartyId,
            'ActivpartyId': activpartyId,
            'OpenspartyId': openspartyId,
            'NacionpartyId': nacionpartyId,
            'LangpartyId': langpartyId,
            'TaskprojectId': taskprojectId,
            'BizkontentId': bizkontentId,
            'ScenariypartyId': scenariypartyId,
            'LifeexpeId': lifeexpeId,
            'TypecontractId': typecontractId,

            'CountryId': countryId,
            'CityId': cityId,
            'AreaId': areaId,
            'CountParticipants': countParticipants,
            'CountParticipantsF': countParticipantsF,
            'FormatIds': formatIds
        });
    }
    /**
     * get all projects
     */
    public getProject() {
        return this._apiService.get('project');
    }

    public getProjectAllEmployee() {
        return this._apiService.get('project-employee-all');
    }

    /**
     * get project by id
     * @param id
     */
    public getProjectById(id) {
        return this._apiService.get('project/' + id);
    }
    /**
     * get employee by id
     * @param id
     */
    public getEmployeeByPosition(id) {
        return this._apiService.get('employee/position/' + id);
    }
    /**
     * get all position employee
     */
    public getAllPositionEmployee() {
        return this._apiService.get('positionEmployees');
    }
    public addProjectCompanyManager() {
        return this._apiService.get('project/company/manager');
    }
    /**
     *
     * @param id -company id
     */
    public getFilialById(id) {
        return this._apiService.get('company/filial/' + id);
    }
    /**
     *
     * @param id -filial id
     */
    public getDepartamnetByFilialId(id) {
        return this._apiService.get('company/department/filial/' + id);
    }
    /**
     *
     * @param id
     */
    public getCompanyManager(id) {
        return this._apiService.get('company/manager/' + id);
    }
    /**
     *
     * @param id
     */
    public getCompanyManagers(id) {
        return this._apiService.get('company/department/manager/' + id);
    }
    /**
     *
     * @param projectId
     * @param subcontractorId
     */
    public addCompanySubcontractor(projectId: number, subcontractorId: number) {
        return this._apiService.post('project/subcontractor', {
            'ProjectId': projectId,
            'SubcontractorId': subcontractorId
        });
    }
    /**
     *
     * @param projectId
     * @param employeeId
     */
    public addProjectEmployee(projectId: number, employeeId: number, mode: number) {
        return this._apiService.post('project/employee', {
            'ProjectId': projectId,
            'EmployeeId': employeeId,
            'Mode': mode,
        });
    }
    /**
     *
     * @param projectName
     * @param statusId
     * @param generalProjectId
     * @param formatId
     * @param tender
     * @param ciclycityId
     * @param clientId
     * @param customerId
     * @param subContractorId
     * @param saleTypeId
     * @param projectTypeId
     * @param projectTaskId
     * @param projectDuration
     * @param saleManagerId
     * @param managerProjectId
     * @param digitalManagerId
     * @param screenWriterId
     * @param budgetForClient
     * @param budget
     * @param payMethodId
     * @param countryId
     * @param cityId
     * @param areaId
     * @param indoorOutdoorId
     * @param countParticipants
     * @param countParticipantsF
     * @param comment
     * @param childManagerClient
     * @param childManagerCustomer
     * @param subcontractor
     * @param employee
     * @param clientDepartmentId
     * @param clientFilialId
     * @param clientMainManagerId
     * @param customerDepartmentId
     * @param customerFilialId
     * @param customerMainManagerId
     */
    public addNewProject({
        projectName,
        formagesKl,
        fgenderMan,
        fgenderWoman,
        fBudgetPredlog,
        fprofitWont,
        fBudgetFact,
        fprofitFact,
        fprofit,
        fprofileKl,
        fbackgroundKl,
        finsider,
        fefficiencyKl,
        statusId,
        generalProjectId,
        formatId,
        ciclycityId,
        clientId,
        customerId,
        saleTypeId,
        projectTypeId,
        projectTaskId,
        projectDuration,
        saleId,
        pmId,
        budgetForClient,
        budget,
        payMethodId,
        ifbudgetId,
        komisionerId,
        typecomisionId,
        formpaymentId,
        harprodjectId,
        datepartyId,
        levelcompanyId,
        motivpartyId,
        vovlechpartyId,
        activpartyId,
        openspartyId,
        nacionpartyId,
        langpartyId,
        taskprojectId,
        bizkontentId,
        scenariypartyId,
        lifeexpeId,
        typecontractId,
        countryId,
        cityId,
        areaId,
        indoorOutdoorId,
        countParticipants,
        countParticipantsF,
        childManagerClient,
        childManagerCustomer,
        subcontractor,
        employee,
        clientDepartmentId,
        clientFilialId,
        clientMainManagerId,
        customerDepartmentId,
        customerFilialId,
        customerMainManagerId,
        departMentId,
        requestDate,
        projectFinishDate,
        projectDate,
        number,
        vip,
        comment,
        formatIds,
        commentStatus,
        payDate,
        timetable,
        singleParty,
        multiDatePartyPause,
        seriesParty,
        multiDateParty,
        taskProjectComment,
        customerLegalPersonId,
        clientLegalPersonId,
        legalPersonISGId,
        recomendManagerId,
        commentFormatProject,
        commentSetFormatProject,
        commentCyclicity,
        commentZones,
        commentIndOut,
        commentLevelCompany,
        commentBizKontent,
        commentScenariyParty,
        commentLifeExpe,
        commentRecomendManager,
        opSale,
        op,
        opClient,
        opCustomer,
        subcontractors,
        commissionNumber,
        recomendISGId,
        commentCommission,
        setProjectFormatIds,
        customerClosingDocuments,
        clientClosingDocuments,
        budgetPredlogs,
        departmentInvolved,
        typeDateParty,
    }) {
        return this._apiService.post('project', {
            'Name': projectName,

            'agesKl': formagesKl,
            'genderMan': fgenderMan,
            'genderWoman': fgenderWoman,
            'BudgetPredlog': fBudgetPredlog,
            'BudgetPredlogs': budgetPredlogs,
            'profitWont': fprofitWont,
            'BudgetFact': fBudgetFact,
            'profitFact': fprofitFact,
            'profit': fprofit,
            'profileKl': fprofileKl,
            'backgroundKl': fbackgroundKl,
            'insider': finsider,
            'efficiencyKl': fefficiencyKl,

            'StatusId': statusId,
            'GeneralProjectId': generalProjectId,
            'FormatId': formatId,
            'CyclicityId': ciclycityId,
            'ClientId': clientId,
            'CustomerId': customerId,
            'SaleTypeId': saleTypeId,
            'ProjectTypeId': projectTypeId,
            'ProjectTaskId': projectTaskId,
            'ProjectDuration': projectDuration,
            'SaleManagerId': saleId,
            'ManagerProjectId': pmId,
            'BudgetForClient': budgetForClient,
            'Budget': budget,
            'PayMethodId': payMethodId,
            'IfbudgetId': ifbudgetId,
            'KomisionerId': komisionerId,
            'TypecomisionId': typecomisionId,
            'FormpaymentId': formpaymentId,
            'HarprodjectId': harprodjectId,
            'DatepartyId': datepartyId,
            'LevelcompanyId': levelcompanyId,
            'MotivpartyId': motivpartyId,
            'VovlechpartyId': vovlechpartyId,
            'ActivpartyId': activpartyId,
            'OpenspartyId': openspartyId,
            'NacionpartyId': nacionpartyId,
            'LangpartyId': langpartyId,
            'TaskprojectId': taskprojectId,
            'BizkontentId': bizkontentId,
            'ScenariypartyId': scenariypartyId,
            'LifeexpeId': lifeexpeId,
            'TypecontractId': typecontractId,

            'CountryId': countryId,
            'CityId': cityId,
            'AreaId': areaId,
            'IndoorOutdoorId': indoorOutdoorId,
            'CountParticipants': countParticipants,
            'CountParticipantsF': countParticipantsF,
            'ChildManagerClient': childManagerClient,
            'ChildManagerCustomer': childManagerCustomer,
            'Subcontractor': subcontractor,
            'Employee': employee,
            'ClientDepartmentId': clientDepartmentId,
            'ClientFilialId': clientFilialId,
            'ClientMainManagerId': clientMainManagerId,
            'CustomerDepartmentId': customerDepartmentId,
            'CustomerFilialId': customerFilialId,
            'CustomerMainManagerId': customerMainManagerId,
            'DepartmentId': departMentId,
            'RequestDate': requestDate,
            'ProjectFinishDate': projectFinishDate,
            'Projectdate': projectDate,
            'Number': number,
            'VIP': vip,
            'Comment': comment,
            'FormatIds': formatIds,
            'CommentStatus': commentStatus,
            'PayDate': payDate,
            'Timetable': timetable,
            'TypeDateParty': typeDateParty,
            'SingleParty': singleParty,
            'MultiDatePartyPause': multiDatePartyPause,
            'SeriesDateParty': seriesParty,
            'MultiDateParty': multiDateParty,
            'TaskProjectComment': taskProjectComment,
            'CustomerMainLegalPersonId': customerLegalPersonId,
            'ClientMainLegalPersonId': clientLegalPersonId,
            'LegalPersonISGId': legalPersonISGId,
            'RecomendManagerId': recomendManagerId,
            'RecomendISGId': recomendISGId,
            'CommentFormatProject': commentFormatProject,
            'CommentSetFormatProject': commentSetFormatProject,
            'CommentCyclicity': commentCyclicity,
            'CommentZones': commentZones,
            'CommentIndOut': commentIndOut,
            'CommentLevelCompany': commentLevelCompany,
            'CommentBizKontent': commentBizKontent,
            'CommentScenariyParty': commentScenariyParty,
            'CommentLifeExpe': commentLifeExpe,
            'CommentRecomendManager': commentRecomendManager,
            'OPSaleEmployee': opSale,
            'OPEmployee': op,
            'OPClientEmployee': opClient,
            'OPCustomerEmployee': opCustomer,
            'CommissionNumber': commissionNumber,
            'CommentCommission': commentCommission,
            'SetProjectFormatIds': setProjectFormatIds,
            'CustomerClosingDocuments': customerClosingDocuments,
            'ClientClosingDocuments': clientClosingDocuments,
            'DepartmentInvolved': departmentInvolved,
            'Subcontractors': subcontractors
        });
    }
    public updateProject({
        projectId,
        projectName,
        formagesKl,
        fgenderMan,
        fgenderWoman,
        fBudgetPredlog,
        fprofitWont,
        fBudgetFact,
        fprofitFact,
        fprofit,
        fprofileKl,
        fbackgroundKl,
        finsider,
        fefficiencyKl,
        statusId,
        generalProjectId,
        formatId,
        ciclycityId,
        clientId,
        customerId,
        saleTypeId,
        projectTypeId,
        projectTaskId,
        projectDuration,
        saleId,
        pmId,
        budgetForClient,
        budget,
        payMethodId,
        ifbudgetId,
        komisionerId,
        typecomisionId,
        formpaymentId,
        harprodjectId,
        datepartyId,
        levelcompanyId,
        motivpartyId,
        vovlechpartyId,
        activpartyId,
        openspartyId,
        nacionpartyId,
        langpartyId,
        taskprojectId,
        bizkontentId,
        scenariypartyId,
        lifeexpeId,
        typecontractId,
        countryId,
        cityId,
        areaId,
        indoorOutdoorId,
        countParticipants,
        countParticipantsF,
        clientDepartmentId,
        clientFilialId,
        clientMainManagerId,
        customerDepartmentId,
        customerFilialId,
        customerMainManagerId,
        departMentId,
        requestDate,
        projectFinishDate,
        projectDate,
        number,
        vip,
        comment,
        formatIds,
        commentStatus,
        payDate,
        timetable,
        singleParty,
        multiDatePartyPause,
        seriesParty,
        multiDateParty,
        taskProjectComment,
        customerLegalPersonId,
        clientLegalPersonId,
        legalPersonISGId,
        recomendManagerId,
        commentFormatProject,
        commentSetFormatProject,
        commentCyclicity,
        commentZones,
        commentIndOut,
        commentLevelCompany,
        commentBizKontent,
        commentScenariyParty,
        commentLifeExpe,
        commentRecomendManager,
        opSale,
        op,
        opClient,
        opCustomer,
        subcontractors,
        commissionNumber,
        recomendISGId,
        commentCommission,
        setProjectFormatIds,
        customerClosingDocuments,
        clientClosingDocuments,
        budgetPredlogs,
        departmentInvolved,
        typeDateParty
    }) {
        console.log('service', opClient);
        return this._apiService.put('project', {
            'Id': projectId,
            'Name': projectName,
            'agesKl': formagesKl,
            'genderMan': fgenderMan,
            'genderWoman': fgenderWoman,
            'BudgetPredlog': fBudgetPredlog,
            'BudgetPredlogs': budgetPredlogs,
            'profitWont': fprofitWont,
            'BudgetFact': fBudgetFact,
            'profitFact': fprofitFact,
            'profit': fprofit,
            'profileKl': fprofileKl,
            'backgroundKl': fbackgroundKl,
            'insider': finsider,
            'efficiencyKl': fefficiencyKl,
            'StatusId': statusId,
            'GeneralProjectId': generalProjectId,
            'FormatId': formatId,
            'CyclicityId': ciclycityId,
            'ClientId': clientId,
            'CustomerId': customerId,
            'SaleTypeId': saleTypeId,
            'ProjectTypeId': projectTypeId,
            'ProjectTaskId': projectTaskId,
            'ProjectDuration': projectDuration,
            'SaleManagerId': saleId,
            'ManagerProjectId': pmId,
            'BudgetForClient': budgetForClient,
            'Budget': budget,
            'PayMethodId': payMethodId,
            'IfbudgetId': ifbudgetId,
            'KomisionerId': komisionerId,
            'TypecomisionId': typecomisionId,
            'FormpaymentId': formpaymentId,
            'HarprodjectId': harprodjectId,
            'DatepartyId': datepartyId,
            'LevelcompanyId': levelcompanyId,
            'MotivpartyId': motivpartyId,
            'VovlechpartyId': vovlechpartyId,
            'ActivpartyId': activpartyId,
            'OpenspartyId': openspartyId,
            'NacionpartyId': nacionpartyId,
            'LangpartyId': langpartyId,
            'TaskprojectId': taskprojectId,
            'BizkontentId': bizkontentId,
            'ScenariypartyId': scenariypartyId,
            'LifeexpeId': lifeexpeId,
            'TypecontractId': typecontractId,
            'CountryId': countryId,
            'CityId': cityId,
            'AreaId': areaId,
            'IndoorOutdoorId': indoorOutdoorId,
            'CountParticipants': countParticipants,
            'CountParticipantsF': countParticipantsF,
            'ClientDepartmentId': clientDepartmentId,
            'ClientFilialId': clientFilialId,
            'ClientMainManagerId': clientMainManagerId,
            'CustomerDepartmentId': customerDepartmentId,
            'CustomerFilialId': customerFilialId,
            'CustomerMainManagerId': customerMainManagerId,
            'DepartmentId': departMentId,
            'RequestDate': requestDate,
            'ProjectFinishDate': projectFinishDate,
            'Projectdate': projectDate,
            'Number': number,
            'VIP': vip,
            'Comment': comment,
            'FormatIds': formatIds,
            'CommentStatus': commentStatus,
            'PayDate': payDate,
            'Timetable': timetable,
            'TypeDateParty': typeDateParty,
            'SingleParty': singleParty,
            'MultiDatePartyPause': multiDatePartyPause,
            'SeriesDateParty': seriesParty,
            'MultiDateParty': multiDateParty,
            'TaskProjectComment': taskProjectComment,
            'CustomerMainLegalPersonId': customerLegalPersonId,
            'ClientMainLegalPersonId': clientLegalPersonId,
            'LegalPersonISGId': legalPersonISGId,
            'RecomendManagerId': recomendManagerId,
            'RecomendISGId': recomendISGId,
            'CommentFormatProject': commentFormatProject,
            'CommentCyclicity': commentCyclicity,
            'CommentZones': commentZones,
            'CommentIndOut': commentIndOut,
            'CommentLevelCompany': commentLevelCompany,
            'CommentBizKontent': commentBizKontent,
            'CommentScenariyParty': commentScenariyParty,
            'CommentLifeExpe': commentLifeExpe,
            'CommentRecomendManager': commentRecomendManager,
            'OPSaleEmployee': opSale,
            'OPEmployee': op,
            'OPClientEmployee': opClient,
            'OPCustomerEmployee': opCustomer,
            'CommissionNumber': commissionNumber,
            'CommentCommission': commentCommission,
            'SetProjectFormatIds': setProjectFormatIds,
            'CommentSetFormatProject': commentSetFormatProject,
            'CustomerClosingDocuments': customerClosingDocuments,
            'ClientClosingDocuments': clientClosingDocuments,
            'DepartmentInvolved': departmentInvolved,
            'Subcontractors': subcontractors
        });
    }
    /**
     *
     * @param projectId
     * @param managerId
     * @param companyId
     */
    public addCompanyManager(projectId, managerId, companyId, type) {
        return this._apiService.post('project/company/manager', {
            'ProjectId': projectId,
            'ManagerId': managerId,
            'CompanyId': companyId,
            'IsClient': type
        });
    }
    /**
     *
     * @param projectId
     * @param projectDate
     */
    public changeProjectDate(projectId: number, projectDate: Date) {
        return this._apiService.put('project/date', {
            'ProjectId': projectId,
            'ProjectDate': projectDate
        });
    }
    /**
     *
     * @param projectId
     * @param subcontractorId
     */
    public deleteProjectSubcontractor(projectId, subcontractorId) {
        return this._apiService.delete('project/subcontractor/' + projectId + '/' + subcontractorId);
    }
    /**
     *
     * @param projectId
     * @param employeeId
     */
    public deleteEmployee(projectId, employeeId) {
        return this._apiService.delete('project/employee/' + projectId + '/' + employeeId);
    }
    /**
     *
     * @param projectId
     * @param managerId
     * @param companyId
     */
    public deleteCompanyManager(projectId, managerId, companyId) {
        return this._apiService.delete('project/company/manager/' + projectId + '/' + managerId + '/' + companyId);
    }
    /**
     *
     * @param id
     */
    public deleteProject(id) {
        return this._apiService.delete('project/' + id);
    }

    /**
     *
     * @param projectName
     * @param statusId
     * @param generalProjectId
     * @param formatId
     * @param tenderValue
     * @param cyclicityId
     * @param departmentId
     * @param clientId
     * @param customerId
     * @param subContractorId
     * @param saleTypeId
     * @param projectTypeId
     * @param projectTaskId
     * @param projectFinishDateStart
     * @param projectFinishDateEnd
     * @param projectDateStart
     * @param projectdateEnd
     * @param saleManagerId
     * @param managerProjectId
     * @param countryId
     * @param cityId
     * @param areaId
     * @param indoorOutdoorId
     * @param countParticipantsStart
     * @param countParticipantsEnd
     */
    public searchProject(projectName: string, statusId: Array<number>, formatId: Array<number>,
        tenderValue: number, departmentId: Array<number>, clientId: Array<number>, customerId: Array<number>,
        projectTypeId: Array<number>, projectTaskId: Array<number>,
        projectFinishDateStart: string, projectFinishDateEnd: string,
        projectDateStart: string, projectdateEnd: string, saleManagerId: Array<number>,
        managerProjectId: Array<number>, countryId: Array<number>, cityId: Array<number>,
        areaId: Array<number>, indoorOutdoorId: Array<number>,
        countParticipantsStart: number, countParticipantsEnd: number, sphereActivityId: Array<number>,
        followUpDateStart: string, followUpDateEnd: string
    ) {
        const url = 'projects/query?Name=' + projectName + '&StatusId=[' + statusId + ']' +
            '&FormatId=[' + formatId + ']' +
            '&Tender=' + tenderValue + '&DepartmentId=[' + departmentId + ']' +
            '&ClientId=[' + clientId + ']' + '&CustomerId=[' + customerId + ']' +
            '&ProjectTypeId=[' + projectTypeId + ']' + '&ProjectTaskId=[' + projectTaskId + ']' +
            '&ProjectFinishDateStart=' + projectFinishDateStart + '&ProjectFinishDateEnd=' + projectFinishDateEnd +
            '&ProjectdateStart=' + projectDateStart + '&ProjectdateEnd=' + projectdateEnd + '&SaleManagerId=[' + saleManagerId + ']' +
            '&ManagerProjectId=[' + managerProjectId + ']' + '&CountryId=[' + countryId + ']' + '&CityId=[' + cityId + ']' +
            '&AreaId=[' + areaId + ']' + '&IndoorOutdoorId=[' + indoorOutdoorId + ']' + '&CountParticipantsStart=' +
            countParticipantsStart + '&CountParticipantsEnd=' + countParticipantsEnd + '&SphereActivityId=[' + sphereActivityId + ']' +
            '&FollowUpStart=' + followUpDateStart + '&FollowUpEnd=' + followUpDateEnd;
        return this._apiService.get(url);
    }

    public generateProjectNumber(departmentName: string, projectYear: string) {
        return this._apiService.post('project/number', {
            DepartmentName: departmentName,
            ProjectYear: projectYear
        });
    }

    public getFiles(id: number) {
        return this._apiService.get('project-file/' + id);
    }

    public saveFile(file) {
        return this._apiService.post('project-file/' + file.ProjectId, file);
    }

    public deleteFile(fileId) {
        return this._apiService.delete('project-file/' + fileId);
    }

    public addProjectReminder(data) {
        return this._apiService.post('project/reminder', data);
    }

    public updateProjectReminder(data) {
        return this._apiService.put('project/reminder', data);
    }

    public getAllProjectReminder() {
        return this._apiService.get('project-reminder');
    }

    public getAllCards() {
        return this._apiService.get('tasks');
    }

    public getAllRolesISG() {
        return this._apiService.get('project-roles-isg');
    }

    public getAllRolesManager() {
        return this._apiService.get('project-roles-manager');
    }

    public addLiteCompany({
        denomination,
        selectedSphereActivity,
        companyType,
        country,
        city,
        companyCustomer,
        companySubcontractor
    }) {
        return this._apiService.post('company/lite', {
            'Denomination': denomination,
            'SphereActivity': selectedSphereActivity,
            'CompanyType': companyType,
            'Country': country,
            'City': city,
            'Customer': companyCustomer,
            'Subcontractor': companySubcontractor
        });
    }

    public addLiteManager(
        Name,
        Surname,
        Gender,
        Position,
        SphereActivity,
        CompanyName?,
        DepartmentName?,
    ) {
        return this._apiService.post('company/manager/lite', {
            'Name': Name,
            'Surname': Surname,
            'Gender': Gender,
            'Position': Position,
            'CompanyName': CompanyName,
            'DepartmentName': DepartmentName,
            'SphereActivity': SphereActivity,
        });
    }

    public getProjectExportExcel() {
        return this._apiService.get('project-export-excel');
    }

    public addProjectCE(data) {
        return this._apiService.post('project_ce', data);
    }

    public getProjectCE(projectId) {
        return this._apiService.get(`project_ce/${projectId}`);
    }

    public getAllProjectWithCE() {
        return this._apiService.get('project_ce');
    }

    public exportEstimate(body) {
        return this._apiService.post('project_ce_export', body);
    }

    public exportLiteEstimate(body) {
        return this._apiService.post('project_ce_export_lite', body);
    }
}
