
#!/bin/bash
set -e

##################### Variables Section Start #####################
CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MACHINE_HOME=$CURRENT_DIR/predix-scripts/PredixMachine
GLOBAL_APPENDER=""
PREDIX_SCRIPTS_BRANCH=""
##################### Variables Section End   #####################

###################### Read Global Appender and Predix Scripts Branch
while getopts ":h:i:b:" opt; do
  case $opt in
  	h)
		__print_out_usage
		exit
		;;
    i)
			  if [ ${#OPTARG} -eq 2 ] && [[ "${OPTARG:0:1}" == "-" ]]; then
					echo "Option: \"$opt\" requires a value"
					exit 1
				fi
  			GLOBAL_APPENDER=$OPTARG
		  ;;
    b)
			if [ ${#OPTARG} -eq 2 ] && [[ "${OPTARG:0:1}" == "-" ]]; then
				echo "Option: \"$opt\" requires a value"
				exit 1
			fi

		  PREDIX_SCRIPTS_BRANCH=$OPTARG
	  ;;
    \?)
      echo "Invalid option: -$OPTARG"
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument."
      exit 1
      ;;
  esac
done
#GLOBAL APPENDER
if [[ "$GLOBAL_APPENDER" == "" ]]; then
	echo "Apps and Services in the Predix Cloud need a unique url.  Enter your global appender, e.g. thomas-edison, for Predix Services and Applications followed by ENTER"
	read GLOBAL_APPENDER
	while true; do
		if [ "$GLOBAL_APPENDER" == "${GLOBAL_APPENDER/_/}" ]; then
			export GLOBAL_APPENDER
			break;
		else
			echo "Global Appender cannot have underscore(_). Please enter a global appender with dash (-) in place of underscore(_)"
			read GLOBAL_APPENDER
		fi
	done
fi
export GLOBAL_APPENDER

echo "$CURRENT_DIR"
rm -rf predix-scripts
rm -rf predix-machine-templates

if [ "$PREDIX_SCRIPTS_BRANCH" == "" ]; then
   PREDIX_SCRIPTS_BRANCH="master"
fi

git clone https://github.com/PredixDev/predix-scripts.git -b $PREDIX_SCRIPTS_BRANCH --depth 1

echo "####################Creating Cloud Services#################################################"
cd predix-scripts
if [ "$(uname -s)" == "Darwin" ] || [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]
then
   echo ""
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ]
then
	find . -name "*.sh" -exec dos2unix -q {} \;
elif [ "$(expr substr $(uname -s) 1 9)" == "CYGWIN_NT" ]
then
  find . -name "*.sh" -exec dos2unix -q {} \;
fi
./quickstart.sh -smf -i $GLOBAL_APPENDER
cd $CURRENT_DIR

echo "#################### Build and setup the adatper for Edison/Galileo start ####################"

cp $CURRENT_DIR/config/com.ge.predix.solsvc.workshop.adapter.config $MACHINE_HOME/configuration/machine
cp $CURRENT_DIR/config/com.ge.predix.workshop.nodeconfig.json $MACHINE_HOME/configuration/machine
cp $CURRENT_DIR/config/com.ge.dspmicro.hoover.spillway-0.config $MACHINE_HOME/configuration/machine

#mvn -q install:install-file -Dfile=$CURRENT_DIR/lib/mraa.jar -DgroupId=com.intel.mraa -DartifactId=mraa -Dversion=1.0 -Dpackaging=jar
#mvn -q install:install-file -Dfile=$CURRENT_DIR/lib/upm_buzzer.jar -DgroupId=com.intel.upm_buzzer -DartifactId=upm_buzzer -Dversion=1.0 -Dpackaging=jar
#mvn -q install:install-file -Dfile=$CURRENT_DIR/lib/upm_grove.jar -DgroupId=com.intel.upm_grove -DartifactId=upm_grove -Dversion=1.0 -Dpackaging=jar

#mvn -q clean install -Dmaven.compiler.source=1.8 -Dmaven.compiler.target=1.8 -f $CURRENT_DIR/pom.xml

cp $CURRENT_DIR/config/solution.ini $MACHINE_HOME/machine/bin/vms
echo "Copying cp $CURRENT_DIR/target/predix-machine-template-adapter-edison-1.0.jar $MACHINE_HOME/machine/bundles"
cp $CURRENT_DIR/target/predix-machine-template-adapter-edison-1.0.jar $MACHINE_HOME/machine/bundles

echo "#################### Build and setup the adatper for Edison/Galileo end ####################"

echo "Copying Predix Machine container to the target device"
cd predix-scripts
./quickstart.sh -t -i $GLOBAL_APPENDER
cd $CURRENT_DIR

echo "Transfered Predix Machine container to the target device successfully"

PREDIX_SERVICES_SUMMARY_FILE="$CURRENT_DIR/predix-scripts/log/predix-services-summary.txt"

echo "" >> $PREDIX_SERVICES_SUMMARY_FILE
echo "Edge Device Specific Configuration" >> $PREDIX_SERVICES_SUMMARY_FILE
echo "What did we do:"  >> $PREDIX_SERVICES_SUMMARY_FILE
echo "We setup some configuration files in the Predix Machine container to read from a DataNode for our Edison sensors"  >> $PREDIX_SERVICES_SUMMARY_FILE
echo "We installed some Intel jar files that represent the Edison API" >> $PREDIX_SERVICES_SUMMARY_FILE
echo "We built and deployed the Machine Adapter bundle which reads from the Edison API" >> $PREDIX_SERVICES_SUMMARY_FILE
echo "" >> $PREDIX_SERVICES_SUMMARY_FILE
