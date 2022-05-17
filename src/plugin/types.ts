export type popupTypeCode = "code";
export type popupTypeToken = "token";

export type popupTypes = popupTypeCode | popupTypeToken;

export type callback = (response: credentialPopupResponse) => void;
export type tokenCallback = (response: tokenPopupResponse) => void;
export type codeCallback = (response: codePopupResponse) => void;

/** Actions to be performed after library is loaded */
export type actionOnLibraryLoad = (google: google) => void;

/**
 * A wrapper function which makes sure google Client Library is loaded and then give an access to the SDK api
 * @param action A function to execute some actions only after google Client Library is loaded
 */
export type libraryLoaded = (action: actionOnLibraryLoad) => void;
export interface buttonConfig {
  /** The button [type](https://developers.google.com/identity/gsi/web/reference/js-reference#type): icon, or standard button */
  type?: "standard" | "icon";
  /** The button [theme](https://developers.google.com/identity/gsi/web/reference/js-reference#theme). For example, filled_blue or filled_black */
  theme?: "outline" | "filled_blue" | "filled_black";
  /** The button [size](https://developers.google.com/identity/gsi/web/reference/js-reference#size). For example, small or large */
  size?: "large" | "medium" | "small";
  /** The button [text](https://developers.google.com/identity/gsi/web/reference/js-reference#text). For example, "Sign in with Google" or "Sign up with Google" */
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  /**	The button [shape](https://developers.google.com/identity/gsi/web/reference/js-reference#shape). For example, rectangular or circular */
  shape?: "rectangular" | "pill" | "circle" | "square";
  /**	The Google [logo alignment](https://developers.google.com/identity/gsi/web/reference/js-reference#logo_alignment): left or center */
  logo_alignment?: "left" | "center";
  /** The button [width](https://developers.google.com/identity/gsi/web/reference/js-reference#width), in pixels */
  width?: string;
  /** If set, then the button [language](https://developers.google.com/identity/gsi/web/reference/js-reference#locale) is rendered */
  locale?: string;
}

export type clientId = string | null;

export type buttonId = string;

export type context = "signin" | "signup" | "use";

export interface idConfiguration {
  /**Your Google API client ID */
  client_id?: clientId;
  /** Enables automatic selection on Google One Tap */
  auto_select?: boolean;
  /** ID token callback handler */
  callback?: callback;
  /** The Sign In With Google button UX flow */
  ux_mode?: "popup" | "redirect";
  /** The URL of your login endpoint */
  login_uri?: string;
  /** The URL of your password credential handler endpoint */
  native_login_uri?: string;
  /** The JavaScript password credential handler function name */
  native_callback?: (response: { id: string; password: string }) => void;
  /** Controls whether to cancel the prompt if the user clicks outside of the prompt */
  cancel_on_tap_outside?: boolean;
  /** The DOM ID of the One Tap prompt container element */
  prompt_parent_id?: string;
  /** A random string for ID tokens */
  nonce?: string;
  /** The title and words in the One Tap prompt */
  context?: context;
  /** If you need to call One Tap in the parent domain and its subdomains, pass the parent domain to this attribute so that a single shared cookie is used. */
  state_cookie_domain?: string;
  /** The origins that are allowed to embed the intermediate iframe. One Tap will run in the intermediate iframe mode if this attribute presents */
  allowed_parent_origin?: string | string[];
  /**	Overrides the default intermediate iframe behavior when users manually close One Tap */
  intermediate_iframe_close_callback?: () => void;
  /** Enables upgraded One Tap UX on ITP browsers */
  itp_support?: boolean;
  /**
   * If your application knows the Workspace domain the user belongs to,
   * use this to provide a hint to Google. For more information,
   * see the [hd](https://developers.google.com/identity/protocols/oauth2/openid-connect#authenticationuriparameters)
   * field in the OpenID Connect docs.
   */
  hosted_domain?: string;
}

export interface options {
  clientId?: clientId;
  prompt?: boolean;
  autoLogin?: boolean;
  popupType?: popupTypes;
  idConfiguration: idConfiguration | null;
  buttonConfig: buttonConfig;
  callback: callback;
}

export type props = {
  /**Your Google API client ID, to create one [follow these steps](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid)*/
  clientId?: clientId;
  /** To show the One-tap and Automatic-Login prompt */
  prompt?: boolean;
  /** Boolean value showing whether the  google client library is loaded or not */
  autoLogin?: boolean;
  /** Type of popup, if set to 'code' will give an Auth code in the popup call back and if set to 'token' the popup callback will give as an access token */
  popupType?: popupTypes;
  /** IdConfiguration object for initializing, see list of fields and descriptions of the IdConfiguration [here](https://developers.google.com/identity/gsi/web/reference/js-reference#IdConfiguration) */
  idConfiguration?: idConfiguration;
  /** Configuration of the login button rendered by Google, see list of fields and descriptions of these configurations [here](https://developers.google.com/identity/gsi/web/reference/js-reference#GsiButtonConfiguration) */
  buttonConfig?: buttonConfig;
  /** Callback function to triggered on successfull login */
  callback?: callback;
};

export interface libraryState {
  apiLoaded: boolean;
  apiLoadIntitited: boolean;
}

export type codeResponseCallback = (response: codePopupResponse) => void;
export type tokenResponseCallback = (response: tokenPopupResponse) => void;

export interface loginConfig<T> {
  /**Your Google API client ID */
  clientId?: clientId;
  /**Callback to be triggered on user selects account from popup */
  callback?: T extends popupTypeCode
    ? codeResponseCallback
    : tokenResponseCallback;
}

export interface codePopupResponse {
  authuser?: string;
  /** The authorization code of a successful token response */
  code?: string;
  /** Type of prompt presented to the user */
  prompt?: string;
  /**	A space-delimited list of scopes that are approved by the user */
  scope?: string;
}

export interface tokenPopupResponse {
  /** The access token of a successful token response. */
  access_token?: string;
  authuser?: string;
  /** The lifetime in seconds of the access token. */
  expires_in?: string;
  /** Type of prompt presented to the user */
  prompt?: string;
  /** A space-delimited list of scopes that are approved by the user. */
  scope?: string;
  /** The type of the token issued. */
  token_type?: string;
}

export interface credentialPopupResponse {
  clientId?: string;
  /** JWT credential string */
  credential?: string;
  /** This field shows how the credential is selected */
  select_by?:
    | "auto"
    | "user"
    | "user_1tap"
    | "user_2tap"
    | "btn"
    | "btn_confirm"
    | "brn_add_session"
    | "btn_confirm_add_session";
}

/**
 * For retriving the JWT payload from the credential
 * @param token JWT credential string
 * @returns Decoded payload from the JWT credential string
 */
export type parseJWT = (token: string) => object;

/**
 * A helper function to trigger login popup using google.accounts.oauth2.initCodeClient function under the hoods
 * @param options To see available options check [here](https://developers.google.com/identity/oauth2/web/guides/use-code-model)
 * @returns A promise which get resolved with an auth code once user login through the popup
 */
export interface openCode {
  (options: loginConfig<popupTypeCode>): Promise<codePopupResponse>;
}

/**
 * A helper function to trigger login popup using google.accounts.oauth2.initTokenClient function under the hoods
 * @param options To see available options check [here](https://developers.google.com/identity/oauth2/web/guides/use-code-model)
 * @returns A promise which get resolved with an access token once user login through the popup
 */
export interface openToken {
  (options: loginConfig<popupTypeToken>): Promise<tokenPopupResponse>;
}
export interface promptNotification {
  /** Is this notification for a display moment? */
  isDisplayMoment: () => boolean;
  /** Is this notification for a display moment, and the UI is displayed? */
  isDisplayed: () => boolean;
  /** Is this notification for a display moment, and the UI isn't displayed? */
  isNotDisplayed: () => boolean;
  /** The detailed reason why the UI isn't displayed */
  getNotDisplayedReason: () =>
    | "browser_not_supported"
    | "invalid_client"
    | "missing_client_id"
    | "opt_out_or_no_session"
    | "secure_http_required"
    | "suppressed_by_user"
    | "unregistered_origin"
    | "unknown_reason";
  /** Is this notification for a skipped moment? */
  isSkippedMoment: () => boolean;
  /** The detailed reason for the skipped moment */
  getSkippedReason: () =>
    | "auto_cancel"
    | "user_cancel"
    | "tap_outside"
    | "issuing_failed";
  /** Is this notification for a dismissed moment? */
  isDismissedMoment: () => boolean;
  /** The detailed reason for the dismissal */
  getDismissedReason: () =>
    | "credential_returned"
    | "cancel_called"
    | "flow_restarted";
  /** Return a string for the moment type */
  getMomentType: () => "display" | "skipped" | "dismissed";
}

export type onPromptNotification = (
  promptNotification: promptNotification
) => void;

export interface promptOptions {
  /**Your Google API client ID */
  clientId?: clientId;
  /** The title and words in the One Tap prompt */
  context?: context;
  /** Boolean value showing whether the  google client library is loaded or not */
  autoLogin?: boolean;
  /** Controls whether to cancel the prompt if the user clicks outside of the prompt */
  cancelOnTapOutside?: boolean;
  /** A callback triggered on recieving notifications on the prompt UI status  */
  onNotification?: onPromptNotification;
  /** Callback function to triggered on successfull login */
  callback?: callback;
}

/**
 * A function to open one-tap and automatic log-in prompt
 * @returns A promise which get resolved once user login through the prompt
 */
export type prompt = (
  options: promptOptions
) => Promise<credentialPopupResponse>;

/**
 * This will make user to login and select account again by disabling auto select
 */
export type logout = () => void;
interface TokenClientConfig {
  /**
   *  The client ID for your application. You can find this value in the
   *  [API Console](https://console.cloud.google.com/apis/dashboard)
   */
  client_id: clientId;

  /**
   * A space-delimited list of scopes that identify the resources
   * that your application could access on the user's behalf.
   * These values inform the consent screen that Google displays to the user
   */
  scope: string;

  /**
   * Required for popup UX. The JavaScript function name that handles returned code response
   * The property will be ignored by the redirect UX
   */
  callback?: (response: tokenPopupResponse) => void;

  /**
   * Optional, defaults to 'select_account'. A space-delimited, case-sensitive list of prompts to present the user
   */
  prompt?: "" | "none" | "consent" | "select_account";

  /**
   * 	Optional, defaults to true. If set to false,
   * [more granular Google Account permissions](https://developers.googleblog.com/2018/10/more-granular-google-account.html)
   * will be disabled for clients created before 2019. No effect for newer clients,
   * since more granular permissions is always enabled for them.
   */
  enable_serial_consent?: boolean;

  /**
   * Optional. If your application knows which user should authorize the request,
   * it can use this property to provide a hint to Google.
   * The email address for the target user. For more information,
   * see the [login_hint](https://developers.google.com/identity/protocols/oauth2/openid-connect#authenticationuriparameters) field in the OpenID Connect docs.
   */
  hint?: string;

  /**
   * Optional. If your application knows the Workspace domain the user belongs to,
   * use this to provide a hint to Google. For more information,
   * see the [hd](https://developers.google.com/identity/protocols/oauth2/openid-connect#authenticationuriparameters)
   * field in the OpenID Connect docs.
   */
  hosted_domain?: string;

  /**
   * Optional. Not recommended. Specifies any string value that
   * your application uses to maintain state between your authorization
   * request and the authorization server's response.
   */
  state?: string;
}

export interface OverridableTokenClientConfig {
  /**
   * Optional. A space-delimited, case-sensitive list of prompts to present the user.
   */
  prompt?: string;

  /**
   * Optional. If set to false,
   * [more granular Google Account permissions](https://developers.googleblog.com/2018/10/more-granular-google-account.html)
   * will be disabled for clients created before 2019.
   * No effect for newer clients, since more granular permissions is always enabled for them.
   */
  enable_serial_consent?: boolean;

  /**
   * Optional. If your application knows which user should authorize the request,
   * it can use this property to provide a hint to Google.
   *  The email address for the target user. For more information,
   * see the [login_hint](https://developers.google.com/identity/protocols/oauth2/openid-connect#authenticationuriparameters) field in the OpenID Connect docs.
   */
  hint?: string;

  /**
   * Optional. Not recommended. Specifies any string value that your
   * application uses to maintain state between your authorization request
   * and the authorization server's response.
   */
  state?: string;
}

export interface CodeClientConfig {
  /**
   * Required. The client ID for your application. You can find this value in the
   * [API Console](https://console.developers.google.com/)
   */
  client_id: clientId;

  /**
   * Required. A space-delimited list of scopes that identify
   * the resources that your application could access on the user's behalf.
   * These values inform the consent screen that Google displays to the user
   */
  scope: string;

  /**
   * Required for redirect UX. Determines where the API server redirects
   * the user after the user completes the authorization flow.
   * The value must exactly match one of the authorized redirect URIs for the OAuth 2.0 client,
   *  which you configured in the API Console and must conform to our
   * [Redirect URI validation](https://developers.google.com/identity/protocols/oauth2/web-server#uri-validation) rules. The property will be ignored by the popup UX
   */
  redirect_uri?: string;

  /**
   * Required for popup UX. The JavaScript function name that handles
   * returned code response. The property will be ignored by the redirect UX
   */
  callback?: (codeResponse: codePopupResponse) => void;

  /**
   * Optional. Recommended for redirect UX. Specifies any string value that
   *  your application uses to maintain state between your authorization request and the authorization server's response
   */
  state?: string;

  /**
   * Optional, defaults to true. If set to false,
   * [more granular Google Account permissions](https://developers.googleblog.com/2018/10/more-granular-google-account.html)
   * will be disabled for clients created before 2019. No effect for newer clients, since
   * more granular permissions is always enabled for them
   */
  enable_serial_consent?: boolean;

  /**
   * Optional. If your application knows which user should authorize the request,
   * it can use this property to provide a hint to Google.
   * The email address for the target user. For more information,
   * see the [login_hint](https://developers.google.com/identity/protocols/oauth2/openid-connect#authenticationuriparameters) field in the OpenID Connect docs
   */
  hint?: string;

  /**
   * Optional. If your application knows the Workspace domain
   * the user belongs to, use this to provide a hint to Google.
   * For more information, see the [hd](https://developers.google.com/identity/protocols/oauth2/openid-connect#authenticationuriparameters) field in the OpenID Connect docs
   */
  hosted_domain?: string;

  /**
   * 	Optional. The UX mode to use for the authorization flow.
   * By default, it will open the consent flow in a popup. Valid values are popup and redirect
   */
  ux_mode?: "popup" | "redirect";

  /**
   * Optional, defaults to 'false'. Boolean value to prompt the user to select an account
   */
  select_account?: boolean;
}

/** This variable holds an access to google client SDK */
export interface google {
  accounts: {
    id: {
      initialize: (input: idConfiguration) => void;
      prompt: Function;
      renderButton: (
        parent: HTMLElement,
        options: buttonConfig,
        clickHandler?: () => void
      ) => void;
      disableAutoSelect: () => void;
      storeCredential: (
        credential: { id: string; password: string },
        callback?: () => void
      ) => void;
      cancel: () => void;
      onGoogleLibraryLoad: Function;
      revoke: (accessToken: string, done: () => void) => void;
    };
    oauth2: {
      initTokenClient: (config: TokenClientConfig) => {
        requestAccessToken: (
          overridableClientConfig?: OverridableTokenClientConfig
        ) => void;
      };
      initCodeClient: (config: CodeClientConfig) => {
        requestCode: () => void;
      };
      hasGrantedAnyScope: (
        tokenRsponse: tokenPopupResponse,
        firstScope: string,
        ...restScopes: string[]
      ) => boolean;
      hasGrantedAllScopes: (
        tokenRsponse: tokenPopupResponse,
        firstScope: string,
        ...restScopes: string[]
      ) => boolean;
      revoke: (accessToken: string, done?: () => void) => void;
    };
  };
}
export interface Window {
  google: google;
}