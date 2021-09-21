# JSON schema for Neos CMS nodetypes & node migrations

[![Tests](https://github.com/Sebobo/Shel.Neos.Schema/actions/workflows/tests.yml/badge.svg)](https://github.com/Sebobo/Shel.Neos.Schema/actions/workflows/tests.yml)

This repository contains [JSON schema](https://json-schema.org) definitions, that can be used in PHPStorm or VSCode
to get the following features for `NodeTypes.*.yaml`, `Caches.yaml` and node migration `Version*.yaml` files: 

* autocompletion 
* typehints 
* validation
* inline documentation

![Example usage in PHPStorm](neos-schema-example.gif)

When the schema is stable enough it will hopefully be made available in the [schema store](https://www.schemastore.org/json/).

The schema is based on the old YAML schemas we already have in Neos & Flow. 
But they all need some converting and can be updated with the latest functionality of what JSON schema can do.
With a bit of community effort we can upgrade them, put them in the core, replace our own schema validator 
and make the schemas officially available on https://www.schemastore.org/json/.
The schemastore allows your IDE to automatically download the one your need.

## Features for Neos nodetypes:

### Autocompletion

In addition to usual fields there are also conditional schema definitions for the following properties:

* `editor` (due to a [bug](https://youtrack.jetbrains.com/issue/WEB-37901) in IntelliJ, autocompletion doesn't show the matching `editorOptions` but validation works)
* `validation`

### Typehints

Typehints for all known Neos core nodetype properties.

### Validation

You can run validations against your nodetypes with [Ajv](https://ajv.js.org/) or similar.
See [test.js](test.js) for an example.

### Inline docs

This is still work-in-progress and only a few entries properties have full documentation.
Feel free to open a PR to add more.
We support the fields `title`, `description` and `x-intellij-html-description` for html docs.

## Features for Neos node migrations:

Autocompletion, typehints, validation and inline docs are available also for node migrations files.
Custom transformations & filters and their options are of course not included.

## Features for Neos cache configuration:

Autocompletion and descriptions for default cache frontends, backends and their options based on [the documentation](https://flowframework.readthedocs.io/en/stable/TheDefinitiveGuide/PartIII/Caching.html).
Custom cache implementations and their options are of course not included.

## How to use

### PHPStorm / IntelliJ IDEA 

#### Simple option

Install the [Neos plugin](https://plugins.jetbrains.com/plugin/9362-neos-support), it will automatically activate the
latest nodetypes schema from this repository.

#### Manual configuration (nodetypes)

Follow the [official instruction](https://www.jetbrains.com/help/phpstorm/json.html#ws_json_schema_add_custom) and add the url: 

    https://raw.githubusercontent.com/Sebobo/Shel.Neos.Schema/main/NodeTypes.Schema.json

Make sure there is no space at the end of the url when pasting it into your IDE or the Schema will not validate.

Set `Schema Version` to `JSON Schema version 7`.

Add path mappings to the packages you work on. For example:

    DistributionPackages/*/Configuration/NodeTypes*.yaml

#### Manual configuration (migrations)

See above and add the url: 

    https://raw.githubusercontent.com/Sebobo/Shel.Neos.Schema/main/NodeMigration.Schema.json

Make sure there is no space at the end of the url when pasting it into your IDE or the Schema will not validate.

Set `Schema Version` to `JSON Schema version 7`.

Add path mappings to the packages you work on. For example:

    DistributionPackages/*/Migrations/ContentRepository/Version*.yaml

#### Manual configuration (caches)

See above and add the url: 

    https://raw.githubusercontent.com/Sebobo/Shel.Neos.Schema/main/Caches.Schema.json

Make sure there is no space at the end of the url when pasting it into your IDE or the Schema will not validate.

Set `Schema Version` to `JSON Schema version 7`.

Add path mappings to the packages you work on. For example:

    DistributionPackages/*/Configuration/Caches*.yaml

### Visual Studio Code

Install this plugin to enable JSON schema for YAML:
https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml

Open the `Command Palette` with `F1` or `Ctrl + Shift + P` in VSCode,
then search for 'settings json' and add there the following snippet:

```json
{
    "yaml.schemas": {
        "https://raw.githubusercontent.com/Sebobo/Shel.Neos.Schema/main/NodeTypes.Schema.json": "DistributionPackages/*/Configuration/NodeTypes*.yaml",
        "https://raw.githubusercontent.com/Sebobo/Shel.Neos.Schema/main/NodeMigration.Schema.json": "DistributionPackages/*/Migrations/ContentRepository/Version*.yaml",
        "https://raw.githubusercontent.com/Sebobo/Shel.Neos.Schema/main/Caches.Schema.json": "DistributionPackages/*/Configuration/Caches*.yaml"
    }
}
```

### Other editors

[Other editors](https://www.schemastore.org/json/) also support JSON schema. 
Instructions are easy to find with your favourite search engine.

### Schema variants

Certain declarations in a `NodeTypes.*.yaml` file are valid but not considered as "best practise".
The default schema mentioned in the instructions above will not enforce those.

#### Strict schema

If you want additional strict validation, you can instead use the strict schema with the url:

    https://raw.githubusercontent.com/Sebobo/Shel.Neos.Schema/main/NodeTypes.Schema.Strict.json

Implemented additional checks:

* Only 1 nodetype per file

## FAQ

### I get duplicate results for autocompletion

This happens when you have an older version of the Neos plugin installed in an IntelliJ IDE and you manually set up the
schemas in your IDE. 
The plugin also provided some basic autocompletion hints in older versions than 1.7. After that it referenced the 
schema in this repository.

## Contribution

If you know how to use the schema in other editors, please provide a PR with the instructions. 

If you have ideas on how to improve the schema, please provide an issue with an example, and a 
PR that would resolve the issue if you can.
