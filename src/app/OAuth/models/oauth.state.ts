import { PayloadDTO } from 'src/app/Shared/models/payload.dto';

export interface OAuthState {
  flow?: string;
  state?: string;
  code?: string;
  pkce: {
    code_verifier: string;
    code_challenge: string;
  } | null;
  error: PayloadDTO | null;
  pending: boolean;
}

export const initialState: OAuthState = {
  flow: undefined,
  state: undefined,
  code: undefined,
  pkce: null,
  error: null,
  pending: false,
};
