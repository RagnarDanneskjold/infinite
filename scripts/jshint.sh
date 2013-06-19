#!/usr/bin/env bash

# Enforced jshint files

## Full hinting rules

jshint --config scripts/jshint.json lib/*.js index.js test/*.js

ENFORCED_STRICT=$?

if [ $ENFORCED_STRICT -eq 0 ]; then
    echo Success: No enforced files failed the style test.
else
    echo Failure: One or more enforced files failed the style test.
fi

exit $ENFORCED_STRICT
