# Interactive Maps

Interactive Maps is a configuration driven web mapping application that allows web map oriented applications to be deployed with minimal development overhead. The application is implemented using AngularJS/Bootstrap. Interactive maps utilises the [GeoWebToolkit](https://github.com/GeoscienceAustralia/geo-web-toolkit). 

![](https://github.com/GeoscienceAustralia/interactive-maps/blob/master/docs/imgs/interactive_maps_home.png)

## Requirements
Required:

* Java 1.6+
* Maven 3+
* NodeJS

## Configuration

The configuration files are written in JSON format. The files can be found in src/main/webapp/config. Currently these are all implemented under the file system, in future we wish to implement a database solution to store the configuration. 

The application also contains a config creator (BETA) which allows you to easily generate a JSON file with your requested configuration. The configuration allows you to configure things like base maps, layers, and which tools you want to use. The config creator can be accessed by prepending `configCreator` to the homepage URL. For example, `/interactive-maps/#/configCreator/theme/marine/map/oceanbathymetry`.

[For more information please refer to the wiki](https://github.com/GeoscienceAustralia/interactive-maps/wiki).

## Running locally

[Please refer to the wiki](https://github.com/GeoscienceAustralia/interactive-maps/wiki/Running-locally)

## Building

The application can be built using Maven by running the following command

mvn clean package

This will generate interactive-maps.war in the target folder. This can then be deployed to your application server.
