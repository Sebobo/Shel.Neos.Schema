# JSON schema for Neos CMS nodetypes

This repository contains a [JSON schema](https://json-schema.org), that can be used in PHPStorm or VSCode
to get 

* autocompletion 
* typehints 
* validation of Neos CMS nodetypes files

When the schema is stable enough it will hopefully be made available in the [schema store](https://www.schemastore.org/json/).

The schema is based on the old YAML schemas we already have in Neos & Flow. 
But they all need some converting and can be updated with the latest functionality of what JSON schema can do.
With a bit of community effort we can upgrade them, put them in the core, replace our own schema validator 
and make the schemas officially available on https://www.schemastore.org/json/.
The schemastore allows your IDE to automatically download the one your need.

## Notes

The current schema is quite strict. 
For example, it only accepts one nodetype per file.
It possibly makes sense to offer a more relaxed variant. Or control this inside a Yaml file somehow.

## How to use

### PHPStorm / IntelliJ IDEA 

Follow the [official instruction](https://www.jetbrains.com/help/phpstorm/json.html#ws_json_schema_add_custom) and add the url: 

    https://raw.githubusercontent.com/Sebobo/Shel.Neos.Schema/main/NodeTypes.Schema.json

Make sure there is no space at the end of the url when pasting it into your IDE or the Schema will not validate.

Set `Schema Version` to `JSON Schema version 7`.

Add path mappings to the packages you work on. For example:

    DistributionPackages/*/Configuration/NodeTypes*.yaml

### Other editors

Visual Studio Code and [other editors](https://www.schemastore.org/json/) also support JSON schema. 
Instructions are easy to find with your favourite search engine.

## Notes

There is also a YAML version in the repo which I used first when converting the old schema.
It works the same way as the JSON version locally, but I couldn't get it to work when loaded remotely.

## Contribution

If you know how to use the schema in other editors, please provide a PR with the instructions. 

If you have ideas on how to improve the schema, please provide an issue with an example, and a 
PR that would resolve the issue if you can.
