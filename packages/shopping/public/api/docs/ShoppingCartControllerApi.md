# Loopback4ExampleShopping.ShoppingCartControllerApi

All URIs are relative to *http://127.0.0.1:3000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**shoppingCartControllerAddItem**](ShoppingCartControllerApi.md#shoppingCartControllerAddItem) | **POST** /shoppingCarts/{userId}/items | 
[**shoppingCartControllerGet**](ShoppingCartControllerApi.md#shoppingCartControllerGet) | **GET** /shoppingCarts/{userId} | 
[**shoppingCartControllerRemove**](ShoppingCartControllerApi.md#shoppingCartControllerRemove) | **DELETE** /shoppingCarts/{userId} | 
[**shoppingCartControllerSet**](ShoppingCartControllerApi.md#shoppingCartControllerSet) | **PUT** /shoppingCarts/{userId} | 



## shoppingCartControllerAddItem

> ShoppingCart shoppingCartControllerAddItem(userId, opts)



### Example

```javascript
import Loopback4ExampleShopping from 'loopback4_example_shopping';

let apiInstance = new Loopback4ExampleShopping.ShoppingCartControllerApi();
let userId = "userId_example"; // String | 
let opts = {
  'shoppingCartItem': new Loopback4ExampleShopping.ShoppingCartItem() // ShoppingCartItem | shopping cart item
};
apiInstance.shoppingCartControllerAddItem(userId, opts, (error, data, response) => {
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
 **shoppingCartItem** | [**ShoppingCartItem**](ShoppingCartItem.md)| shopping cart item | [optional] 

### Return type

[**ShoppingCart**](ShoppingCart.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## shoppingCartControllerGet

> ShoppingCart shoppingCartControllerGet(userId)



### Example

```javascript
import Loopback4ExampleShopping from 'loopback4_example_shopping';

let apiInstance = new Loopback4ExampleShopping.ShoppingCartControllerApi();
let userId = "userId_example"; // String | 
apiInstance.shoppingCartControllerGet(userId, (error, data, response) => {
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

[**ShoppingCart**](ShoppingCart.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## shoppingCartControllerRemove

> shoppingCartControllerRemove(userId)



### Example

```javascript
import Loopback4ExampleShopping from 'loopback4_example_shopping';

let apiInstance = new Loopback4ExampleShopping.ShoppingCartControllerApi();
let userId = "userId_example"; // String | 
apiInstance.shoppingCartControllerRemove(userId, (error, data, response) => {
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
 **userId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


## shoppingCartControllerSet

> shoppingCartControllerSet(userId, opts)



### Example

```javascript
import Loopback4ExampleShopping from 'loopback4_example_shopping';

let apiInstance = new Loopback4ExampleShopping.ShoppingCartControllerApi();
let userId = "userId_example"; // String | 
let opts = {
  'shoppingCart': new Loopback4ExampleShopping.ShoppingCart() // ShoppingCart | shopping cart
};
apiInstance.shoppingCartControllerSet(userId, opts, (error, data, response) => {
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
 **userId** | **String**|  | 
 **shoppingCart** | [**ShoppingCart**](ShoppingCart.md)| shopping cart | [optional] 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined

