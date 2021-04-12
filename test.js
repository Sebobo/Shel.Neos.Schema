const Ajv = require('ajv');
const fs = require('fs');
const yaml = require('js-yaml');

const ajv = new Ajv({
    strictTypes: false,
});

// Add support for intellij html description
ajv.addKeyword('x-intellij-html-description');

const schema = JSON.parse(fs.readFileSync('./NodeTypes.Schema.json', { encoding: 'utf8', flag: 'r' }));

const validate = ajv.compile(schema);

const files = fs.readdirSync('./examples');

let hasError = false;

for (const file of files) {
    const fileContent = fs.readFileSync(`./examples/${file}`, { encoding: 'utf8', flag: 'r' });
    const data = yaml.load(fileContent);

    const valid = validate(data);
    if (!valid) {
        console.error(validate.errors);
        hasError = true;
    }
}

process.exit(hasError ? 1 : 0);
