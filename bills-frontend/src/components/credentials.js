import firebase from 'firebase/app'
import 'firebase/storage'

/* Base URL for APIs */
export const base_url = process.env.REACT_APP_BACKEND_URL;

/* Google Client ID */
export const google_client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID;

/* Facebook Client ID */
export const facebook_client_id = process.env.REACT_APP_FACEBOOK_CLIENT_ID;

/* Firebase Configurations */
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.appspot.com`,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

firebase.initializeApp(firebaseConfig);
export const storage = firebase.storage();

/* Firebase URL for default profile picture */
export const default_avatar = 'https://firebasestorage.googleapis.com/v0/b/firstreactapp-f0586.appspot.com/o/images%2Fdefault-icon%2Fuser-icon.png?alt=media&token=72ce6825-582a-47f6-a9cc-cad6a3b255f5';

/* Item - Rate pattern */
export const itemRatePattern = "^[0-9]+(\.[0-9]{0,2})?$";

/* Item - Quantity pattern */
export const itemQuantityPattern = "^[0-9]+(\.[0-9]{0,3})?$";

/* Table Icons Size */
export const iconsSize = 20;

/* Allowed files extensions */
export const allowedExtensionsForFile = /(\.jpg|\.jpeg|\.png|\.gif|\.xlsx|\.xls|\.doc|\.docx|\.ppt|\.pptx|\.txt|\.pdf)$/i; 
export const allowedExtensionsForImage = /(\.jpg|\.jpeg|\.png)$/i; 

/* Speech Rocognition object */
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-IN'

export default mic;

export const cleanQuillText = async (text) => {
    let text1 = await text.replaceAll("<br>", "<br/>");
    let text2 = await text1.replace("<div class=\"ql-editor\" data-gramm=\"false\" contenteditable=\"true\">", "");
    let text3 = await text2.replace("</div><div class=\"ql-clipboard\" contenteditable=\"true\" tabindex=\"-1\"></div><div class=\"ql-tooltip ql-hidden\"><a class=\"ql-preview\" rel=\"noopener noreferrer\" target=\"_blank\" href=\"about:blank\"></a><input type=\"text\" data-formula=\"e=mc^2\" data-link=\"https://quilljs.com\" data-video=\"Embed URL\"><a class=\"ql-action\"></a><a class=\"ql-remove\"></a></div>", "");
    let text4 = await text3.replace("<div class=\"ql-editor ql-blank\" data-gramm=\"false\" contenteditable=\"true\">", "");
    let text5 = await text4.replaceAll("<p><br/></p>", "");
    if (text5.length >= 7) {
        return text4;
    }
    return "<p></p>";
}