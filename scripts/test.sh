
echo Running tests...

if [ "$TESTS" == "" ]; then
    TESTS="test/*.test.js"
fi

NODE_ENV=test ./node_modules/.bin/nodeunit $TESTS

TEST_STATUS=$?

echo Done!
