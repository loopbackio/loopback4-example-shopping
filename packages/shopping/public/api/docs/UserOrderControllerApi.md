# Loopback4ExampleShopping.UserOrderControllerApi

All URIs are relative to *http://127.0.0.1:3000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**userOrderControllerCreateOrder**](UserOrderControllerApi.md#userOrderControllerCreateOrder) | **POST** /users/{userId}/orders | 
[**userOrderControllerDeleteOrders**](UserOrderControllerApi.md#userOrderControllerDeleteOrders) | **DELETE** /users/{userId}/orders | 
[**userOrderControllerFindOrders**](UserOrderControllerApi.md#userOrderControllerFindOrders) | **GET** /users/{userId}/orders | 
[**userOrderControllerPatchOrders**](UserOrderControllerApi.md#userOrderControllerPatchOrders) | **PATCH** /users/{userId}/orders | 



## userOrderControllerCreateOrder

> Order userOrderControllerCreateOrder(userId, opts)



### Example

```javascript
import Loopback4ExampleShopping from 'loopback4_example_shopping';

let apiInstance = new Loopback4ExampleShopping.UserOrderControllerApi();
let userId = "userId_example"; // String | 
let opts = {
  'order': new Loopback4ExampleShopping.Order() // Order | 
};
apiInstance.userOrderControllerCreateOrder(userId, opts, (error, data, response) => {
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
 **userId** | **String**|  | 
 **order** | [**Order**](Order.md)|  | [optional] 

### Return type

[**Order**](Order.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## userOrderControllerDeleteOrders

> LoopbackCount userOrderControllerDeleteOrders(userId, opts)



### Example

```javascript
import Loopback4ExampleShopping from 'loopback4_example_shopping';

let apiInstance = new Loopback4ExampleShopping.UserOrderControllerApi();
let userId = "userId_example"; // String | 
let opts = {
  'where': "where_example" // String | 
};
apiInstance.userOrderControllerDeleteOrders(userId, opts, (error, data, response) => {
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
 **userId** | **String**|  | 
 **where** | **String**|  | [optional] 

### Return type

[**LoopbackCount**](LoopbackCount.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## userOrderControllerFindOrders

> [Order] userOrderControllerFindOrders(userId, opts)



### Example

```javascript
import Loopback4ExampleShopping from 'loopback4_example_shopping';

let apiInstance = new Loopback4ExampleShopping.UserOrderControllerApi();
let userId = "userId_example"; // String | 
let opts = {
  'filter': "filter_example" // String | 
};
apiInstance.userOrderControllerFindOrders(userId, opts, (error, data, response) => {
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
 **userId** | **String**|  | 
 **filter** | **String**|  | [optional] 

### Return type

[**[Order]**](Order.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## userOrderControllerPatchOrders

> LoopbackCount userOrderControllerPatchOrders(userId, opts)



### Example

```javascript
import Loopback4ExampleShopping from 'loopback4_example_shopping';

let apiInstance = new Loopback4ExampleShopping.UserOrderControllerApi();
let userId = "userId_example"; // String | 
let opts = {
  'where': "where_example", // String | 
  'body': null // Object | 
};
apiInstance.userOrderControllerPatchOrders(userId, opts, (error, data, response) => {
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
 **userId** | **String**|  | 
 **where** | **String**|  | [optional] 
 **body** | **Object**|  | [optional] 

### Return type

[**LoopbackCount**](LoopbackCount.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

