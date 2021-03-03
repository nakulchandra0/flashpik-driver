import Utility from './utility';

export default class ApiService {
    constructor() {
        viewUtils = new Utility()
    }

    executeApi(url, methodName, params, callBack) {   
        viewUtils.isInternetConnected((isConnected) => {    
            if (isConnected) {
                console.log("Url  => " + url);
                console.log("Params  => " + params);
                
                try {
                    fetch(url, {
                        method: methodName,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: params,
                    })
                    .then((response) => {    
                        console.log("Response Status : "+response.status);
                        return response.json();
                    })
                    .then((responseJson) => {   
                        var response = JSON.parse(JSON.stringify(responseJson));
                        console.warn("Response  => " + JSON.stringify(responseJson));
                        if (callBack != null) {
                            callBack("", response);
                        }
                    })
                    .catch((error) => {
                            console.log("Response 1 => " + error.toString());
                        if (callBack != null) {
                            callBack("Error: " + error.toString(), "");
                        }
                    });
                } catch (errors) {
                    if (callBack != null) {
                        callBack("Error: " + error.toString(), "");
                    }
                }
            }
            else {
                //viewUtils.showToast("No internet connection, please try after some time.")
                if (callBack != null) {
                    callBack("Whoops! No internet connection, please try after some time.", "");
                }
            }
        }); 
    }

    executeFormApi(url, methodName, params, callBack) {   
        viewUtils.isInternetConnected((isConnected) => {  
            if (isConnected) {
                console.log("Url  => " + url);
                //console.log("Params  => " + JSON.stringify(params));
                try {
                    fetch(url, {
                        method: methodName, 
                        body: params,
                    })
                        .then(response => response.json()) 
                         .then(responseJson => {   
                            var response = JSON.parse(JSON.stringify(responseJson));
                            //console.log("Response  => " + JSON.stringify(responseJson));
                            if (callBack != null) {
                                callBack("", response);
                            }
                        })
                        .catch((error) => {
                            //console.log("Response 1 => " + error.toString());
                            if (callBack != null) {
                                callBack("Error: " + error.toString(), "");
                            }
                        });
                } catch (errors) {
                    if (callBack != null) {
                        callBack("Error: " + error.toString(), "");
                    }
                }
            }
            else {
                viewUtils.showToast("No internet connection, please try after some time.")
                if (callBack != null) {
                    callBack("Error: " + "No internet connection, please try after some time.", "");
                }
            }
        });
    }


    
}
