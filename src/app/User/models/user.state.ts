import { UserDTO } from './user.dto';
import { PayloadDTO } from 'src/app/Shared/models/payload.dto';

export interface UserState {
  user: UserDTO | null;
  error: PayloadDTO | null;
  pending: boolean;
}

export const initialState: UserState = {
  user: null,
  error: null,
  pending: false,
};
