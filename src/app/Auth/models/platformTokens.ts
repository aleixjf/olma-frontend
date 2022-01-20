import { TokenDTO } from 'src/app/Shared/models/token.dto';

export interface PlatformTokens {
  olma: TokenDTO;
  olma_refresh?: TokenDTO;

  spotify?: TokenDTO;
  spotify_refresh?: TokenDTO;

  onedrive?: TokenDTO;
  onedrive_refresh?: TokenDTO;

  dropbox?: TokenDTO;
  dropbox_refresh?: TokenDTO;
}
