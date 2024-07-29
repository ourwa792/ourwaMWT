// المسار: /src/config/wolframAlpha.js
const axios = require('axios');
const wolframApiKey = 'T6YRT5-7G4QGAUYRL';  // قم بتغيير 'YOUR_APP_ID' إلى المفتاح الخاص بك من Wolfram Alpha

const waApi = {
    async getShortAnswer(query) {
        const url = `https://api.wolframalpha.com/v1/result?appid=${wolframApiKey}&i=${encodeURIComponent(query)}`;
        const response = await axios.get(url);
        return response.data;
    }
};

module.exports = waApi