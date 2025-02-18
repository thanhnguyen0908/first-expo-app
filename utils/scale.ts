import { Dimensions, PixelRatio } from "react-native";

// Retrieve initial screen's width
let screenWidth = Dimensions.get("window").width;

// Retrieve initial screen's height
let screenHeight = Dimensions.get("window").height;

/**
 * Converts provided width percentage to independent pixel (dp).
 */
const widthPercentageToDP = (widthPercent: any) => {
  const elemWidth =
    typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};

/**
 * Converts provided height percentage to independent pixel (dp).
 */
const heightPercentageToDP = (heightPercent: any) => {
  const elemHeight =
    typeof heightPercent === "number"
      ? heightPercent
      : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};

let orientationChangeListener: any = null;

/**
 * Event listener function that detects orientation changes.
 */
const listenOrientationChange = (that: any) => {
  orientationChangeListener = Dimensions.addEventListener(
    "change",
    ({ window }) => {
      screenWidth = window.width;
      screenHeight = window.height;

      that.setState({
        orientation: screenWidth < screenHeight ? "portrait" : "landscape",
      });
    }
  );
};

/**
 * Removes the orientation change listener.
 */
const removeOrientationListener = () => {
  if (orientationChangeListener) {
    orientationChangeListener.remove();
    orientationChangeListener = null;
  }
};

export {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange,
  removeOrientationListener,
};
