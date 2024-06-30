Remove-Item '.\bindings\*' -Force
cargo test --package overseers-manual-tauriapp --test bindings -- generate_ts_bindings --exact
pnpx prettier --write ./bindings/*.ts
