#!/bin/sh

mkdir compressed

for file in *.jpg
do
	echo "working on $file"
	guetzli --quality 94 $file compressed/$file
done
