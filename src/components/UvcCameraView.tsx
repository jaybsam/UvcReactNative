import React, { forwardRef, useImperativeHandle } from 'react';
import { requireNativeComponent, ViewStyle } from 'react-native';

interface UvcCameraViewProps {
  style?: ViewStyle;
  onCameraReady?: () => void;
  onCameraError?: (error: string) => void;
}

export interface UvcCameraViewRef {
  // Add any ref methods you might need
}

const NativeUvcCameraView = requireNativeComponent<UvcCameraViewProps>('UvcCameraView');

const UvcCameraView = forwardRef<UvcCameraViewRef, UvcCameraViewProps>(
  ({ style, onCameraReady, onCameraError, ...props }, ref) => {
    useImperativeHandle(ref, () => ({}));

    return (
      <NativeUvcCameraView
        style={style}
        onCameraReady={onCameraReady}
        onCameraError={onCameraError}
        {...props}
      />
    );
  }
);

UvcCameraView.displayName = 'UvcCameraView';

export default UvcCameraView;