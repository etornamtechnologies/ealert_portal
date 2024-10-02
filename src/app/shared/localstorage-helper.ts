import CryptoJS from 'crypto-js';

export class AppStore {

    private static secretKey = "2F6f9Kn13cL7Ekbvt6f9Kn13cSicIt6vHFFa2NjVOYirt0es7UZM4Y0Urn6GwGd2";

    constructor(){}

    private static prefix : string = "XMOBILEADMIN_";
    
    public static get (key : string) : string {
        const encodedKey = btoa(key);
        const storageKey = `${this.prefix}${encodedKey}`;
        const encryptedValue = localStorage.getItem(storageKey);
        if (encryptedValue !== null) {
            return this.decrypt(encryptedValue);
        }
        return null;
    }

    
    public static set (key : string, value : string) : void {
        const encodedKey = btoa(key);
        const storageKey = `${this.prefix}${encodedKey}`;
        const encryptedValue = this.encrypt(value);
        localStorage.setItem(storageKey,encryptedValue);
    }

    public static remove (key : string) : void {
        const encodedKey = btoa(key);
        const storageKey = `${this.prefix}${encodedKey}`;
        localStorage.removeItem(storageKey);
    }

    public static clear () : void {
        localStorage.clear();
    }

    private static encrypt(value : string) : string{
        return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
    }
    
    private static decrypt(textToDecrypt : string){
        return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
    }
    
}