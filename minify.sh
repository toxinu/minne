#!/bin/bash
#

function readlink() {
  DIR=$(echo "${1%/*}")
  (cd "$DIR" && echo "$(pwd -P)")
}

# look for GNU readlink first (OS X, BSD, Solaris)
READLINK=`type -P greadlink`
if [ -z "$READLINK" ]; then
    # if readlink is not GNU-style, setting BASE will fail
    READLINK=`type -P readlink`
fi
BASE=`$READLINK -f $0 2>/dev/null`
if [ -z "$BASE" ]; then
    # try the bash function
    BASE=$(readlink $0)
else
    BASE=`dirname $BASE`
fi
if [ -z "$BASE" ]; then
    echo Error initializing environment from $READLINK
    $READLINK --help
    exit 1
fi

STATIC_PATH=$BASE"/minne/static/links"
echo ":: Using path $STATIC_PATH"

MINCSS=$(which uglifycss)
MINJS=$(which uglifyjs)

if [ -z $(which npm) ]; then
    echo "!! Need nodejs and npm to minify"
    echo "!! Browser will use unminified JavaScript and CSS"
    MINCSS=cat
    # TODO cat will not work for JS because the syntax differs
    MINJS=
else
    if [ -z "$MINCSS" ]; then
        echo ":: Installing css minifier"
        sudo npm install -g uglifycss@0.0.9
        MINCSS=$(which uglifycss)
    fi
    if [ -z "$MINJS" ]; then
        echo ":: Installing js minifier"
        sudo npm install -g uglify-js
        MINJS=$(which uglifyjs)
    fi
fi

echo ":: Minify javascript"

if [ -z "$MINJS" ]; then
    cat $STATIC_PATH/js/jquery-1.10.1.min.js.js  \
        $STATIC_PATH/js/utils.js \
        $STATIC_PATH/js/bootstrap.min.js \
        $STATIC_PATH/js/lunr.min.js \
        $STATIC_PATH/js/angular.min.js \
        $STATIC_PATH/js/angular-resource.min.js \
        $STATIC_PATH/js/angular-cookies.min.js \
        $STATIC_PATH/js/services.js \
        $STATIC_PATH/js/app.js \
        $STATIC_PATH/js/controllers.js \
        > $STATIC_PATH/js/links.min.js
else
    $MINJS $STATIC_PATH/js/jquery-1.10.1.min.js  \
        $STATIC_PATH/js/utils.js \
        $STATIC_PATH/js/bootstrap.min.js \
        $STATIC_PATH/js/lunr.min.js \
        $STATIC_PATH/js/angular.min.js \
        $STATIC_PATH/js/angular-resource.min.js \
        $STATIC_PATH/js/angular-cookies.min.js \
        $STATIC_PATH/js/services.js \
        $STATIC_PATH/js/app.js \
        $STATIC_PATH/js/controllers.js \
        -o $STATIC_PATH/js/links.min.js
fi
md5sum $STATIC_PATH/js/links.min.js

echo ":: Minify css"

# for i in bootstrap flat-ui; do
#     $MINCSS $STATIC_PATH/css/${i}.css > $STATIC_PATH/css/${i}.min.css
#     md5sum $STATIC_PATH/css/${i}.min.css
# done

$MINCSS $STATIC_PATH/css/bootstrap.min.css \
    $STATIC_PATH/css/links.css \
    > $STATIC_PATH/css/links.min.css
md5sum $STATIC_PATH/css/links.min.css

# end
