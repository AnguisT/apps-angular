import { Injectable } from '@angular/core';
import { ApiService } from '../../../services';

@Injectable()
export class ContactsService {
    public id: number;
    constructor(private _apiService: ApiService) {
    }

    public getAllTypeContact() {
        return this._apiService.get('typeContact');
    }
    /**
   * set url of get function from apiService for  get array of sphereActivity
   */
    public getAllSphereActivity() {
        return this._apiService.get('sphereActivity');
    }
    /**
   * set url of get function from apiService for get array of company
   */
    public getAllCompany() {
        return this._apiService.get('company');
    }

    public getAllCompanies() {
        return this._apiService.get('companies');
    }

    /**
     * seach company by input text and sphere activity
     * @param body
     */
    public companySearch(body) {
        return this._apiService.post('company/search', body);
    }
    /**
     * search company by sphere activity
     * @param id sphereAcitivity id
     */
    public searchCompanyBySphereActivity(id) {
        return this._apiService.get('company/SphereActivityId/' + id);
    }
    /**
     * get all subcontractors
     */
    public getAllSubcontractor() {
        return this._apiService.get('subcontractor');
    }
    /**
     * get all managers
     */
    public getAllManagers() {
        return this._apiService.get('manager');
    }

    public getAllCountries() {
        return this._apiService.get('country');
    }

    public getAllCities() {
        return this._apiService.get('city');
    }

    /**
     *
     * @param name
     * @param sphereActivityId
     */
    public search(url, name, sphereActivityId: Array<number>) {
        return this._apiService.get(url + '/query?Name=' + name + '&SphereActivityId=[' + sphereActivityId + ']');
    }
    public searchByName(url, name) {
        return this._apiService.get(url + '/query?Name=' + name);
    }
    public searchBySphereActivity(url, sphereActivityId: Array<number>) {
        return this._apiService.get(url + '/query?SphereActivityId=[' + sphereActivityId + ']');
    }
    /**
    * set url on get function from apiService for get object of checked element of company array
    */
    public getCompnayById(id) {
        return this._apiService.get('company/' + id);
    }
    /**
   * set url on get function from apiService for get array of department
   */
    public getDepartment() {
        return this._apiService.get('department');
    }
    /**
      *
      * @param id -get company by id
      */
    public getCompanyById(id) {
        return this._apiService.get('company/' + id);
    }
    /**
     *
     * @param contracts
     * @param comanyTypeId
     * @param sphereActivityId
     * @param denomination
     * @param discountSize
     * @param partner
     * @param comments
     * @param contacts
     */
    public addCompany(contracts, comanyTypeId, sphereActivityId,
        denomination: string, discountSize: number, partner, comments, contacts: Array<{
            'ContactTypeId': 'number',
            'Text': 'String'
        }>, cityId: number, countryId: number, concurent: number, customer: number, subcontractor: number,
        companyFilial: number, companyParentId: number, isUnion: number, Status: number) {
        console.log(contacts);
        return this._apiService.post('company', {
            'Contracts': contracts,
            'SphereActivityId': sphereActivityId,
            'Comments': comments,
            'CompanyTypeId': comanyTypeId,
            'Denomination': denomination,
            'DiscountSize': discountSize,
            'Partner': partner,
            'Contact': contacts,
            'CityId': cityId,
            'CountryId': countryId,
            'Concurent': concurent,
            'Customer': customer,
            'Subcontractor': subcontractor,
            'isFilial': companyFilial,
            'CompanyParentId': companyParentId,
            'isUnion': isUnion,
            'Status': Status,
        });
    }
    /**
    *
    * @param companyId -company id
    * @param filialName - filial  name
    */
    public addFilial(companyId: number, filialName: string) {
        return this._apiService.post('company/filial', {
            'CompanyId': companyId,
            'Name': filialName
        });
    }
    /**
     *
     * @param companyId
     * @param departamentName
     */
    public addDepartamnet(companyId, departamentName, contacts, description) {
        return this._apiService.post('/company/department', {
            'CompanyId': companyId,
            'Name': departamentName,
            'Contacts': contacts,
            'Description': description,
        });
    }

    public updateDepartamnet(companyId, departamentName, contacts, description) {
        return this._apiService.put('company/department', {
            'DepartmentId': companyId,
            'Name': departamentName,
            'Contacts': contacts,
            'Description': description,
        });
    }
    /**
     *
     * @param departamentId
     */
    public deleteDepartamnet(Id) {
        return this._apiService.delete('company/department/' + Id);
    }
    public deleteDepartamnetManager(DepartmentId, ManagerId) {
        return this._apiService.delete(`/company/department/${DepartmentId}/manager/${ManagerId}`);
    }
    /**
     *
     * @param managerId
     * @param companyId
     */
    public addCompanyManager(managerId, companyId) {
        return this._apiService.post('company/manager', {
            'ManagerId': managerId,
            'CompanyId': companyId
        });
    }
    /**
     *
     * @param filialId
     * @param departamnetName
     */
    public addFilialDepartament(filialId, departamnetName) {
        return this._apiService.post('company/filial/department', {
            'FilialId': filialId,
            'Name': departamnetName
        });
    }
    /**
     *
     * @param managerId
     * @param companyId
     * @param filialId
     */
    public addFilialManager(managerId, filialId) {
        return this._apiService.post('company/filial/manager', {
            'ManagerId': managerId,
            'FilialId': filialId
        });
    }
    /**
     *
     * @param managerId
     * @param companyId
     * @param departmentId
     */
    public addDepartmentManager(managerId, departmentId) {
        return this._apiService.post('company/department/manager', {
            'ManagerId': managerId,
            'DepartmentId': departmentId
        });
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

    public deleteManagerContact(Id) {
        return this._apiService.delete(`manager/contact/${Id}`);
    }

    public deleteCompanyContact(Id) {
        return this._apiService.delete(`company/contact/${Id}`);
    }

    /**
    *
    * @param companyId
    * @param resident
    * @param comanyTypeId
    * @param denomination
    * @param partner
    * @param contract
    * @param sphereActivityId
    * @param discountSize
    * @param comments
    */
    public changeCompany(companyId: number, comanyTypeId: number, denomination: string,
        partner: number, contract: string, sphereActivityId: number, discountSize: number, comments: string, cityId: number,
        countryId: number, concurent: number, customer: number, subcontractor: number, companyFilial: number, companyParentId: number,
        isUnion: number, Status: number,
    ) {
        // console.log(concurent);
        return this._apiService.put('company', {
            'Id': companyId,
            'CompanyTypeId': comanyTypeId,
            'Denomination': denomination,
            'Partner': partner,
            'Contracts': contract,
            'SphereActivityId': sphereActivityId,
            'DiscountSize': discountSize,
            'Comments': comments,
            'CityId': cityId,
            'CountryId': countryId,
            'Concurent': concurent,
            'Customer': customer,
            'Subcontractor': subcontractor,
            'isFilial': companyFilial,
            'CompanyParentId': companyParentId,
            'isUnion': isUnion,
            'Status': Status,
        });

    }
    /**
 *
 * @param id company id
 */
    public deleteCompanyById(id) {
        return this._apiService.delete('company/' + id);
    }
    /**
    *
    * @param id subcontractor id
    */
    public getSubcontractorById(id) {
        return this._apiService.get('subcontractor/' + id);
    }
    /**
     *
     * @param name
     * @param surname
     * @param contracts
     * @param sphereActivityId
     * @param contacts
     */
    public addSubcontractor(name: string, surname: string, contracts: string, sphereActivityId: number, contacts: Array<{
        'ContactTypeId': number,
        'Text': string
    }>, lastName, comment) {
        return this._apiService.post('subcontractor', {
            'Name': name,
            'Surname': surname,
            'Contracts': contracts,
            'SphereActivityId': sphereActivityId,
            'Contact': contacts,
            'LastName': lastName,
            'Comments': comment

        });
    }
    /**
     *
     * @param id subcontractor id
     */
    public deleteSubcontractor(id) {
        return this._apiService.delete('subcontractor/' + id);
    }
    /**
     *
     * @param id manager id
     */
    public getManagerById(id) {
        return this._apiService.get('manager/' + id);
    }
    /**
     *
     * @param id manager id
     */
    public deleteManager(id) {
        return this._apiService.delete('manager/' + id);
    }
    /**
     *
     * @param name
     * @param surname
     * @param lastname
     * @param contracts
     * @param sphereActivityId
     * @param comments
     * @param contact
     */
    public addManagers(name, surname, lastname, contracts, sphereActivityId, comments, contact: Array<{
        'ContactTypeId': 'number',
        'Text': 'String'
    }>) {
        return this._apiService.post('manager', {
            'Name': name,
            'Surname': surname,
            'LastName': lastname,
            'Contracts': contracts,
            'SphereActivityId': sphereActivityId,
            'Comments': comments,
            'Contact': contact
        });
    }
    /**
     *
     * @param url
     * @param name
     * @param surname
     * @param lastName
     * @param contracts
     * @param sphereActivityId
     * @param comments
     */
    public changeSubcontractorOrManager(url, id, name, surname, lastName, contracts, sphereActivityId, comments) {
        return this._apiService.put(url, {
            'Id': id,
            'Name': name,
            'Surname': surname,
            'LastName': lastName,
            'Contracts': contracts,
            'SphereActivityId': sphereActivityId,
            'Comments': comments
        });
    }
    /**
     *
     * @param companyId
     * @param contracts
     */
    public addCompanyContract(companyId: number, contracts: string) {
        return this._apiService.post('company/contracts', {
            'CompanyId': companyId,
            'Contracts': contracts
        });
    }
    /**
     *
     * @param subcontractorId
     * @param contracts
     */
    public addSubcontractorContract(subcontractorId: number, contracts: string) {
        return this._apiService.post('subcontractor/contracts', {
            'SubcontractorId': subcontractorId,
            'Contracts': contracts
        });
    }
    /**
     *
     * @param managerId
     * @param contracts
     */
    public addManagerContract(managerId, contracts) {
        return this._apiService.post('manager/contracts', {
            'ManagerId': managerId,
            'Contracts': contracts
        });
    }
    /**
     *
     * @param id
     */
    public getCompanyProject(id) {
        return this._apiService.get('projects/company/' + id);
    }
    /**
* set url on get function from apiService for get array of typeCompany
*/
    public getAllCompanyTypes() {
        return this._apiService.get('typeCompany');
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
     */
    public getProjectList(url, id) {
        return this._apiService.get(url + '/projects/' + id);
    }

    public getLegalEntities(id: number) {
        return this._apiService.get('company/legal-person/' + id);
    }

    public getLegalEntityTypes() {
        return this._apiService.get('company/legal-person-types');
    }

    public getTaxaties() {
        return this._apiService.get('company/legal-person-taxaties');
    }

    public saveLegalEntity(entity) {
        return this._apiService.post('company/legal-person', entity);
    }

    public updateLegalEntity(entity) {
        return this._apiService.put('company/legal-person', entity);
    }

    public updateManager(data) {
        return this._apiService.put('manager', data);
    }

    public addManager(data) {
        return this._apiService.post('manager', data);
    }

    public deleteLegalEntities(id: number) {
        return this._apiService.delete('company/legal-person/' + id);
    }

    public getManagerExportExcel() {
        return this._apiService.get('manager-export-excel');
    }

    public getCompanyExportExcel(isSub) {
        return this._apiService.get(`company-export-excel/${isSub}`);
    }

    public getOneCompanyExportExcel(Id) {
        return this._apiService.get(`company-export-excel/one/${Id}`);
    }
}
