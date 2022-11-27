#include <DHT.h>;
#include <WiFiClient.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

#define DHTPIN D1     // what pin we're connected to
#define DHTTYPE DHT22   // DHT 22  (AM2302)

DHT dht(DHTPIN, DHTTYPE); //// Initialize DHT sensor for normal 16mhz Arduino

ESP8266WebServer server(80); //declare the webserver

float hum;  //Stores humidity value
float temp; //Stores temperature value

void setup()
{
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect
  }
  
  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(F("Connecting"));
        
    WiFi.persistent(false);       // WiFi config isn't saved in flash
    WiFi.mode(WIFI_STA);          // use WIFI_AP_STA if you want an AP
    WiFi.hostname("ESP8266");    // must be called before wifi.begin()
    WiFi.begin("VU", "0933261747");
   
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(F("."));
    }
  }
     
  Serial.println();
  Serial.print(F("IP address: "));
  Serial.println(WiFi.localIP());  
  
  //start the webserver
  server.begin();
  //Server Sent Events will be handled from this URI
  server.on("/ssedata", handleSSEdata);
  dht.begin();
}

void loop()
{
  // listen for incoming clients
  server.handleClient();
}

void handleSSEdata(){
  WiFiClient client = server.client();
  
  if (client) {
    Serial.println("new client");
    serverSentEventHeader(client);
    while (client.connected()) {
      serverSentEvent(client);
      delay(16); // round about 60 messages per second
    }

    // give the web browser time to receive the data
    delay(1);
    // close the connection:
    client.stop();
    Serial.println("client disconnected");
  }
}

void serverSentEventHeader(WiFiClient client) {
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: text/event-stream;charset=UTF-8");
  client.println("Connection: close");  // the connection will be closed after completion of the response
  client.println("Access-Control-Allow-Origin: http://192.168.1.6:5173");  // allow any connection. We don't want Arduino to host all of the website ;-)
  client.println("Access-Control-Allow-Credentials: true");  
  client.println("Cache-Control: no-cache");  // refresh the page automatically every 5 sec
  client.println();
  client.flush();
}
   
void serverSentEvent(WiFiClient client) {
  //Read data and store it to variables hum and temp
  hum = dht.readHumidity();
  temp= dht.readTemperature();

  //Print temp and humidity values to serial monitor
  client.print("data: ");
  client.print(hum);
  client.print(",");
  client.print(temp);
  client.print("\n\n");
  client.flush();
  delay(2000); //Delay 2 sec.
}