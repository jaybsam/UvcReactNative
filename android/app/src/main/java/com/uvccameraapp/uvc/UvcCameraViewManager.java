package com.uvccameraapp.uvc;

import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

public class UvcCameraViewManager extends SimpleViewManager<UvcCameraView> {
    public static final String REACT_CLASS = "UvcCameraView";
    
    private ReactApplicationContext reactContext;
    
    public UvcCameraViewManager(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
    }
    
    @Override
    @NonNull
    public String getName() {
        return REACT_CLASS;
    }
    
    @Override
    @NonNull
    public UvcCameraView createViewInstance(@NonNull ThemedReactContext reactContext) {
        UvcCameraView cameraView = new UvcCameraView(reactContext);
        
        // Try to get the camera module from the native modules
        UvcCameraModule cameraModule = reactContext.getNativeModule(UvcCameraModule.class);
        if (cameraModule != null) {
            cameraView.setCameraModule(cameraModule);
        }
        
        return cameraView;
    }
    
    @ReactProp(name = "style")
    public void setStyle(UvcCameraView view, @Nullable ReadableArray style) {
        // Handle styling if needed
    }
    
    @Override
    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put("onCameraReady", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onCameraReady")))
                .put("onCameraError", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onCameraError")))
                .build();
    }
}