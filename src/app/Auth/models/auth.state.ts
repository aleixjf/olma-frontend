import { CredentialsDTO } from './credentials.dto';
import { PayloadDTO } from 'src/app/Shared/models/payload.dto';

export interface AuthState {
  credentials: CredentialsDTO | null;
  authenticated: boolean;
  admin: boolean;
  error: PayloadDTO | null;
  pending: boolean;
}

export const initialState: AuthState = {
  credentials: null,
  authenticated: false,
  admin: false,
  error: null,
  pending: false,
};
