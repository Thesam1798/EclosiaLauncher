export interface UserData {
  user: user | undefined | null
  accessToken: string | undefined | null
  clientToken: string | undefined | null
  selectedProfile: selectedProfile | undefined | null
  availableProfiles: availableProfiles[] | undefined | null
}

export interface user {
  username: string | undefined | null
  id: string | undefined | null
  autologin: boolean | undefined | null
}

export interface selectedProfile {
  name: string | undefined | null
  id: string | undefined | null
}

export interface availableProfiles {
  name: string | undefined | null
  id: string | undefined | null
}
