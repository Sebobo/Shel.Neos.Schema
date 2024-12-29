#!/usr/bin/env node
const Ajv = require('ajv');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const yargs = require('yargs/yargs')
const {hideBin} = require('yargs/helpers')
const ajv = new Ajv({
    strictTypes: false,
});

// Add support for intellij html description
ajv.addKeyword('x-intellij-html-description');

// Build schema map
const schemas = [
    {
        pattern: /NodeTypes(\/?).*\.yaml$/,
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
    {
        pattern: /Settings.Presets.yaml$/,
        schemaFile: './NodeTypes.Presets.Schema.json',
    },
].map(sd => {
    const schema = JSON.parse(fs.readFileSync(sd.schemaFile, {encoding: 'utf8', flag: 'r'}));
    const validate = ajv.compile(schema);
    return {
        ...sd,
        schema,
        validate,
    };
});

/**
 * Recursively list yaml files in a directory
 *
 * @param {string} dir
 * @return {string[]}
 */
function listYamlFiles(dir) {
    let results = [];
    let files = [];

    // Read the contents of the directory
    try {
        files = fs.readdirSync(dir);
    } catch (e) {
        console.error('Could not read directory %s', dir);
        process.exit(1);
    }

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        // If it's a directory, recurse into it
        if (stat && stat.isDirectory()) {
            results = results.concat(listYamlFiles(filePath));
        } else if (file.endsWith('.yaml') || file.endsWith('.yml')) {
            // If it's a YAML file, add to results
            results.push(filePath);
        }
    });

    return results;
}

/**
 * @param {string} filePath
 * @param {object} schema
 */
function validateFile(filePath, schema) {
    const fileContent = fs.readFileSync(filePath, {encoding: 'utf8', flag: 'r'});
    const data = yaml.load(fileContent);
    return schema.validate(data);
}

/**
 * @param {string} folder
 * @param {boolean} verbose
 * @return {void}
 */
function validateFolder(folder, verbose) {
    const files = listYamlFiles(folder);
    let hasError = false;
    let validFiles = 0;
    let skippedFiles = 0;
    let invalidFiles = 0;

    if (verbose) {
        console.info('Found %d files to validate', files.length);
    }

    for (const file of files) {
        // Only validate yaml files
        if (path.extname(file).match(/\.ya?ml/) === null) {
            continue;
        }

        const schema = schemas.find(sd => sd.pattern.test(file));
        if (!schema) {
            if (verbose) {
                console.warn('Skipped %s, no matching schema found', file);
            }
            skippedFiles++;
            continue;
        }

        const valid = validateFile(file, schema);
        if (valid) {
            if (verbose) {
                console.info('✅ %s is valid', file);
            }
            validFiles++;
        } else {
            console.error('❌ %s is invalid', file, schema.validate.errors);
            hasError = true;
            invalidFiles++;
        }
    }

    if (verbose) {
        console.info('Valid files %d, skipped %d, invalid %d', validFiles, skippedFiles, invalidFiles);
    }

    process.exit(hasError ? 1 : 0);
}

yargs(hideBin(process.argv))
    .command('validate <folder>', 'validate yaml files', (yargs) => {
        return yargs
            .positional('folder', {
                describe: 'folder with files to be validated',
                type: 'string',
            });
    }, (argv) => {
        const {folder, verbose} = argv;
        validateFolder(folder, verbose);
    })
    .example('$0 validate -v DistributionPackages/My.Site', 'Recursively validates all nodetype and other supported yaml files in your Neos site package and shows the results for each file')
    .option('verbose', {
        alias: 'v',
        type: 'boolean',
        description: 'Run with verbose logging'
    })
    .demandCommand()
    .help()
    .parse();
