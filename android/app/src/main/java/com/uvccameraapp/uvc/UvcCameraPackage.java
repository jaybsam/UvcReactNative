package com.uvccameraapp.uvc;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class UvcCameraPackage implements ReactPackage {
    
    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        // Temporarily use simple module to test Android 12 compatibility
        modules.add(new UvcCameraModuleSimple(reactContext));
        // modules.add(new UvcCameraModule(reactContext));
        return modules;
    }
    
    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        // Temporarily disable view managers for testing
        return Collections.emptyList();
        // List<ViewManager> viewManagers = new ArrayList<>();
        // viewManagers.add(new UvcCameraViewManager(reactContext));
        // return viewManagers;
    }
}