import { View, Text } from "react-native";
import { COLORS } from "../../constants/theme";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";

type MyCalendarScreenProps = StackScreenProps<RootStackParamList, 'MyCalendar'>;

const MyCalendar = ({ navigation, route }: MyCalendarScreenProps) => {

  return (
    <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
      <Text> MY CALENDAR SCREEN</Text>
    </View>
  );
};
export default MyCalendar;
