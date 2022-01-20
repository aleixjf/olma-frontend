export interface OAuthCallback {
  error?: string | null | undefined | null | undefined;
  error_description?: string | null | undefined;

  state?: string | null | undefined;
  code?: string | null | undefined;
  id_token?: string | null | undefined;

  jwt?: string | null | undefined;
  expires_in?: number | null | undefined;
  token_type?: string | null | undefined;
}
