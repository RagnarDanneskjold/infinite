#!/usr/bin/env bash

# Unenforced jshint files

jshint --config scripts/jshint.json test/*.js

# Enforced jshint files

## Full hinting rules

jshint --config scripts/jshint.json lib/*.js index.js

ENFORCED_STRICT=$?

## Allowing underscores in names (for interfacing with API)
## Add /* jslint camelcase: true */ to your file

ENFORCED_ALLOW_UNDERSCORES=$?

# Determine exit code and quit

HINT_RESULT=$(( $ENFORCED_STRICT + $ENFORCED_ALLOW_UNDERSCORES ))

if [ $HINT_RESULT -eq 0 ]; then
    echo Success: No enforced files failed the style test.
else
    echo Failure: One or more enforced files failed the style test.
fi

exit $HINT_RESULT
