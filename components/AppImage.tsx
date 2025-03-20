import React, { ReactNode, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ImageBackgroundProps,
  ImageProps,
  View,
  ViewStyle,
} from "react-native";

interface CustomImageProps {
  children?: ReactNode;
  backgroundImg?: boolean;
}

const AppImage: React.FC<
  ImageProps & ImageBackgroundProps & CustomImageProps
> = ({ backgroundImg = false, children, ...otherProps }) => {
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  return (
    <View>
      {backgroundImg ? (
        <ImageBackground
          {...otherProps}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
        >
          {children}
        </ImageBackground>
      ) : (
        <Image
          {...otherProps}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
        />
      )}
      {imageLoading ? (
        <View
          style={{
            ...(otherProps.style as ViewStyle),
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : null}
    </View>
  );
};

export default AppImage;
