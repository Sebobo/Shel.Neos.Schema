const Ajv = require('ajv');
const fs = require('fs');
const yaml = require('js-yaml');

const ajv = new Ajv({
    strictTypes: false,
});

// Add support for intellij html description
ajv.addKeyword('x-intellij-html-description');

const schemas = [
    {
        pattern: /NodeTypes.*\.yaml$/,
        schemaFile: './NodeTypes.Schema.json',
    },
    {
        pattern: /Caches.*\.yaml$/,
        schemaFile: './Caches.Schema.json',
    },
    {
        pattern: /Version.*\.yaml$/,
        schemaFile: './NodeMigration.Schema.json',
    },
    {
        pattern: /Routes.*\.yaml$/,
        schemaFile: './Routes.Schema.json',
    },
].map(sd => {
    const schema = JSON.parse(fs.readFileSync(sd.schemaFile, { encoding: 'utf8', flag: 'r' }));
    const validate = ajv.compile(schema);
    return {
        ...sd,
        schema,
        validate,
    };
});

const files = fs.readdirSync('./examples');

let hasError = false;

for (const file of files) {
    const fileContent = fs.readFileSync(`./examples/${file}`, { encoding: 'utf8', flag: 'r' });
    const data = yaml.load(fileContent);

    const schema = schemas.find(sd => sd.pattern.test(file));
    if (!schema) {
        console.warn('Could not validate %s, no matching schema found', file);
        continue;
    }

    const valid = schema.validate(data);
    if (!valid) {
        console.error(schema.validate.errors);
        hasError = true;
    }
}

process.exit(hasError ? 1 : 0);
