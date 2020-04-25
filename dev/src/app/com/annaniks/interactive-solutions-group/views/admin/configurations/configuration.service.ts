import { Injectable } from '@angular/core';
import { ApiService } from '../../../services';

@Injectable()
export class ConfigurationService {
    constructor(private _apiService: ApiService) { }
    /**
   * set url on get function from apiService for get array of sphereActivity
   */
    public getAllSphereActivity() {
        return this._apiService.get('sphereActivity');
    }
    /**
   * set url on get function from apiService for get array of employee
   */
    public getAllEmployee() {
        return this._apiService.get('employee');
    }
    /**
   * set url of get function from apiService for get object of checked element of employees array
   */
    public getEmployeeById(id) {
        return this._apiService.get('employee/' + id);
    }
    /**
   * set url on get function from apiService for get array of projects status
   */
    public getStatusProject() {
        return this._apiService.get('status');
    }
    /**
   * set url on get function from apiService for get array of projects format
   */
    public getFormatProject() {
        return this._apiService.get('formatProject');
    }
    /**
   * set url on get function from apiService for get array of cyclical projects
   */
    public getCyclicalProject() {
        return this._apiService.get('cyclicalProject');
    }

    /**
   * set url on get function from apiService for get array of sales type
   */
    public getTypeSale() {
        return this._apiService.get('typeSale');
    }
    /**
   * set url on get function from apiService for get array of projects type
   */
    public getTypeProject() {
        return this._apiService.get('typeProject');
    }
    /**
   * set url on get function from apiService for get array of projects task
   */
    public getTaskProject() {
        return this._apiService.get('project_task');
    }
    /**
   * set url on get function from apiService for get array on positionEmployees
   */
    public getPositionEmployee() {
        return this._apiService.get('positionEmployees');
    }

    getOnePosition(id) {
        return this._apiService.get('positionEmployees/' + id);
    }

    savePosition(data) {
        return this._apiService.put('positionEmployees', data);
    }
    /**
   * set url on get function from apiService for get array on sphere activity
   */
    public getSphereActivity() {
        return this._apiService.get('sphereActivity');
    }
    /**
   * set url on get function from apiService for get array of typeCompany
   */
    public getAllCompanyTypes() {
        return this._apiService.get('typeCompany');
    }
    /**
   * set url on get function from apiService for get array of country
   */
    public getAllCountries() {
        return this._apiService.get('country');
    }
    /**
   * set url on get function from apiService for get array of city
   */
    public getAllCities() {
        return this._apiService.get('city');
    }
    /**
   * set url on get function from apiService for get array of areas conduct
   */
    public getAllAreasConducts() {
        return this._apiService.get('areas_conduct');
    }
    /**
  * set url on get function from apiService for get array of company types
  */
    public getAllTypesContact() {
        return this._apiService.get('typeContact');
    }

    /**
  *
  * @param url
  * @param id
  * @param contactTypeId
  * @param text
  */
    public addContact(url, id, contactTypeId, text) {
        return this._apiService.post(url + '/contact/' + id, {
            'ContactTypeId': contactTypeId,
            'Text': text
        });
    }

    public deleteContact(id) {
        return this._apiService.delete('employee/contact/' + id);
    }

    /**
     *
     * @param url -url post function
     * @param name -body value of post function from apiService
     */
    public addObject(url, name) {
        return this._apiService.post(url, { 'Name': name });
    }

    public updateObject(url, data) {
        return this._apiService.put(url, data);
    }

    public updateSortIndexObject(url, data) {
        return this._apiService.put(url, data);
    }

    public addTypeProject(url, name, mode) {
        return this._apiService.post(url, { 'Name': name, 'Mode': mode });
    }

    /**
     *
     * @param url -url post function
     * @param name -body value of post function from apiService
     */
    public addCityByCountry(url, data) {
        return this._apiService.post(url, data);
    }

    public updateCityByCountry(data) {
        return this._apiService.put('city', data);
    }
    /**
    *
    * @param id
    */
    public deleteObjectById(url) {
        return this._apiService.delete(url);
    }
    /**
     * set url of get function from apiService for get array of company
     */
    public getAllProjects() {
        return this._apiService.get('project');
    }

    /**
     *
     * @param name
     * @param surname
     * @param positionId
     * @param username
     * @param password
     * @param birthday
     * @param email
     * @param contactArray
     */
    public addEmployee(
        name: string,
        surname: string,
        positionId: number,
        username: string,
        password: string,
        birthday: string,
        email: string,
        contactArray: Array<{ 'ContactTypeId': number, 'Text': string }>,
        departmentId: number,
        genderId: number,
        dateStartWork: string,
        salary: number,
        description: string,
        individualPlan: number,
        vacationDays: number,
        isBlocked) {
        return this._apiService.post('employee', {
            'Name': name,
            'Surname': surname,
            'PositionId': positionId,
            'Username': username,
            'Password': password,
            'Birthday': birthday,
            'Email': email,
            'DepartmentId': departmentId,
            'GenderId': genderId,
            'DateStartWork': dateStartWork,
            'Salary': salary,
            'Description': description,
            'Contact': contactArray,
            'IndividualPlan': individualPlan,
            'VacationDays': vacationDays,
            'isBlocked': isBlocked
        });
    }
    /**
     *
     * @param id -employee id
     * @param contactTypeId -contact type id
     * @param text -value of contact
     */
    public addEmployeeContact(id, contactTypeId, text) {
        return this._apiService.post('employee/contact/' + id, {
            'ContactTypeId': contactTypeId,
            'Text': text
        });
    }
    /**
     *
     * @param employeeId
     * @param name
     * @param surname
     * @param positionId
     * @param username
     * @param password
     * @param birthday
     * @param email
     */
    public changeEmployee(
        employeeId: number,
        name: string,
        surname: string,
        positionId: number,
        username: string,
        password: string,
        birthday: string,
        email: string,
        departmentId: number,
        genderId: number,
        dateStartWork: string,
        salary: number,
        description: string,
        individualPlan: number,
        vacationDays: number,
        isBlocked) {
        return this._apiService.put('employee', {
            'Id': employeeId,
            'Name': name,
            'Surname': surname,
            'PositionId': positionId,
            'Username': username,
            'Password': password,
            'Birthday': birthday,
            'Email': email,
            'GenderId': genderId,
            'DateStartWork': dateStartWork,
            'Salary': salary,
            'Description': description,
            'DepartmentId': departmentId,
            'IndividualPlan': individualPlan,
            'VacationDays': vacationDays,
            'isBlocked': isBlocked
        });
    }

    /**
     *
     * @param employeeId
     */
    public getEmployeeImage(employeeId) {
        return this._apiService.get('employee/image/' + employeeId);
    }

    public updateEmployeeActive(data) {
        return this._apiService.put('employee/active', data);
    }

    /**
     * add image
     * @param id
     */
    public addImage(id, body) {
        return this._apiService.postFormData('employee/image/' + id, body, 'response', 'text');
    }

    /**
     * add manager image
     * @param id
     */
    public addManagerImage(id, body) {
        return this._apiService.postFormData('managers/image/' + id, body, 'response', 'text');
    }

    /**
     *
     * @param categoryName
     */
    public getCategoryByName(categoryName: string) {
        return this._apiService.get(categoryName);
    }
    /**
     *
     * @param id employee id
     */
    public deleteEmployeeById(id) {
        return this._apiService.delete('employee/' + id);
    }
    /**
     *
     * @param id employee id
     */
    public getEmployeeProject(id) {
        return this._apiService.get('employees/projects/' + id);
    }

    public getAllAccountProcessing() {
        return this._apiService.get('account-processing');
    }

    public getAccountProcessing(id) {
        return this._apiService.get('account-processing/' + id);
    }

    public saveAccountProcessing(id, data) {
        return this._apiService.post(`account-processing/${id}`, data);
    }

    public deleteAccountProcessing(id) {
        return this._apiService.delete('account-processing/' + id);
    }

    public updateAccountProcessing(id, data) {
        return this._apiService.put(`account-processing/${id}`, data);
    }

    public getAllAccountTrip() {
        return this._apiService.get('account-trip');
    }

    public getAccountTrip(id) {
        return this._apiService.get('account-trip/' + id);
    }

    public saveAccountTrip(id, data) {
        return this._apiService.post(`account-trip/${id}`, data);
    }

    public deleteAccountTrip(id) {
        return this._apiService.delete('account-trip/' + id);
    }

    public updateAccountTrip(id, data) {
        return this._apiService.put(`account-trip/${id}`, data);
    }

    public getAllAccountDayOff() {
        return this._apiService.get('account-day-off');
    }

    public getAccountDayOff(id) {
        return this._apiService.get('account-day-off/' + id);
    }

    public getAccountDayOffByYear(id, year) {
        return this._apiService.get(`account-day-off/${id}/year/${year}`);
    }

    public saveAccountDayOff(data) {
        return this._apiService.post('account-day-off', data);
    }

    public deleteAccountDayOff(id) {
        return this._apiService.delete('account-day-off/' + id);
    }

    public updateAccountDayOff(data) {
        return this._apiService.put('account-day-off', data);
    }

    public getAllAccountVacation() {
        return this._apiService.get('account-vacation');
    }

    public getAccountVacation(id) {
        return this._apiService.get('account-vacation/' + id);
    }

    public getAccountVacationByYear(id, year) {
        return this._apiService.get(`account-vacation/${id}/year/${year}`);
    }

    public saveAccountVacation(data) {
        return this._apiService.post('account-vacation', data);
    }

    public deleteAccountVacation(id) {
        return this._apiService.delete('account-vacation/' + id);
    }

    public updateAccountVacation(data) {
        return this._apiService.put('account-vacation', data);
    }

    public getTreeRoles(id) {
        return this._apiService.get(`roles/${id}`);
    }

    public getAllPlans() {
        return this._apiService.get('plan');
    }

    public getOnePlan(id) {
        return this._apiService.get(`plan/${id}`);
    }

    public getOnePlanByDate(date) {
        return this._apiService.post(`planDate`, date);
    }

    public savePlan(data) {
        return this._apiService.post(`plan`, data);
    }

    public updatePlan(data) {
        return this._apiService.put(`plan`, data);
    }

    public deleteOnePlan(id) {
        return this._apiService.delete(`plan/${id}`);
    }

    public getAllLegalPersonISG() {
        return this._apiService.get('legal-person-isg');
    }

    public getOneLegalPersonISG(id) {
        return this._apiService.get(`legal-person-isg/${id}`);
    }

    public saveLegalPersonISG(data) {
        return this._apiService.post(`legal-person-isg`, data);
    }

    public updateLegalPersonISG(data) {
        return this._apiService.put(`legal-person-isg`, data);
    }

    public deleteOneLegalPersonISG(id) {
        return this._apiService.delete(`legal-person-isg/${id}`);
    }

    public getValueReminder() {
        return this._apiService.get('reminder');
    }

    public updateValueReminder(data) {
        return this._apiService.put('reminder', data);
    }

    public getOneRigths(Id, StatusId) {
        return this._apiService.get(`rights/${Id}/${StatusId}`);
    }

    public saveRights(data) {
        return this._apiService.post('rights', data);
    }

    public saveRightsAccess(body) {
        return this._apiService.post('rights-access', body);
    }

    public getRightsAccess(Id) {
        return this._apiService.get(`rights-access/${Id}`);
    }

    public getAllFinanceStatus() {
        return this._apiService.get('financeStatus');
    }
}
