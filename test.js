const Ajv = require('ajv');
const fs = require('fs');
const yaml = require('js-yaml');

const ajv = new Ajv({
    strictTypes: false,
});

const schema = JSON.parse(fs.readFileSync('./NodeTypes.Schema.json', { encoding: 'utf8', flag: 'r' }));

const validate = ajv.compile(schema);

const files = fs.readdirSync('./examples');

for (const file of files) {
    const fileContent = fs.readFileSync(`./examples/${file}`, { encoding: 'utf8', flag: 'r' });
    const data = yaml.load(fileContent);

    const valid = validate(data);
    if (!valid) console.log(validate.errors);
}
