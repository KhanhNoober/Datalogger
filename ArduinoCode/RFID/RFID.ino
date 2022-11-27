#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>

#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN D10
#define RST_PIN D8
MFRC522 mfrc522(SS_PIN, RST_PIN); 

//declare the webserver
ESP8266WebServer server(80);

HTTPClient https;
WiFiClient client = server.client();

String lastCard = "";
String URL = "http://192.168.1.6:3000/rfid/"; //change ip base on the ipv4 on local server

void setup() {
  // Open serial communications and wait for port to open:
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
  //server.on("/ssedata", handleSSEdata);

  SPI.begin(); 
  mfrc522.PCD_Init();  
}

void loop() {
  if (mfrc522.PICC_IsNewCardPresent()) {
    if (mfrc522.PICC_ReadCardSerial()) {
      String content = "";
      for (byte i = 0; i < mfrc522.uid.size; i++) 
      {
        content.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? "%200" : "%20"));
        content.concat(String(mfrc522.uid.uidByte[i], HEX));
      }      

      content.toUpperCase();

      String tempContent = content;
      tempContent.replace("%20", " ");

      Serial.println(tempContent);

      String fullUrl = URL + content.substring(3);

      if (https.begin(client, fullUrl)) {
        int httpCode = https.PUT(content.substring(3));
        Serial.println(String(httpCode));
        if (httpCode > 0) {
          Serial.println(https.getString());
        } else {
          Serial.println("[HTTP] Unable to connect to server\n");            
        }
        https.end();
      }

      lastCard = content;

      delay(3000);
    };
  };
}