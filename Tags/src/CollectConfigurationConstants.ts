//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

export class CollectConfigurationConstants {
  // overrideable using evironment variable TAG_CONFIG_FILE_LOCATION_WIN32
  public CONFIG_FILE_LOCATION_WIN32 =
    'C:/SPIA/Config/CollectWebServerConfig.json';

  // overrideable using evironment variable TAG_CONFIG_FILE_LOCATION_NIX
  public CONFIG_FILE_LOCATION_NIX = 'CollectWebServerConfig.json';
  // overrideable using evironment variable TAG_LOG_FILE_LOCATION_WIN32
  public LOG_FILE_LOCATION_WIN32 =
    'C:/SPIA/Logs/CollectWebServer/CollectWebServerlog.txt';
  // overrideable using evironment variable TAG_DATABASE_LOCATION_WIN32
  public DATABASE_LOCATION_WIN32 =
    'C:/SPIA/AppData/CollectWebServer/CollectWebServer.db';
  // overrideable using evironment variable TAG_DATABASE_LOCATION_NIX
  public DATABASE_LOCATION_NIX = 'CollectWebServer.db';
  // overrideable using evironment variable TAG_LOG_FILE_LOCATION_NIX
  public LOG_FILE_LOCATION_NIX = 'CollectWebServerlog.txt';
  // overrideable using evironment variable TAG_LOG_FILE_MAXNO
  public LOG_FILE_MAXNO = 10;
  // overrideable using evironment variable TAG_LOG_FILE_MAXSIZE
  public LOG_FILE_MAXSIZE = 10485760;
  // overrideable using evironment variable TAG_CONFIG_TOPICS_MAPPING
  public CONFIG_TOPICS_MAPPING: {[key: string]: string} = {
    smtp: 'alertmanager/smtp',
    sms: 'alertmanager/sms',
  };
  // overrideable using evironment variable TAG_CONFIG_TOPIC_PREFIX
  public CONFIG_TOPIC_PREFIX = 'spiai4suite/';
  // overrideable using evironment variable TAG_CONFIG_TOPIC_ALL_GROUPS_SUFFIX
  public CONFIG_TOPIC_ALL_GROUPS_SUFFIX = 'ALL_GROUPS';
  // overrideable using evironment variable TAG_CONFIG_ALERT_TOPIC
  public CONFIG_ALERT_TOPIC = 'spiai4suite/alertmanager/alertconfig';

  public CONFIG_ALERT_TOPIC_COMBINED = 'spiai4suite/alertmanager/alertsettings';

  public CONFIG_DEVICES_COMMIT_TOPIC = 'spiai4suite/DEVICES';

  public CONFIG_DEVICES_TYPES_COMMIT_TOPIC = 'spiai4suite/DEVICES-TYPES';

  public CONFIG_DEVICE_TYPES_INIT_TOPIC_SUFFIX = 'ALL';

  public DEFAULT_CONFIG_FILENAME = 'config.json';
  // array of topics to suscribe
  public TOPIC_SUBSCRTIPIONS: Array<string> = [];
  // array of topic

  public retainedMessages: string[] = [
    this.CONFIG_TOPIC_PREFIX + this.CONFIG_TOPIC_ALL_GROUPS_SUFFIX,
    this.CONFIG_DEVICES_TYPES_COMMIT_TOPIC + '/ALL',
  ];

  public port = '8090';

  public host = '0.0.0.0';

  public cors = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400,
    credentials: true,
  };

  public rootGroupId = '00000000-0000-0000-0000-000000000000';
  // overrideable using evironment variable TAG_MQTTCONFIG
  public mqttconfig: MQTTConfig = new MQTTConfig();

  public loglevel = 'debug';
  // only to be used for debugging.
  public sendTestGroupMessage = -1;
  // for the test message
  public numberOfGroupsPerLevel = 1;

  public defaultTimeZone = 'Asia/Kolkata';

  public tokenSecret = 'SECRET';

  public tokenExpires = 24 * 60 * 60 * 2; //2 days

  public passwordRounds = 10;

  public enableAuthentication = true;

  public defaultCreds: DefaultCredentials = new DefaultCredentials();

  public info = {
    version: 'DEV',
    user: 'DEV',
    hostname: 'HOSTNAME',
    config: {
      alertmax: 50,
      notificationmax: 100,
      language: 'en',
    },
  };

  constructor() {
    this.port = process.env.PORT ?? this.port;

    this.host = process.env.HOST ?? this.host;
  }
}

// export class Info{
//   public version:string;
//   public user:string;
//   public hostname: string;

//   public config : {
//     alertmax : 50.
//         notificationmax : 100
//         language : 'en'
//   }
// }

export class MQTTConfig {
  // TAG_MQTTCONFIG_AUTHENTICATIONENABLED
  public authenticationEnabled = true;
  // TAG_MQTTCONFIG_USERNAME
  public username = 'spiai4user';
  // TAG_MQTTCONFIG_PASSWORD
  public password = 'All your sensors are mine';
  // TAG_MQTTCONFIG_BROKER
  public broker = 'localhost';

  public reconnectTimeout = 100; // milliseconds

  public clientOptions = {
    // TAG_MQTTCONFIG_CLIENTOPTIONS_KEEPALIVE
    keepAlive: 1,
    // TAG_MQTTCONFIG_CLIENTOPTIONS_CONNECTTIMEOUT
    connectTimeout: 10000,
    // TAG_MQTTCONFIG_CLIENTOPTIONS_RECONNECTPERIOD
    reconnectPeriod: 10000,
  };
}

export class DefaultCredentials {
  public email = 'spiai4user@spiatech.com';

  public password = 'spiai4user';
}
