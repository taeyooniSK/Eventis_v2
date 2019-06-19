import React from 'react';

export default React.createContext({
    token: null,
    userId: null,
    login : (token, email, userId, tokenExpiration) => {}, // this does nothing but helpful for autocompletion
    logout: () => {}
});