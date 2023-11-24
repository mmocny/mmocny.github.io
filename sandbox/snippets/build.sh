#!/usr/bin/env bash

rm -rf dist/
esbuild *.js --bundle --minify $file --outdir=dist
