import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    telegramBotToken,
    telegramChatId
} = env;

import FindComponent from "./FindComponent";

const App = () => {
    return <FindComponent />
};

export default App;