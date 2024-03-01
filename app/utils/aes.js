import CryptoJs from 'crypto-js';
import magicnotekey from '../../magicnotekey.ts';

const Encrypt = (note) => {
    return CryptoJs.AES.encrypt(note, magicnotekey).toString();
}

const Decrypt = (note) => {
    return CryptoJs.AES.decrypt(note, magicnotekey).toString(CryptoJs.enc.Utf8);
}

export { Encrypt, Decrypt };