/**
 * Stores and retrieves the apiKey from the session storage of the user's browser. 
 */
let Login = {
	_APIKey: "mapboxAPIKey",

	// This method returns the message to display to the user: either an error
	// message or a blank element to indicate that the API key was stored successfully.
    storeAPIKey: function(apiKey) {
    	if((apiKey.trim() === "") ||
    	   (apiKey == null) ||
    	   (apiKey == undefined)) {
    		const errorMessage = "<p>The API key must have a value.</p>";
    		console.log(errorMessage);
    		return errorMessage;
    	}
    	sessionStorage.setItem(this._APIKey, apiKey);
    	return "<p>&nbsp;</p>";
    },

	retrieveAPIKey: function() {
		return sessionStorage.getItem(this._APIKey);
	},
    
    isAPIKeySet: function() {
    	const APIKey = this.retrieveAPIKey();
    	return (APIKey != null);
    }
}