import { NativeModules } from 'react-native';
import type { UvcCameraModule, UsbDevice } from '../types/uvc-camera';

const { UvcCamera } = NativeModules as { UvcCamera: UvcCameraModule };

class UvcCameraManager {
  private isMonitoring = false;
  
  async startMonitoring(): Promise<string> {
    if (this.isMonitoring) {
      return 'Already monitoring';
    }
    
    try {
      const result = await UvcCamera.startMonitoring();
      this.isMonitoring = true;
      return result;
    } catch (error) {
      throw new Error(`Failed to start monitoring: ${error}`);
    }
  }
  
  async stopMonitoring(): Promise<string> {
    if (!this.isMonitoring) {
      return 'Not monitoring';
    }
    
    try {
      const result = await UvcCamera.stopMonitoring();
      this.isMonitoring = false;
      return result;
    } catch (error) {
      throw new Error(`Failed to stop monitoring: ${error}`);
    }
  }
  
  async getConnectedDevices(): Promise<UsbDevice[]> {
    try {
      return await UvcCamera.getConnectedDevices();
    } catch (error) {
      throw new Error(`Failed to get connected devices: ${error}`);
    }
  }
  
  async startPreview(): Promise<string> {
    try {
      return await UvcCamera.startPreview();
    } catch (error) {
      throw new Error(`Failed to start preview: ${error}`);
    }
  }
  
  async stopPreview(): Promise<string> {
    try {
      return await UvcCamera.stopPreview();
    } catch (error) {
      throw new Error(`Failed to stop preview: ${error}`);
    }
  }
  
  get isCurrentlyMonitoring(): boolean {
    return this.isMonitoring;
  }
}

export default new UvcCameraManager();
export type { UsbDevice };