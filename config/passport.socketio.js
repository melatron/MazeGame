
module.exports = function (options) {
    options.io.use(options.passportSocketIo.authorize({
        cookieParser: options.cookieParser,
        key: options.key,       // the name of the cookie where express/connect stores its session_id 
        secret: options.secret,    // the session_secret to parse the cookie 
        store: options.sessionStore,        // we NEED to use a sessionstore. no memorystore please 
        success: onAuthorizeSuccess,  // *optional* callback on success - read more below 
        fail: onAuthorizeFail,     // *optional* callback on fail/error - read more below 
    }));
    
    function onAuthorizeFail(data, message, error, accept) {
        console.log('authorize failed!!!!!');
        // error indicates whether the fail is due to an error or just a unauthorized client
        if (error) throw new Error(message);
        // send the (not-fatal) error-message to the client and deny the connection
        return accept(new Error(message));
    }
    
    function onAuthorizeSuccess(data, accept) {
        console.log('successful connection to socket.io');
        accept();
    }

};
