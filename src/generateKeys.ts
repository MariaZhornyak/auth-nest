import * as fs from 'fs';
import * as crypto from 'crypto';

const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'pkcs1',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs1',
    format: 'pem',
  },
});

fs.writeFileSync('./keys/private.key', privateKey);
fs.writeFileSync('./keys/public.key', publicKey);