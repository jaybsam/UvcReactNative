package com.uvccameraapp.uvc;

import android.content.Context;
import android.graphics.SurfaceTexture;
import android.util.AttributeSet;
import android.view.Surface;
import android.view.TextureView;

public class UvcCameraView extends TextureView implements TextureView.SurfaceTextureListener {
    private static final String TAG = "UvcCameraView";
    
    private Surface surface;
    private UvcCameraModule cameraModule;
    
    public UvcCameraView(Context context) {
        super(context);
        init();
    }
    
    public UvcCameraView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }
    
    public UvcCameraView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }
    
    private void init() {
        setSurfaceTextureListener(this);
    }
    
    public void setCameraModule(UvcCameraModule module) {
        this.cameraModule = module;
    }
    
    @Override
    public void onSurfaceTextureAvailable(SurfaceTexture surfaceTexture, int width, int height) {
        surface = new Surface(surfaceTexture);
        if (cameraModule != null) {
            cameraModule.setPreviewSurface(surface);
        }
    }
    
    @Override
    public void onSurfaceTextureSizeChanged(SurfaceTexture surfaceTexture, int width, int height) {
        // Handle size changes if needed
    }
    
    @Override
    public boolean onSurfaceTextureDestroyed(SurfaceTexture surfaceTexture) {
        if (surface != null) {
            surface.release();
            surface = null;
        }
        return true;
    }
    
    @Override
    public void onSurfaceTextureUpdated(SurfaceTexture surfaceTexture) {
        // Handle texture updates if needed
    }
}