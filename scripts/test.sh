
echo Running tests...

if [ "$TESTS" == "" ]; then
    TESTS="./test/*.js"
fi

NODE_ENV=test ./node_modules/.bin/mocha $TESTS --reporter list --timeout 10s

TEST_STATUS=$?

echo Done!
