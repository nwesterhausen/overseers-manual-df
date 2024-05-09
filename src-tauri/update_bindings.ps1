Remove-Item '.\bindings\*' -Force
cargo test --all-features
pnpx prettier --write ./bindings/*.ts
