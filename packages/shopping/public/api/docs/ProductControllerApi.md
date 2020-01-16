# Loopback4ExampleShopping.ProductControllerApi

All URIs are relative to *http://127.0.0.1:3000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**productControllerCount**](ProductControllerApi.md#productControllerCount) | **GET** /products/count | 
[**productControllerCreate**](ProductControllerApi.md#productControllerCreate) | **POST** /products | 
[**productControllerDeleteById**](ProductControllerApi.md#productControllerDeleteById) | **DELETE** /products/{id} | 
[**productControllerFind**](ProductControllerApi.md#productControllerFind) | **GET** /products | 
[**productControllerFindById**](ProductControllerApi.md#productControllerFindById) | **GET** /products/{id} | 
[**productControllerReplaceById**](ProductControllerApi.md#productControllerReplaceById) | **PUT** /products/{id} | 
[**productControllerUpdateAll**](ProductControllerApi.md#productControllerUpdateAll) | **PATCH** /products | 
[**productControllerUpdateById**](ProductControllerApi.md#productControllerUpdateById) | **PATCH** /products/{id} | 



## productControllerCount

> LoopbackCount productControllerCount(opts)



### Example

```javascript
import Loopback4ExampleShopping from 'loopback4_example_shopping';

let apiInstance = new Loopback4ExampleShopping.ProductControllerApi();
let opts = {
  'where': {key: null} // {String: Object} | 
};
apiInstance.productControllerCount(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **where** | [**{String: Object}**](Object.md)|  | [optional] 

### Return type

[**LoopbackCount**](LoopbackCount.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## productControllerCreate

> Product productControllerCreate(opts)



### Example

```javascript
import Loopback4ExampleShopping from 'loopback4_example_shopping';

let apiInstance = new Loopback4ExampleShopping.ProductControllerApi();
let opts = {
  'newProduct': new Loopback4ExampleShopping.NewProduct() // NewProduct | 
};
apiInstance.productControllerCreate(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **newProduct** | [**NewProduct**](NewProduct.md)|  | [optional] 

### Return type

[**Product**](Product.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## productControllerDeleteById

> productControllerDeleteById(id)



### Example

```javascript
import Loopback4ExampleShopping from 'loopback4_example_shopping';

let apiInstance = new Loopback4ExampleShopping.ProductControllerApi();
let id = "id_example"; // String | 
apiInstance.productControllerDeleteById(id, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


## productControllerFind

> [ProductWithRelations] productControllerFind(opts)



### Example

```javascript
import Loopback4ExampleShopping from 'loopback4_example_shopping';

let apiInstance = new Loopback4ExampleShopping.ProductControllerApi();
let opts = {
  'filter': new Loopback4ExampleShopping.Filter1() // Filter1 | 
};
apiInstance.productControllerFind(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **filter** | [**Filter1**](.md)|  | [optional] 

### Return type

[**[ProductWithRelations]**](ProductWithRelations.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## productControllerFindById

> ProductWithRelations productControllerFindById(id, opts)



### Example

```javascript
import Loopback4ExampleShopping from 'loopback4_example_shopping';

let apiInstance = new Loopback4ExampleShopping.ProductControllerApi();
let id = "id_example"; // String | 
let opts = {
  'filter': new Loopback4ExampleShopping.Filter() // Filter | 
};
apiInstance.productControllerFindById(id, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **filter** | [**Filter**](.md)|  | [optional] 

### Return type

[**ProductWithRelations**](ProductWithRelations.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## productControllerReplaceById

> productControllerReplaceById(id, opts)



### Example

```javascript
import Loopback4ExampleShopping from 'loopback4_example_shopping';

let apiInstance = new Loopback4ExampleShopping.ProductControllerApi();
let id = "id_example"; // String | 
let opts = {
  'product': new Loopback4ExampleShopping.Product() // Product | 
};
apiInstance.productControllerReplaceById(id, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **product** | [**Product**](Product.md)|  | [optional] 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined


## productControllerUpdateAll

> LoopbackCount productControllerUpdateAll(opts)



### Example

```javascript
import Loopback4ExampleShopping from 'loopback4_example_shopping';

let apiInstance = new Loopback4ExampleShopping.ProductControllerApi();
let opts = {
  'where': {key: null}, // {String: Object} | 
  'productPartial': new Loopback4ExampleShopping.ProductPartial() // ProductPartial | 
};
apiInstance.productControllerUpdateAll(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **where** | [**{String: Object}**](Object.md)|  | [optional] 
 **productPartial** | [**ProductPartial**](ProductPartial.md)|  | [optional] 

### Return type

[**LoopbackCount**](LoopbackCount.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## productControllerUpdateById

> productControllerUpdateById(id, opts)



### Example

```javascript
import Loopback4ExampleShopping from 'loopback4_example_shopping';

let apiInstance = new Loopback4ExampleShopping.ProductControllerApi();
let id = "id_example"; // String | 
let opts = {
  'productPartial': new Loopback4ExampleShopping.ProductPartial() // ProductPartial | 
};
apiInstance.productControllerUpdateById(id, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **productPartial** | [**ProductPartial**](ProductPartial.md)|  | [optional] 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined

