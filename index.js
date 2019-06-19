const textToSpeech = require('./text-to-speech');

textToSpeech.main().catch(console.error);

textToSpeech.main('Hi All, Good Evening! Welcome to text to speech demo.', 'en-US', 'NEUTRAL', 'MP3', './speechAudio/', 'audioOutput').catch(console.error);