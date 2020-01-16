# Loopback4ExampleShopping.PingControllerApi

All URIs are relative to *http://127.0.0.1:3000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**pingControllerPing**](PingControllerApi.md#pingControllerPing) | **GET** /ping | 



## pingControllerPing

> InlineResponse200 pingControllerPing()



### Example

```javascript
import Loopback4ExampleShopping from 'loopback4_example_shopping';

let apiInstance = new Loopback4ExampleShopping.PingControllerApi();
apiInstance.pingControllerPing((error, data, response) => {
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

[**InlineResponse200**](InlineResponse200.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

