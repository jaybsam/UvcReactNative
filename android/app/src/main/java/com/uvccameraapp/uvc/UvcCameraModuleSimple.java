package com.uvccameraapp.uvc;

import android.content.Context;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.util.HashMap;

public class UvcCameraModuleSimple extends ReactContextBaseJavaModule {
    private static final String TAG = "UvcCameraSimple";
    private static final String MODULE_NAME = "UvcCamera";
    
    private ReactApplicationContext reactContext;
    private UsbManager usbManager;
    
    public UvcCameraModuleSimple(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        try {
            usbManager = (UsbManager) reactContext.getSystemService(Context.USB_SERVICE);
            Log.d(TAG, "Simple UVC Camera module initialized successfully");
        } catch (Exception e) {
            Log.e(TAG, "Error initializing simple USB manager", e);
        }
    }
    
    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }
    
    @ReactMethod
    public void startMonitoring(Promise promise) {
        try {
            Log.d(TAG, "Starting USB monitoring (simple mode)");
            promise.resolve("USB monitoring started (simple mode)");
        } catch (Exception e) {
            Log.e(TAG, "Error starting USB monitoring", e);
            promise.reject("ERROR", "Failed to start monitoring: " + e.getMessage());
        }
    }
    
    @ReactMethod
    public void stopMonitoring(Promise promise) {
        try {
            Log.d(TAG, "Stopping USB monitoring");
            promise.resolve("USB monitoring stopped");
        } catch (Exception e) {
            Log.e(TAG, "Error stopping USB monitoring", e);
            promise.reject("ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void getConnectedDevices(Promise promise) {
        try {
            WritableArray devices = Arguments.createArray();
            
            if (usbManager != null) {
                HashMap<String, UsbDevice> deviceList = usbManager.getDeviceList();
                for (UsbDevice device : deviceList.values()) {
                    WritableMap deviceMap = Arguments.createMap();
                    deviceMap.putString("deviceName", device.getDeviceName());
                    deviceMap.putInt("vendorId", device.getVendorId());
                    deviceMap.putInt("productId", device.getProductId());
                    if (device.getManufacturerName() != null) {
                        deviceMap.putString("manufacturerName", device.getManufacturerName());
                    }
                    if (device.getProductName() != null) {
                        deviceMap.putString("productName", device.getProductName());
                    }
                    devices.pushMap(deviceMap);
                }
            }
            
            promise.resolve(devices);
        } catch (Exception e) {
            Log.e(TAG, "Error getting connected devices", e);
            promise.reject("ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void startPreview(Promise promise) {
        try {
            Log.d(TAG, "Preview functionality not yet implemented");
            promise.reject("ERROR", "Preview functionality requires UVC library integration");
        } catch (Exception e) {
            Log.e(TAG, "Error starting preview", e);
            promise.reject("ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void stopPreview(Promise promise) {
        try {
            promise.resolve("Preview stopped");
        } catch (Exception e) {
            Log.e(TAG, "Error stopping preview", e);
            promise.reject("ERROR", e.getMessage());
        }
    }
}