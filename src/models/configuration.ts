// tslint:disable
/**
 * TEPID
 * The API for the TEPID Print server by the McGill Science Computer TaskForce. Tell us what we can do better on [github](https://github.com/ctf/tepid-server/).
 *
 * OpenAPI spec version: 1.02.00
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface ConfigurationParameters {
    apiKey?: string | ((name: string) => string);
    username?: string;
    password?: string;
    accessToken?: string | ((name: string, scopes?: string[]) => string);
    basePath?: string;
    baseOptions?: any;
}

export class Configuration {
    /**
     * parameter for apiKey security
     * @param name security name
     * @memberof Configuration
     */
    apiKey?: string | ((name: string) => string);
    /**
     * parameter for basic security
     * 
     * @type {string}
     * @memberof Configuration
     */
    username?: string;
    /**
     * parameter for basic security
     * 
     * @type {string}
     * @memberof Configuration
     */
    password?: string;
    /**
     * parameter for oauth2 security
     * @param name security name
     * @param scopes oauth2 scope
     * @memberof Configuration
     */
    accessToken?: string | ((name: string, scopes?: string[]) => string);
    /**
     * override base path
     * 
     * @type {string}
     * @memberof Configuration
     */
    basePath?: string;
    /**
     * base options for fetch calls
     *
     * @type {any}
     * @memberof Configuration
     */
    baseOptions?: any;

    constructor(param: ConfigurationParameters = {}) {
        this.apiKey = param.apiKey;
        this.username = param.username;
        this.password = param.password;
        this.accessToken = param.accessToken;
        this.basePath = param.basePath;
    }
}
