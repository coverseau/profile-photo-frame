#!/bin/bash
DIR=${PWD##*/}
cd ..
zip -r "$DIR/$DIR.zip" "$DIR/" -x "$DIR/.[!.]*" "$DIR/create-plugin.sh" "$DIR/update-info.json" "$DIR/master graphics.ai" "$DIR/$DIR.zip"
cd "$DIR"
