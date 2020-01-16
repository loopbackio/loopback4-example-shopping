# Loopback4ExampleShopping.UserControllerApi

All URIs are relative to *http://127.0.0.1:3000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**userControllerCreate**](UserControllerApi.md#userControllerCreate) | **POST** /users | 
[**userControllerFindById**](UserControllerApi.md#userControllerFindById) | **GET** /users/{userId} | 
[**userControllerLogin**](UserControllerApi.md#userControllerLogin) | **POST** /users/login | 
[**userControllerPrintCurrentUser**](UserControllerApi.md#userControllerPrintCurrentUser) | **GET** /users/me | 
[**userControllerProductRecommendations**](UserControllerApi.md#userControllerProductRecommendations) | **GET** /users/{userId}/recommend | 



## userControllerCreate

> User userControllerCreate(opts)



### Example

```javascript
import Loopback4ExampleShopping from 'loopback4_example_shopping';

let apiInstance = new Loopback4ExampleShopping.UserControllerApi();
let opts = {
  'newUser': new Loopback4ExampleShopping.NewUser() // NewUser | 
};
apiInstance.userControllerCreate(opts, (error, data, response) => {
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
 **newUser** | [**NewUser**](NewUser.md)|  | [optional] 

### Return type

[**User**](User.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## userControllerFindById

> User userControllerFindById(userId)



### Example

```javascript
import Loopback4ExampleShopping from 'loopback4_example_shopping';

let apiInstance = new Loopback4ExampleShopping.UserControllerApi();
let userId = "userId_example"; // String | 
apiInstance.userControllerFindById(userId, (error, data, response) => {
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

### Return type

[**User**](User.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## userControllerLogin

> InlineResponse2001 userControllerLogin(inlineObject)



### Example

```javascript
import Loopback4ExampleShopping from 'loopback4_example_shopping';

let apiInstance = new Loopback4ExampleShopping.UserControllerApi();
let inlineObject = new Loopback4ExampleShopping.InlineObject(); // InlineObject | 
apiInstance.userControllerLogin(inlineObject, (error, data, response) => {
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
 **inlineObject** | [**InlineObject**](InlineObject.md)|  | 

### Return type

[**InlineResponse2001**](InlineResponse2001.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## userControllerPrintCurrentUser

> InlineResponse2002 userControllerPrintCurrentUser()



### Example

```javascript
import Loopback4ExampleShopping from 'loopback4_example_shopping';
let defaultClient = Loopback4ExampleShopping.ApiClient.instance;
// Configure Bearer (JWT) access token for authorization: bearerAuth
let bearerAuth = defaultClient.authentications['bearerAuth'];
bearerAuth.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new Loopback4ExampleShopping.UserControllerApi();
apiInstance.userControllerPrintCurrentUser((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**InlineResponse2002**](InlineResponse2002.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## userControllerProductRecommendations

> [Product] userControllerProductRecommendations(userId)



### Example

```javascript
import Loopback4ExampleShopping from 'loopback4_example_shopping';

let apiInstance = new Loopback4ExampleShopping.UserControllerApi();
let userId = "userId_example"; // String | 
apiInstance.userControllerProductRecommendations(userId, (error, data, response) => {
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

### Return type

[**[Product]**](Product.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

