import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default StyleSheet.create({

container:{

flexDirection:"row",

justifyContent:"space-between",

alignItems:"center",

paddingVertical:18,

borderBottomWidth:1,

borderBottomColor:Colors.border,

},

left:{

flexDirection:"row",

alignItems:"center",

},

textContainer:{

marginLeft:16,

},

title:{

fontSize:16,

fontWeight:"600",

color:Colors.text,

},

subtitle:{

marginTop:4,

fontSize:13,

color:Colors.textSecondary,

}

});