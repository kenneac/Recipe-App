// import { View } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { COLORS } from "@/constants/colors";

// const SafeScreen = ({ children }) => {
//   const insets = useSafeAreaInsets();

//   return (
//     <View style={{ paddingTop: insets.top, flex: 1, backgroundColor: COLORS.background }}>
//       {children}
//     </View>
//   );
// };
// export default SafeScreen;

import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePathname } from "expo-router";
import { COLORS } from "@/constants/colors";

const SafeScreen = ({ children }) => {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const isRecipeScreen = pathname.startsWith("/recipe");

  return (
    <View
      style={{
        paddingTop: isRecipeScreen ? 0 : insets.top,
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      {children}
    </View>
  );
};

export default SafeScreen;
