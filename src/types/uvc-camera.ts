export interface UsbDevice {
  deviceName: string;
  vendorId: number;
  productId: number;
  manufacturerName?: string;
  productName?: string;
}

export interface UvcCameraModule {
  startMonitoring(): Promise<string>;
  stopMonitoring(): Promise<string>;
  getConnectedDevices(): Promise<UsbDevice[]>;
  startPreview(): Promise<string>;
  stopPreview(): Promise<string>;
}

declare module 'react-native' {
  interface NativeModulesStatic {
    UvcCamera: UvcCameraModule;
  }
}