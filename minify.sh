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

STATIC_PATH=$BASE"/bibliotek/static/links"
echo ":: Using path $STATIC_PATH"

MINCSS=$(which uglifycss)
MINJS=$(which uglifyjs)

if [ -z $(which npm) ]; then
    echo "!! Need nodejs and npm to minify"
    echo "!! Browser will use unminified CSS"
    MINCSS=cat
    # TODO cat will not work for JS because the syntax differs
    MINJS=
else
    if [ -z "$MINCSS" ]; then
        echo ":: Installing css minifier"
        sudo npm install -g uglifycss
        MINCSS=$(which uglifycss)
    fi
fi

echo ":: Minify css"

$MINCSS $STATIC_PATH/css/font-awesome.css \
    $STATIC_PATH/css/bootstrap-responsive.css \
    $STATIC_PATH/css/links.css \
    > $STATIC_PATH/css/links.min.css
md5sum $STATIC_PATH/css/links.min.css

for i in bootstrap flat-ui; do
    $MINCSS $STATIC_PATH/css/${i}.css > $STATIC_PATH/css/${i}.min.css
    md5sum $STATIC_PATH/css/${i}.min.css
done

# end
