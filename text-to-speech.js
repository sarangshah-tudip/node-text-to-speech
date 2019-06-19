// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Import other required libraries
const fs = require('fs');
const util = require('util');

module.exports = {
    /**
     * ssmlGender: ['SSML_VOICE_GENDER_UNSPECIFIED', 'MALE', 'FEMALE', 'NEUTRAL']
     * language: ['Danish', 'Dutch', 'English', 'French', 'German', 'Italian', 'Japanese', 'Korean', 'Norwegian', 'Polish', 'Portuguese', 'Russian', 'Slovak', 'Spanish', 'Swedish', 'Turkish', 'Ukrainian']
     * languageCode: ['da-DK', 'nl-NL', 'en-AU', 'en-GB', 'en-US', 'fr-CA', 'fr-FR', 'de-DE', 'it-IT', 'ja-JP', 'ko-KR', 'nb-NO', 'pl-PL', 'pt-BR', 'pt-PT', 'ru-RU', 'sk-SK', 'es-ES', 'sv-SE', 'tr-TR', 'uk-UA']
     * audioEncoding: ['MP3', 'FLAC', 'LINEAR16', 'MULAW', 'AMR', 'AMR_WB', 'OGG_OPUS', 'SPEEX_WITH_HEADER_BYTE']
     * Note: FLAC is both an audio codec and an audio file format. To transcribe audio files using FLAC encoding, you must provide them in the .FLAC file format, which includes a header containing metadata.
     * Note: Cloud Speech-to-Text supports WAV files with LINEAR16 or MULAW encoded audio.
     */
    main: async (textParam, languageParam, ssmlGenderParam, audioEncodingParam, fileLocationParam, fileNameParam) => {
        if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            console.log(new Error(`Please set GOOGLE_APPLICATION_CREDENTIALS environment configuration.`));
            process.exit();
        }
        // Creates a client
        const client = new textToSpeech.TextToSpeechClient();

        // The text to synthesize
        const text = textParam ? textParam : `Hello, world! This is text to speech convertion project`;

        // Construct the request
        const request = {
            input: {text: text},
            // Select the language and SSML Voice Gender (optional)
            voice: {
                languageCode: languageParam ? languageParam : `en-US`,
                ssmlGender: ssmlGenderParam ? ssmlGenderParam : `NEUTRAL`
            },
            // Select the type of audio encoding
            audioConfig: {audioEncoding: audioEncodingParam ? audioEncodingParam : `MP3`},
        };

        // Performs the Text-to-Speech request
        const [response] = await client.synthesizeSpeech(request);
        // Write the binary audio content to a local file
        const writeFile = util.promisify(fs.writeFile);
        const fileName = fileNameParam ? `${fileNameParam}.${request.audioConfig.audioEncoding}` : `audiooutput.mp3`;
        const fileLocationDir = fileLocationParam ? fileLocationParam : `./speechAudio/`;
        await writeFile(`${fileLocationDir}${fileName}`, response.audioContent, `binary`);
        console.log(`Audio content written to file: `, fileName);
    }
}