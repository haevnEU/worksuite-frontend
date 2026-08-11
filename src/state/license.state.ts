type LicenseListener = (isExpired: boolean) => void;

class LicenseStateManager {
  private isExpired: boolean = false;
  private listeners: Set<LicenseListener> = new Set();

  public setExpired(expired: boolean): void {
    if (this.isExpired !== expired) {
      this.isExpired = expired;
      this.listeners.forEach((listener) => listener(this.isExpired));
    }
  }

  public getIsExpired(): boolean {
    return this.isExpired;
  }

  public subscribe(listener: LicenseListener): () => void {
    this.listeners.add(listener);
    listener(this.isExpired);
    return () => this.listeners.delete(listener);
  }
}

export const LicenseStateManagerInstance = new LicenseStateManager();
