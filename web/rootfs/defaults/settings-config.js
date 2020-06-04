{{ $XMPP_DOMAIN := .Env.XMPP_DOMAIN | default "jitsi-meet.example.com" -}}
{{ $CONFIG_BOSH_HOST := .Env.CONFIG_BOSH_HOST | default "" }}
{{ $CONFIG_RESOLUTION := .Env.CONFIG_RESOLUTION | default "720" -}}
{{ $CONFIG_RESOLUTION_MIN := .Env.CONFIG_RESOLUTION_MIN | default "180" -}}
{{ $CONFIG_RESOLUTION_WIDTH := .Env.CONFIG_RESOLUTION_WIDTH | default "1280" -}}
{{ $CONFIG_RESOLUTION_WIDTH_MIN := .Env.CONFIG_RESOLUTION_WIDTH_MIN | default "320" -}}
{{ $CONFIG_DISABLE_SIMULCAST := .Env.CONFIG_DISABLE_SIMULCAST | default "false" -}}
{{ $CONFIG_ENABLE_REMB := .Env.CONFIG_ENABLE_REMB | default "true" -}}
{{ $CONFIG_ENABLE_TCC := .Env.CONFIG_ENABLE_TCC | default "true" -}}
{{ $ENABLE_RECORDING := .Env.ENABLE_RECORDING | default "false" | toBool -}}
{{ $CONFIG_FILE_RECORDING_SERVICE_ENABLED := .Env.CONFIG_FILE_RECORDING_SERVICE_ENABLED | default "false" | toBool -}}
{{ $CONFIG_FILE_RECORDING_SERVICE_SHARING_ENABLED := .Env.CONFIG_FILE_RECORDING_SERVICE_SHARING_ENABLED | default "false" | toBool -}}
{{ $CONFIG_EXTERNAL_CONNECT := .Env.CONFIG_EXTERNAL_CONNECT | default "false" | toBool -}}
{{ $XMPP_RECORDER_DOMAIN := .Env.XMPP_RECORDER_DOMAIN | default "" -}}
{{ $XMPP_RECORDER_DOMAIN_PREFIX := .Env.XMPP_RECORDER_DOMAIN_PREFIX | default "recorder" -}}
{{ $CONFIG_CHROME_MIN_EXT_VERSION := .Env.CONFIG_CHROME_MIN_EXT_VERSION | default "0.1" -}}
{{ $CONFIG_ENABLE_USER_ROLES_BASED_ON_TOKEN := .Env.CONFIG_ENABLE_USER_ROLES_BASED_ON_TOKEN | default "false" -}}
{{ $CONFIG_TESTING_OCTO_PROBABILITY := .Env.CONFIG_TESTING_OCTO_PROBABILITY | default "0" -}}
{{ $CONFIG_TESTING_CAP_SCREENSHARE_BITRATE := .Env.CONFIG_TESTING_CAP_SCREENSHARE_BITRATE | default "1" -}}
{{ $ENABLE_LIPSYNC := .Env.ENABLE_LIPSYNC | default "false" | toBool -}}
{{ $ENABLE_SUBDOMAINS := .Env.ENABLE_SUBDOMAINS | default "false" | toBool -}}
{{ $ENABLE_TRANSCRIPTIONS := .Env.ENABLE_TRANSCRIPTIONS | default "false" | toBool -}}
{{ $CONFIG_ENABLE_STATS_ID := .Env.CONFIG_ENABLE_STATS_ID | default "false" | toBool -}}
{{ $CONFIG_OPEN_BRIDGE_CHANNEL := .Env.CONFIG_OPEN_BRIDGE_CHANNEL | default "datachannel" -}}
{{ $CONFIG_DISABLE_BRIDGE_CHANNEL := .Env.CONFIG_DISABLE_BRIDGE_CHANNEL | default "false" | toBool -}}
{{ $CONFIG_STEREO := .Env.CONFIG_STEREO | default "false" | toBool -}}
{{ $CONFIG_ENABLE_TALK_WHILE_MUTED := .Env.CONFIG_ENABLE_TALK_WHILE_MUTED | default "false" | toBool -}}
{{ $CONFIG_ENABLE_NO_AUDIO_DETECTION := .Env.CONFIG_ENABLE_NO_AUDIO_DETECTION | default "false" | toBool -}}
{{ $CONFIG_ENABLE_CALENDAR := .Env.CONFIG_ENABLE_CALENDAR | default "false" | toBool -}}
{{ $CONFIG_REQUIRE_DISPLAY_NAME := .Env.CONFIG_REQUIRE_DISPLAY_NAME | default "false" | toBool -}}
{{ $CONFIG_REQUIRE_DISPLAY_NAME := .Env.CONFIG_REQUIRE_DISPLAY_NAME | default "false" | toBool -}}
{{ $CONFIG_START_VIDEO_MUTED := .Env.CONFIG_START_VIDEO_MUTED | default 10 -}}
{{ $CONFIG_START_AUDIO_MUTED := .Env.CONFIG_START_AUDIO_MUTED | default 10 -}}
{{ $CONFIG_USE_STUN_TURN := .Env.CONFIG_USE_STUN_TURN | default "true" | toBool -}}
{{ $CONFIG_USE_IPV6 := .Env.CONFIG_USE_IPV6 | default "true" | toBool -}}
{{ $CONFIG_DEPLOYMENTINFO_USERREGION := .Env.CONFIG_DEPLOYMENTINFO_USERREGION | default "<!--# echo var=\"http_x_proxy_region\" default=\"\" -->" -}}

{{ if $CONFIG_EXTERNAL_CONNECT -}}
    {{ if $ENABLE_SUBDOMAINS -}}
config.externalConnectUrl = '//{{ if .Env.CONFIG_BOSH_HOST }}{{ .Env.CONFIG_BOSH_HOST }}{{ end }}/<!--# echo var="subdir" default="" -->http-pre-bind';
    {{ else -}}
config.externalConnectUrl = '//{{ if .Env.CONFIG_BOSH_HOST }}{{ .Env.CONFIG_BOSH_HOST }}{{ end }}/http-pre-bind';
    {{ end -}}
{{ end -}}

config.startAudioMuted = {{ $CONFIG_START_AUDIO_MUTED }};
config.startVideoMuted = {{ $CONFIG_START_VIDEO_MUTED }};

config.resolution = {{ $CONFIG_RESOLUTION }};
Object.assign(config.constraints, {});
Object.assign(config.constraints.video, {});
config.constraints.video.height = {ideal: {{$CONFIG_RESOLUTION}}, max: {{$CONFIG_RESOLUTION}}, min: {{$CONFIG_RESOLUTION_MIN}}};
config.constraints.video.width = {ideal: {{$CONFIG_RESOLUTION_WIDTH}}, max: {{$CONFIG_RESOLUTION_WIDTH}}, min: {{$CONFIG_RESOLUTION_WIDTH_MIN}}};

config.enableTcc = {{ $CONFIG_ENABLE_TCC }};
config.enableRemb = {{ $CONFIG_ENABLE_REMB }};

// Enable / disable simulcast support.
config.disableSimulcast = {{ $CONFIG_DISABLE_SIMULCAST }};

// testing values, defaults should be sane
Object.assign(config.testing, {});
config.testing.capScreenshareBitrate = {{ $CONFIG_TESTING_CAP_SCREENSHARE_BITRATE }};
Object.assign(config.testing.octo, {});
config.testing.octo.probability = {{ $CONFIG_TESTING_OCTO_PROBABILITY }};

{{ if .Env.CONFIG_CHROME_EXT_ID -}}
config.desktopSharingChromeExtId = '{{.Env.CONFIG_CHROME_EXT_ID}}';
config.desktopSharingChromeMinExtVersion = '{{ $CONFIG_CHROME_MIN_EXT_VERSION }}';
{{ end -}}

{{ if $ENABLE_RECORDING }}
// recording settings
{{ if $XMPP_RECORDER_DOMAIN -}}
config.hiddenDomain = '{{ $XMPP_RECORDER_DOMAIN }}';
{{ else -}}
config.hiddenDomain = '{{ $XMPP_RECORDER_DOMAIN_PREFIX }}.{{ $XMPP_DOMAIN }}';
{{ end -}}
// Whether to enable file recording or not
config.fileRecordingsEnabled = true;

// Whether to enable live streaming or not.
config.liveStreamingEnabled = true;
{{ if .Env.CONFIG_DROPBOX_APPKEY -}}
// Enable the dropbox integration.
Object.assign(config.dropbox, {});
config.dropbox.appKey = '{{ .Env.CONFIG_DROPBOX_APPKEY }}';
{{ if .Env.CONFIG_DROPBOX_REDIRECT_URI -}}
// A URL to redirect the user to, after authenticating
// by default uses:
// 'https://jitsi-meet.example.com/static/oauth.html'
config.dropbox.redirectURI = '{{ .Env.CONFIG_DROPBOX_REDIRECT_URI }}';
{{ end -}}
{{ end -}}

{{ if $CONFIG_FILE_RECORDING_SERVICE_ENABLED -}}
// When integrations like dropbox are enabled only that will be shown,
// by enabling fileRecordingsServiceEnabled, we show both the integrations
// and the generic recording service (its configuration and storage type
// depends on jibri configuration)
config.fileRecordingsServiceEnabled = true;
{{ end -}}
{{ if $CONFIG_FILE_RECORDING_SERVICE_SHARING_ENABLED -}}
// Whether to show the possibility to share file recording with other people
// (e.g. meeting participants), based on the actual implementation
// on the backend.
config.fileRecordingsServiceSharingEnabled = true;
{{ end -}}
{{ end -}}

{{ if $ENABLE_TRANSCRIPTIONS }}
// Transcription (in interface_config,
// subtitles and buttons can be configured)
config.transcribingEnabled = true;
{{ end -}}

{{ if $CONFIG_USE_STUN_TURN -}}
// Use XEP-0215 to fetch STUN and TURN servers.
config.useStunTurn = true;
{{ else -}}
// Skip STUN and TURN.
config.useStunTurn = false;
{{ end -}}

{{ if $CONFIG_USE_IPV6 -}}
// Enable IPv6 support.
config.useIPv6 = true;
{{ else -}}
// Disable IPv6 support.
config.useIPv6 = false;
{{ end -}}

// Enables / disables a data communication channel with the Videobridge.
// Values can be 'datachannel', 'websocket', true (treat it as
// 'datachannel'), undefined (treat it as 'datachannel') and false (don't
// open any channel).
{{ if $CONFIG_DISABLE_BRIDGE_CHANNEL }}
{{ else -}}
config.openBridgeChannel = '{{ $CONFIG_OPEN_BRIDGE_CHANNEL }}';
{{ end -}}

{{ if $CONFIG_REQUIRE_DISPLAY_NAME -}}
// Require users to always specify a display name.
config.requireDisplayName = true;
{{ else -}}
// No need to specify a display name.
config.requireDisplayName = false;
{{ end -}}

// configure client features based on existence of JWT token
config.enableUserRolesBasedOnToken = {{ $CONFIG_ENABLE_USER_ROLES_BASED_ON_TOKEN }};

{{ if $CONFIG_ENABLE_CALENDAR -}}
config.enableCalendarIntegration = true;
{{ end -}}

{{ if .Env.CONFIG_CALLSTATS_ID -}}
    // To enable sending statistics to callstats.io you must provide the
    // Application ID and Secret.
config.callStatsID = '{{ .Env.CONFIG_CALLSTATS_ID }}';
{{ end -}}
{{ if .Env.CONFIG_CALLSTATS_ID -}}
config.callStatsSecret = '{{ .Env.CONFIG_CALLSTATS_SECRET }}';
{{ end -}}
{{ if $CONFIG_ENABLE_STATS_ID -}}
// enables callstatsUsername to be reported as statsId and used
// by callstats as repoted remote id
config.enableStatsID = true;
{{ end -}}

{{ if .Env.CONFIG_P2P_STUNTURN -}}
Object.assign(config.p2p, {});
config.p2p.useStunTurn = true;
{{ end -}}

Object.assign(config.analytics, {});
{{ if .Env.CONFIG_GOOGLE_ANALYTICS_ID -}}
// The Google Analytics Tracking ID:
config.analytics.googleAnalyticsTrackingId = '{{ .Env.CONFIG_GOOGLE_ANALYTICS_ID }}';
{{ end -}}
{{ if .Env.CONFIG_AMPLITUDE_ID -}}
// The Amplitude APP Key:
config.analytics.amplitudeAPPKey = '{{ .Env.CONFIG_AMPLITUDE_ID }}';
{{ end -}}
{{ if .Env.CONFIG_ANALYTICS_WHITELISTED_EVENTS -}}
config.analytics.whiteListedEvents = [ '{{ join "','" (splitList "," .Env.CONFIG_ANALYTICS_WHITELISTED_EVENTS) }}' ];
{{ end -}}
{{ if .Env.CONFIG_ANALYTICS_SCRIPT_URLS -}}
// Array of script URLs to load as lib-jitsi-meet "analytics handlers".
config.analytics.scriptURLs = [ '{{ join "','" (splitList "," .Env.CONFIG_ANALYTICS_SCRIPT_URLS) }}' ];
{{ end -}}

Object.assign(config.deploymentInfo, {});
{{ if .Env.CONFIG_DEPLOYMENTINFO_ENVIRONMENT -}}
config.deploymentInfo.environment = '{{ .Env.CONFIG_DEPLOYMENTINFO_ENVIRONMENT }}';
{{ end -}}
{{ if .Env.CONFIG_DEPLOYMENTINFO_ENVIRONMENT_TYPE -}}
config.deploymentInfo.envType = '{{ .Env.CONFIG_DEPLOYMENTINFO_ENVIRONMENT_TYPE }}';
{{ end -}}
{{ if $CONFIG_DEPLOYMENTINFO_USERREGION -}}
config.deploymentInfo.userRegion = '{{ $CONFIG_DEPLOYMENTINFO_USERREGION }}';
{{ end -}}

{{ if $ENABLE_LIPSYNC -}}
// Lipsync hack in jicofo, may not be safe
config.enableLipSync = true;
{{ end -}}
{{ if .Env.CONFIG_START_BITRATE -}}
config.startBitrate = '{{ .Env.CONFIG_START_BITRATE }}';
{{ end -}}
{{ if $CONFIG_STEREO -}}
config.stereo = true;
{{ end -}}
{{ if $CONFIG_ENABLE_TALK_WHILE_MUTED -}}
config.enableTalkWhileMuted = true;
{{ end -}}
{{ if $CONFIG_ENABLE_NO_AUDIO_DETECTION -}}
config.enableNoAudioDetection = true;
{{ end -}}
{{ if .Env.CONFIG_GOOGLE_API_APP_CLIENT_ID -}}
config.googleApiApplicationClientID = '{{ .Env.CONFIG_GOOGLE_API_APP_CLIENT_ID }}';
{{ end -}}
{{ if .Env.CONFIG_MICROSOFT_API_APP_CLIENT_ID -}}
config.microsoftApiApplicationClientID = '{{ .Env.CONFIG_MICROSOFT_API_APP_CLIENT_ID }}';
{{ end -}}
{{ if .Env.CONFIG_CALLSTATS_CUSTOM_SCRIPT_URL -}}
config.callStatsCustomScriptUrl = '{{ .Env.CONFIG_CALLSTATS_CUSTOM_SCRIPT_URL }}';
{{ end -}}
{{ if .Env.ETHERPAD_URL_BASE -}}
config.etherpad_base = '{{.Env.PUBLIC_URL}}/etherpad/p/';
{{ end -}}
{{ if .Env.CONFIG_DIALIN_NUMBERS_URL -}}
config.dialInNumbersUrl = '{{ .Env.CONFIG_DIALIN_NUMBERS_URL }}';
{{ end -}}
{{ if .Env.CONFIG_CONFCODE_URL -}}
config.dialInConfCodeUrl = '{{ .Env.CONFIG_CONFCODE_URL }}';
{{ end -}}
{{ if .Env.CONFIG_DIALOUT_CODES_URL -}}
config.dialOutCodesUrl = '{{ .Env.CONFIG_DIALOUT_CODES_URL }}';
{{ end -}}
{{ if .Env.CONFIG_DIALOUT_AUTH_URL -}}
config.dialOutAuthUrl = '{{ .Env.CONFIG_DIALOUT_AUTH_URL }}';
{{ end -}}
{{ if .Env.CONFIG_PEOPLE_SEARCH_URL -}}
config.peopleSearchUrl = '{{ .Env.CONFIG_PEOPLE_SEARCH_URL }}';
{{ end -}}
{{ if .Env.CONFIG_PEOPLE_SEARCH_URL -}}
config.peopleSearchQueryTypes = ['user','conferenceRooms'];
{{ end -}}
{{ if .Env.CONFIG_INVITE_SERVICE_URL -}}
config.inviteServiceUrl = '{{ .Env.CONFIG_INVITE_SERVICE_URL }}';
{{ end -}}
{{ if .Env.CONFIG_INVITE_SERVICE_CALLFLOWS_URL -}}
config.inviteServiceCallFlowsUrl = '{{ .Env.CONFIG_INVITE_SERVICE_CALLFLOWS_URL }}';
{{ end -}}

{{ if .Env.CONFIG_CHROME_EXTENSION_BANNER_JSON -}}
config.chromeExtensionBanner = {{ .Env.CONFIG_CHROME_EXTENSION_BANNER_JSON }};
{{ end -}}
