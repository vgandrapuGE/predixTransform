#!/bin/bash

# This will bring in ARTIFACT_ENVIRONMENT_NAMES array.
#. ./build-tasks/artifacts.sh

appName=asset-microapp
#Default version number to 0.0.1 TODO: Get this from source of truth. package.json??
appVersion=2.4.0
#defaultArtifactEnvNames=("dev")
configOnly=false
buildOnly=false
ignoreProxy=false

SCRIPT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

DIST_DIR=$SCRIPT_ROOT/dist/
# Destination directory for our artifacts
BUILD_DIR=$SCRIPT_ROOT/builds
# Backup directory for our previous artifacts.
BUILD_DIR_PREV="${BUILD_DIR}/previous"
# Destination directory for our qa test artifact.
BUILD_DIR_QA="${BUILD_DIR}/qa"
# Directory where we are storing helper scripts.
BUILD_TASKS_DIR=$SCRIPT_ROOT/build-tasks

echo "SCRIPT_ROOT: $SCRIPT_ROOT"
echo "BUILD_DIR: $BUILD_DIR"
echo "BUILD_DIR_PREV: $BUILD_DIR_PREV"
echo "BUILD_DIR_QA: $BUILD_DIR_QA"
echo "BUILD_TASKS_DIR: $BUILD_TASKS_DIR"

# Path to jspm
JSPM=$SCRIPT_ROOT/node_modules/jspm/jspm.js


esc=`echo -en "\033"`
cc_red="${esc}[0;31m"
cc_green="${esc}[0;32m"
cc_bold="${esc}[1m"
cc_normal=`echo -en "${esc}[m\017"`

function usage {
    echo .
    echo ${cc_bold}NAME:${cc_normal}
    echo "build.sh - A build script used for CI/CD"
    echo ""
    echo ${cc_bold}USAGE:${cc_normal}
    echo "build.sh [options]"
    echo "   -b               Build artifacts only."
    echo "   -c               Perform system config only.  No artifacts built."
    echo "   -u|h             Show usage"
    echo ""
    echo "Note: the -b and -c options are exclusive and cannot be used together."
    echo ""
    echo "Example uses: "
    echo "Build with default values -  build.sh "
    echo "Build artifacts only      -  build.sh -b"
    echo "Perform config only       -  build.sh -c"
    echo ""
}

function buildFailed {
    echo
    echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    echo !!!!!!!!!!!!!!!  ${cc_red}$@ BUILD FAILED${cc_normal} !!!!!!!!!!!!!!!
    echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    echo
}

function die {
    buildFailed $@
    exit 1
}

while getopts a:bchpu opt; do
    case $opt in
        a)
            echo "appName=${OPTARG}"
            appName=${OPTARG}
            ;;
        b)
            echo "buldOnly=true"
            buildOnly=true
            ;;
        c)
            echo "configOnly=true"
            configOnly=true
            ;;
        h)
            usage
            exit 1
            ;;
        u)
            usage
            exit 1
            ;;
        *)
            usage
            die Incorrect Usage
            ;;
    esac
done
shift $((OPTIND - 1))

if $configOnly && $buildOnly ; then
  echo "Cannot have both config only and build only parameters"
  die Incorrect Usage
fi


function configureJspm {
  echo CONFIGURE JSPM START

#  npm install jspm@0.16.19

  echo "$JSPM config strictSSL false"
  echo "$JSPM config registries.github.timeouts.lookup 60"
  echo "$JSPM config registries.github.timeouts.build 120"
  echo "$JSPM config registries.github.remote https://github.jspm.io"
  echo "$JSPM config registries.github.auth cWluZ3NvbmcuemhhbmclNDBnZS5jb206YnN0OWx2MQ=="
  echo "$JSPM config registries.github.maxRepoSize 0"
  echo "$JSPM config registries.github.handler jspm-github"
  echo "$JSPM config registries.jspm.timeouts.lookup 60"
  echo "$JSPM config registries.jspm.timeouts.build 120"
  echo "$JSPM config registries.jspm.handler jspm-registry"
  echo "$JSPM config registries.jspm.remote https://registry.jspm.io"
  echo "$JSPM config registries.ge.timeouts.lookup 60"
  echo "$JSPM config registries.ge.timeouts.build 120"
  echo "$JSPM config registries.ge.remote https://github.jspm.io"
  echo "$JSPM config registries.ge.hostname github.build.ge.com"
  echo "$JSPM config registries.ge.maxRepoSize 0"
  echo "$JSPM config registries.ge.handler jspm-github"
  echo "$JSPM config registries.npm.timeouts.lookup 60"
  echo "$JSPM config registries.npm.timeouts.build 120"
  echo "$JSPM config registries.npm.handler jspm-npm"
  echo "$JSPM config registries.npm.remote https://npm.jspm.io"


  $JSPM config defaultTranspiler babel
  $JSPM config strictSSL false
  $JSPM config registries.github.timeouts.lookup 60
  $JSPM config registries.github.timeouts.build 120
  $JSPM config registries.github.remote https://github.jspm.io
  $JSPM config registries.github.auth cWluZ3NvbmcuemhhbmclNDBnZS5jb206YnN0OWx2MQ==
  $JSPM config registries.github.maxRepoSize 0
  $JSPM config registries.github.handler jspm-github

  $JSPM config registries.jspm.timeouts.lookup 60
  $JSPM config registries.jspm.timeouts.build 120
  $JSPM config registries.jspm.handler jspm-registry
  $JSPM config registries.jspm.remote https://registry.jspm.io

  $JSPM config registries.ge.timeouts.lookup 60
  $JSPM config registries.ge.timeouts.build 120
  $JSPM config registries.ge.remote https://github.jspm.io
  $JSPM config registries.ge.hostname github.build.ge.com
  $JSPM config registries.ge.maxRepoSize 0
  $JSPM config registries.ge.handler jspm-github

  $JSPM config registries.npm.timeouts.lookup 60
  $JSPM config registries.npm.timeouts.build 120
  $JSPM config registries.npm.handler jspm-npm
  $JSPM config registries.npm.remote https://npm.jspm.io

  echo "JSPM configuration: "
  cat ~/.jspm/config

  echo CONFIGURE JSPM END
}

function clearCache {
  echo Clear the cache
  npm cache clear || die npm cache clear failed
  bower cache clean
  $JSPM cache-clear || die jspm cach clear failed
}

function jspmInstall {
  echo Doing jspm install ...
  echo JSPM version:
  $JSPM --version
  $JSPM install || die jspm install failed
  echo jspm install DONE
}

function npmInstall {
  echo Doing npm install ...
  echo npm version:
  npm -v
  npm install || die npm install failed
  echo npm install DONE
}

function bowerInstall {
  echo Doing bower install ...
  echo bower version:
  bower -v
  bower install || die bower install failed
  echo bower install DONE
}

function gulpSass {
  echo Doing gulp sass ...
  echo gulp version:
  gulp -v
  gulp sass || die gulp sass failed
  echo gulp sass DONE
}

function gulpUnitTests {
  echo Doing gulp test ...
  echo gulp version:
  gulp -v
  gulp test:unit || die gulp test failed
  echo gulp test DONE
}

function gulpDist {
  echo Doing gulp dist ...
  echo gulp version:
  gulp -v
  gulp dist || die gulp dist failed
  echo gulp dist DONE
}

function createArtifacts {
  # move current build artifacts to backup directory and delete previous backup
  mkdir -p "$BUILD_DIR_PREV"
  mkdir -p "$BUILD_DIR_QA"
  rm -f $BUILD_DIR_PREV/*.zip
  mv $BUILD_DIR/*.zip $BUILD_DIR_PREV
  mv $BUILD_DIR_QA/*.zip $BUILD_DIR_PREV

  artifactFileName=${appName}-${appVersion}-SNAPSHOT.zip
  cd $DIST_DIR

  echo  "zip -r ${BUILD_DIR}/${artifactFileName} ."
  zip -r ${BUILD_DIR}/${artifactFileName} .

  qaFileName=${appName}-${appVersion}-qa-src.zip
  cd $SCRIPT_ROOT
  zip -r ${BUILD_DIR_QA}/${qaFileName} . -i protractor.conf.js karma.conf.js gulpfile.js "test/*" "node_modules/*"
}

function showEnvironmentVariables {
  echo ENVIRONMENT VARIABLES
  printenv
}

function populateVersionInfo {
  echo 'POPULATE VERSION INFO'
  appVersionDesc=`${BUILD_TASKS_DIR}/populate_version_description.sh`
  echo "Current app version: $appVersionDesc"
}

echo Build script START
# ----
#set -e

#export HTTP_PROXY=http://sjc1intproxy01.crd.ge.com:8080
#export HTTPS_PROXY=http://sjc1intproxy01.crd.ge.com:8080
#export http_proxy=http://sjc1intproxy01.crd.ge.com:8080/
#export https_proxy=http://sjc1intproxy01.crd.ge.com:8080/
#export no_proxy=devcloud.sw.ge.com,openge.ge.com,github.sw.ge.com,localhost,127.0.0.1,api.grc-apps.svc.ice.ge.com,login.grc-apps.svc.ice.ge.com,loggregator.grc-apps.svc.ice.ge.com,uaa.grc-apps.svc.ice.ge.com,console.grc-apps.svc.ice.ge.com,192.168.50.4,xip.io

git config --global http.sslVerify "false"
#git config --global http.proxy http://sjc1intproxy01.crd.ge.com:8080
#git config --global https.proxy http://sjc1intproxy01.crd.ge.com:8080
git config --global --unset http.proxy
git config --global --unset https.proxy
npm config delete proxy
npm config delete https-proxy
#npm config set registry http://GIS05808.devcloud.ge.com:9095
#npm config delete registry

# ----
if $buildOnly && false ; then
  echo "START build only"
  showEnvironmentVariables
  #populateVersionInfo
  bowerInstall
  npmInstall
  jspmInstall

  echo "Run build script START"
  #npm run-script build
  gulpSass
  #gulpUnitTests
  gulpDist
  echo "Run build script END"
  echo "END build only"
else
  echo "START system configuration";
  showEnvironmentVariables
  #populateVersionInfo
  configureJspm
  bowerInstall
  npmInstall
  jspmInstall

  echo "Run build script START"
  #npm run-script build
  gulpSass
  #gulpUnitTests
  gulpDist
  echo "Run build script END"
  echo "END system configuration"
fi


if ! $configOnly ; then
  echo "START createArtifacts()"
  createArtifacts
  echo "END createArtifacts()"
fi


echo Build script END
