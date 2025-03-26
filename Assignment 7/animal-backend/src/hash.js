import crypto from 'crypto';

function generateHash(username, password) {
  const inputString = `${username}:${password}`;
  const hash = crypto.createHash('sha256').update(inputString).digest('hex');
  return hash;
}

const [username, password] = process.argv.slice(2);

if (!username || !password) {
  console.log('Usage: node src/hash.js <username> <password>');
  process.exit(1);
}

const hash = generateHash(username, password);
console.log('Generated Hash:', hash);