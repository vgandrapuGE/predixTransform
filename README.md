##Predix Transform 2016


*****************************************************************************************************
##Theme
******************************************************************************************************
- Net energy efficiency (%) for a gas turbine plant.
- Heat rate above threshold events

```
Heat Rate = Fuel Flow * Fuel Heating Value (const., for a given class of gas turbine) / Power Output
Efficiency % = (3412/avg(heat rate) )*100
( Btu content of a kWh of electricity=3412)

```


*****************************************************************************************************
##Architecture
******************************************************************************************************
![alt tag](https://github.build.ge.com/OperationsOptimization/hackathon/blob/master/architecture.png)

******************************************************************************************************
##Data sets [APM Asset]
******************************************************************************************************
Asset model with tags for fuel flow, heatrate, power output and efficiency.
[Any other constants or static data required for heat rate calculation]

******************************************************************************************************
##Backend [APM Asset, CloudFoundry, Postgres, APM Timeseries]
******************************************************************************************************
1. Ingest Asset model dataset into APM
2. proxy REST Service to ingest events from predix machine.
3. Websocket server for streaming out real time efficiency calculation.
4. APM Timeseries service for retrieving supporting tag evidence for alerts.


******************************************************************************************************
##EDGE Functionality [Predix Machine, Predix Timeseries WS gateway]
******************************************************************************************************

1. Generate interval fuel flow, power output data (every sec.,) using Intel Edison board
2. Calculate Heat Rate on Predix Machine
3. Ingest raw data, & calculated heatrate data through Predix WS river
4. Ingest events using CF proxy REST service.

******************************************************************************************************
##Visualization
******************************************************************************************************
1. Asset Browser using APM asset services
2. Widget to show Energy Efficiency aggregated for a plant, segment (fleet), or equipment (asset). 
uses REST Client.
3. Heatmap to show events in a calendar at minute granularity. Click on an event should show event details
in a tool tip.
uses Websocket Client.
4. visualization of contributing factors for the alerts (timeseries tags)  with 'insight' link to drilldown further. When clicked show fuel flow, heat rate data in a timeseries chart

******************************************************************************************************
##Comments and Feedback
******************************************************************************************************
Visit http://devpost.com/software/predix-decoded

