class LocalStorageService {
  constructor() {}

  get(key: string) {
    return localStorage.getItem(key);
  }

  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  get_accesstoken() {
    return this.get("access_token");
  }

  set_accesstoken(accessToken: string) {
    this.set("access_token", accessToken);
  }
}

export { LocalStorageService };
