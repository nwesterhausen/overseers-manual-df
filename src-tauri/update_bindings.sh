#!/bin/bash
# Generate typescript bindings from rust code using rs-ts.
#
# Rs-ts adds tests which generate typescript interfaces/types to the bindings directory.
#
# So this script runs the tests and then copies the generated files to the src/definitions
# directory used by the client.
cargo test --all-features
pnpx prettier --write bindings/*.ts
cp bindings/*.ts ../src/definitions