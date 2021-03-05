import firebase from 'firebase/app'
import 'firebase/storage'

/* Base URL for APIs */
export const base_url = 'http://127.0.0.1:8000';


const firebaseConfig = {
    apiKey: "AIzaSyAkA9ynjz_t0uw_wIzicmgtQxqWY6pz0X4",
    authDomain: "firstreactapp-f0586.firebaseapp.com",
    projectId: "firstreactapp-f0586",
    storageBucket: "firstreactapp-f0586.appspot.com",
    messagingSenderId: "64161067812",
    appId: "1:64161067812:web:66c11f6a812cd07ef939b1"
};

firebase.initializeApp(firebaseConfig);
export const storage = firebase.storage();

/* Firebase URL for default profile picture */
export const default_avatar = 'https://firebasestorage.googleapis.com/v0/b/firstreactapp-f0586.appspot.com/o/images%2Fdefault-icon%2Fuser-icon.png?alt=media&token=72ce6825-582a-47f6-a9cc-cad6a3b255f5';

/* Item - Rate pattern */
export const itemRatePattern = "^[0-9]+(\.[0-9]{0,2})?$";

/* Item - Quantity pattern */
export const itemQuantityPattern = "^[0-9]+(\.[0-9]{0,3})?$";

/* Email Default Data */
export const email_default_subject = 'Dino Store Bill';
export const email_default_body = 'Please find your bill attached to this email.';

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