//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

export class CollectConfigurationConstants {
  public CONFIG_FILE_LOCATION_WIN32 =
    'C:/SPIA/Config/CollectWebServerConfig.json';

  public CONFIG_FILE_LOCATION_NIX = '/opt/SPIA/Config/CollectWebServerConfig.json';

  public LOG_FILE_LOCATION_WIN32 =
    'C:/SPIA/Logs/CollectWebServer/CollectWebServerlog.txt';

  public DATABASE_LOCATION_WIN32 =
    'C:/SPIA/AppData/CollectWebServer/CollectWebServer.db';

  public DATABASE_LOCATION_NIX = '/opt/SPIA/AppData/CollectWebServer/CollectWebServer.db';

  public LOG_FILE_LOCATION_NIX = '/opt/SPIA/Logs/CollectWebServer/CollectWebServerlog.txt';

  public LOG_FILE_MAXNO = 10;

  public LOG_FILE_MAXSIZE = 10485760;

  public CONFIG_TOPICS_MAPPING: {[key: string]: string} = {
    smtp: 'alertmanager/smtp',
    sms: 'alertmanager/sms',
  };

  public CONFIG_TOPIC_PREFIX = 'spiai4suite/';

  public CONFIG_TOPIC_ALL_GROUPS_SUFFIX = 'ALL_GROUPS';

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
  public authenticationEnabled = true;

  public username = 'spiai4user';

  public password = 'All your sensors are mine';

  public broker = 'localhost';

  public reconnectTimeout = 10000; // milliseconds

  public clientOptions = {
    keepAlive: 1,
    connectTimeout: 10000,
    reconnectPeriod: 10000,
  };
}

export class DefaultCredentials {
  public email = 'spiai4user@spiatech.com';

  public password = 'spiai4user';
}
