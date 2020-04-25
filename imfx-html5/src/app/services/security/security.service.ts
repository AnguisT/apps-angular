/**
 * Created by Sergey Trizna on 16.02.2017.
 */
import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {PermissionService} from '../permission/permission.service';
import {ConfigService} from "../config/config.service";
import {ArrayProvider} from "../../providers/common/array.provider";
import { appRouter } from '../../constants/appRouter';

@Injectable()
export class SecurityService {
    private userPermissions;

    constructor(private arrayProvider: ArrayProvider,
                private router: Router) {
    }

    /**
     * Return list of permissions
     * @returns {any|Array}
     */
    public getPermissions(): {
        paths: Array<string>,
        names: Array<string>,
    }|any {
        if (!this.userPermissions) {
            console.error('Permissions not available');
            return this.router.navigate([appRouter.logout]);

        }

        return this.userPermissions;
    }

    /**
     * Store permissions
     * @param permissions
     */
    public setPermissions(permissions: Array<number> = []): void {
        this.userPermissions = this.buildPermissions(permissions);
        // this.storage.store(this.storagePrefix, this.userPermissions);
    }

    /**
     * Return has or no permissions by name
     * @param name - name of component or module
     */
    public hasPermissionByName(name: string): boolean {
        let userPermissions = this.getPermissions();

        // for example: if name == 'media-basket' then true was returned for media and for media-basket
        // TODO refact if it incorrect
        return userPermissions.names?userPermissions.names.indexOf(name) > -1:false;
    }

    /**
     * Return has or no permissions by name
     * @param path - path name
     */
    public hasPermissionByPath(path: string): boolean {
        let userPermissions = this.getPermissions();

        // for example: if name == 'media-basket' then true was returned for media and for media-basket
        // TODO refact if it incorrect
        if (userPermissions && userPermissions.paths && userPermissions.paths.length > 0) {
            return userPermissions.paths.indexOf(path) > -1;
        }

        return false;
    }

    /**
     * Build list of permissions use array of permissions number
     * @param permissions
     * @returns {{paths: Array, names: Array}}
     */
    private buildPermissions(permissions: Array<number> = []): {paths: Array<string>, names: Array<string>} {
        permissions.push(0); // common settings
        let gPerms = PermissionService.getPermissionsMap();
        let uPerms = {
            paths: [],
            names: [],
        };

        permissions.forEach((perm) => {
            if (gPerms[perm]) {
                uPerms.paths = this.arrayProvider.merge(uPerms.paths, gPerms[perm].paths, {unique: true});
                uPerms.names = this.arrayProvider.merge(uPerms.names, gPerms[perm].names, {unique: true});
            }
        });

        return uPerms;
    }
}
