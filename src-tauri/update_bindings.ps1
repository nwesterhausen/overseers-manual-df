cargo test --all-features
pnpx prettier --write bindings/*.ts
Copy-Item bindings/*.ts ../src/definitions