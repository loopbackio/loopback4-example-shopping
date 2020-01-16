/**
 * loopback4-example-shopping
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.1.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */

import ApiClient from '../ApiClient';
import ProductsIdFields from './ProductsIdFields';

/**
 * The Filter1 model module.
 * @module model/Filter1
 * @version 1.1.1
 */
class Filter1 {
    /**
     * Constructs a new <code>Filter1</code>.
     * @alias module:model/Filter1
     */
    constructor() { 
        
        Filter1.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>Filter1</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Filter1} obj Optional instance to populate.
     * @return {module:model/Filter1} The populated <code>Filter1</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new Filter1();

            if (data.hasOwnProperty('where')) {
                obj['where'] = ApiClient.convertToType(data['where'], {'String': Object});
            }
            if (data.hasOwnProperty('fields')) {
                obj['fields'] = ProductsIdFields.constructFromObject(data['fields']);
            }
            if (data.hasOwnProperty('offset')) {
                obj['offset'] = ApiClient.convertToType(data['offset'], 'Number');
            }
            if (data.hasOwnProperty('limit')) {
                obj['limit'] = ApiClient.convertToType(data['limit'], 'Number');
            }
            if (data.hasOwnProperty('skip')) {
                obj['skip'] = ApiClient.convertToType(data['skip'], 'Number');
            }
            if (data.hasOwnProperty('order')) {
                obj['order'] = ApiClient.convertToType(data['order'], ['String']);
            }
        }
        return obj;
    }


}

/**
 * @member {Object.<String, Object>} where
 */
Filter1.prototype['where'] = undefined;

/**
 * @member {module:model/ProductsIdFields} fields
 */
Filter1.prototype['fields'] = undefined;

/**
 * @member {Number} offset
 */
Filter1.prototype['offset'] = undefined;

/**
 * @member {Number} limit
 */
Filter1.prototype['limit'] = undefined;

/**
 * @member {Number} skip
 */
Filter1.prototype['skip'] = undefined;

/**
 * @member {Array.<String>} order
 */
Filter1.prototype['order'] = undefined;






export default Filter1;

